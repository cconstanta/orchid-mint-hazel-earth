import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { isoWeekday, todayISO } from "@/lib/utils";
import { ensureSeeded, rolloverBoard } from "./seed";
import { COMBO_DISCOUNT, PICKUP_SLOTS, type Announcement, type PublicDish, type SiteInfo, type Wish } from "./types";

async function ready() {
  const sql = await getSql();
  await ensureSeeded(sql);
  await rolloverBoard(sql);
  return sql;
}

function splitTags(tags: string) {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export const getPublicMenu = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ready();
  const categories = await sql.query<{
    id: number;
    slug: string;
    name: string;
    sort_order: number;
  }>("select id, slug, name, sort_order from categories order by sort_order");
  const rows = await sql.query<{
    id: number;
    category_id: number;
    category_slug: string;
    category_name: string;
    name: string;
    description: string;
    price: number;
    weight_g: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    tags: string;
    image_key: string;
    featured: boolean;
    portion_limit: number | null;
    portions_sold: number;
    sort_order: number;
  }>(
    `select d.id, d.category_id, c.slug as category_slug, c.name as category_name,
            d.name, d.description, d.price, d.weight_g, d.calories, d.protein, d.fat, d.carbs,
            d.tags, d.image_key, d.featured, d.portion_limit, d.portions_sold, d.sort_order
     from dishes d
     join categories c on c.id = d.category_id
     where d.on_board = true and d.is_available = true
     order by c.sort_order, d.sort_order, d.name`,
  );
  const dishes: PublicDish[] = rows.map((r) => ({
    ...r,
    tags: splitTags(r.tags),
    portions_left:
      r.portion_limit == null ? null : Math.max(0, r.portion_limit - r.portions_sold),
  }));
  const wd = isoWeekday();
  return {
    date: todayISO(),
    weekday: wd,
    closed: wd === 7,
    categories,
    dishes,
  };
});

export const getPublicInfo = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ready();
  const rows = await sql.query<{ key: string; value: string }>(
    "select key, value from site_settings",
  );
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  let hours: SiteInfo["hours"] = [];
  try {
    hours = JSON.parse(map.hours ?? "[]") as SiteInfo["hours"];
  } catch {
    hours = [];
  }
  const info: SiteInfo = {
    college_name: map.college_name ?? "",
    canteen_name: map.canteen_name ?? "Столовая «Перемена»",
    address: map.address ?? "",
    phone: map.phone ?? "",
    about: map.about ?? "",
    pickup_rules: map.pickup_rules ?? "",
    director: map.director ?? "",
    hours,
  };
  const announcements = await sql.query<Announcement>(
    `select id, title, body, is_published, created_at::text as created_at
     from announcements where is_published = true order by id desc limit 8`,
  );
  return { info, announcements, slots: PICKUP_SLOTS };
});

export const getPublicWishes = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await ready();
  return sql.query<Wish>(
    `select id, alias, body, votes, status, created_at::text as created_at
     from wishes order by votes desc, id desc`,
  );
});

export const createWish = createServerFn({ method: "POST" })
  .validator(
    z.object({
      alias: z.string().trim().min(2).max(40),
      body: z.string().trim().min(8).max(400),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await ready();
    const rows = await sql.query<Wish>(
      `insert into wishes (alias, body) values ($1, $2)
       returning id, alias, body, votes, status, created_at::text as created_at`,
      [data.alias, data.body],
    );
    return rows[0];
  });

export const voteWish = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number().int() }))
  .handler(async ({ data }) => {
    const sql = await ready();
    await sql.query("update wishes set votes = votes + 1 where id = $1", [data.id]);
    return { ok: true };
  });

export const getOrderByCode = createServerFn({ method: "POST" })
  .validator(z.object({ code: z.string().trim().min(4).max(12) }))
  .handler(async ({ data }) => {
    const sql = await ready();
    const code = data.code.toUpperCase();
    const orders = await sql.query<{
      id: number;
      pickup_code: string;
      guest_label: string;
      group_code: string;
      status: string;
      total: number;
      discount: number;
      pickup_slot: string;
      note: string;
      created_at: string;
    }>(
      `select id, pickup_code, guest_label, group_code, status, total, discount,
              pickup_slot, note, created_at::text as created_at
       from orders where pickup_code = $1`,
      [code],
    );
    const order = orders[0];
    if (!order) return null;
    const items = await sql.query<{
      id: number;
      dish_id: number | null;
      dish_name: string;
      qty: number;
      unit_price: number;
    }>(
      "select id, dish_id, dish_name, qty, unit_price from order_items where order_id = $1",
      [order.id],
    );
    return { ...order, items };
  });

function comboDiscountFor(
  lines: Array<{ category_slug: string; qty: number; name: string }>,
) {
  if (lines.some((l) => l.category_slug === "combos")) return 0;
  const soup = lines.filter((l) => l.category_slug === "soups").reduce((s, l) => s + l.qty, 0);
  const main = lines.filter((l) => l.category_slug === "mains").reduce((s, l) => s + l.qty, 0);
  const drink = lines
    .filter((l) => l.category_slug === "drinks")
    .reduce((s, l) => s + l.qty, 0);
  return Math.min(soup, main, drink) * COMBO_DISCOUNT;
}

function makeCode() {
  const letters = "АВЕКМНОРСТУХ";
  const a = letters[Math.floor(Math.random() * letters.length)];
  const b = letters[Math.floor(Math.random() * letters.length)];
  const n = String(1000 + Math.floor(Math.random() * 9000));
  return `${a}${b}${n}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      guest_label: z.string().trim().min(2).max(40),
      group_code: z.string().trim().min(2).max(16),
      pickup_slot: z.string().min(3).max(24),
      note: z.string().trim().max(160).optional(),
      items: z
        .array(
          z.object({
            dishId: z.number().int(),
            qty: z.number().int().min(1).max(20),
          }),
        )
        .min(1)
        .max(30),
    }),
  )
  .handler(async ({ data }) => {
    if (!PICKUP_SLOTS.includes(data.pickup_slot)) {
      throw new Error("Выберите окно выдачи из списка");
    }
    const sql = await ready();
    const ids = data.items.map((i) => i.dishId);
    const dishes = await sql.query<{
      id: number;
      name: string;
      price: number;
      cost: number;
      category_slug: string;
      on_board: boolean;
      is_available: boolean;
      portion_limit: number | null;
      portions_sold: number;
    }>(
      `select d.id, d.name, d.price, d.cost, c.slug as category_slug,
              d.on_board, d.is_available, d.portion_limit, d.portions_sold
       from dishes d join categories c on c.id = d.category_id
       where d.id in (${ids.map((_, i) => `$${i + 1}`).join(",")})`,
      ids,
    );
    const byId = Object.fromEntries(dishes.map((d) => [d.id, d]));
    const lines: Array<{
      dish: (typeof dishes)[number];
      qty: number;
    }> = [];
    for (const item of data.items) {
      const dish = byId[item.dishId];
      if (!dish || !dish.on_board || !dish.is_available) {
        throw new Error("Блюдо уже сняли с линии. Обновите меню.");
      }
      if (dish.portion_limit != null) {
        const left = dish.portion_limit - dish.portions_sold;
        if (item.qty > left) {
          throw new Error(`«${dish.name}» осталось ${Math.max(0, left)} порц.`);
        }
      }
      lines.push({ dish, qty: item.qty });
    }

    const subtotal = lines.reduce((s, l) => s + l.dish.price * l.qty, 0);
    const discount = comboDiscountFor(
      lines.map((l) => ({
        category_slug: l.dish.category_slug,
        qty: l.qty,
        name: l.dish.name,
      })),
    );
    const total = Math.max(0, subtotal - discount);

    let code = makeCode();
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const exists = await sql.query<{ n: number }>(
        "select count(*)::int as n from orders where pickup_code = $1",
        [code],
      );
      if ((exists[0]?.n ?? 1) === 0) break;
      code = makeCode();
    }

    const inserted = await sql.query<{ id: number }>(
      `insert into orders (pickup_code, guest_label, group_code, status, total, discount, pickup_slot, note)
       values ($1,$2,$3,'paid',$4,$5,$6,$7) returning id`,
      [
        code,
        data.guest_label,
        data.group_code,
        total,
        discount,
        data.pickup_slot,
        data.note ?? "",
      ],
    );
    const orderId = inserted[0]?.id;
    if (!orderId) throw new Error("Не удалось создать заказ");

    const today = todayISO();
    for (const line of lines) {
      await sql.query(
        `insert into order_items (order_id, dish_id, dish_name, qty, unit_price)
         values ($1,$2,$3,$4,$5)`,
        [orderId, line.dish.id, line.dish.name, line.qty, line.dish.price],
      );
      await sql.query(
        "update dishes set portions_sold = portions_sold + $1 where id = $2",
        [line.qty, line.dish.id],
      );
      await sql.query(
        `insert into sales_lines (sale_date, dish_id, dish_name, qty, unit_price, unit_cost, source)
         values ($1,$2,$3,$4,$5,$6,'order')`,
        [today, line.dish.id, line.dish.name, line.qty, line.dish.price, line.dish.cost],
      );
    }

    return { pickup_code: code, total, discount, pickup_slot: data.pickup_slot };
  });
