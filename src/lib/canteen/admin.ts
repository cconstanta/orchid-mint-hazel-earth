import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { isoWeekday, todayISO } from "@/lib/utils";
import { ensureSeeded, rolloverBoard } from "./seed";
import type {
  AdminDish,
  Announcement,
  CategoryStat,
  DayPoint,
  DishStat,
  Order,
  Report,
  Wish,
} from "./types";

const STAFF_PIN = "2468";

function assertStaff(pin: string) {
  if (pin !== STAFF_PIN) throw new Error("Неверный код сотрудника");
}

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

const pinSchema = z.object({ pin: z.string().min(1) });

export const verifyStaff = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    return { ok: true as const };
  });

export const getAdminCatalog = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertStaff(data.pin);
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
      cost: number;
      weight_g: number;
      calories: number;
      protein: number;
      fat: number;
      carbs: number;
      tags: string;
      image_key: string;
      featured: boolean;
      is_available: boolean;
      on_board: boolean;
      portion_limit: number | null;
      portions_sold: number;
      sort_order: number;
    }>(
      `select d.id, d.category_id, c.slug as category_slug, c.name as category_name,
              d.name, d.description, d.price, d.cost, d.weight_g, d.calories,
              d.protein, d.fat, d.carbs, d.tags, d.image_key, d.featured,
              d.is_available, d.on_board, d.portion_limit, d.portions_sold, d.sort_order
       from dishes d join categories c on c.id = d.category_id
       order by c.sort_order, d.sort_order, d.name`,
    );
    const dishes: AdminDish[] = rows.map((r) => ({
      ...r,
      tags: splitTags(r.tags),
      portions_left:
        r.portion_limit == null ? null : Math.max(0, r.portion_limit - r.portions_sold),
    }));
    const plan = await sql.query<{ weekday: number; dish_id: number }>(
      "select weekday, dish_id from weekday_plan",
    );
    const planMap: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const row of plan) {
      (planMap[row.weekday] ??= []).push(row.dish_id);
    }
    return { categories, dishes, plan: planMap, weekday: isoWeekday() };
  });

export const upsertDish = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      id: z.number().int().optional(),
      category_id: z.number().int(),
      name: z.string().trim().min(2).max(80),
      description: z.string().trim().max(280),
      price: z.number().int().min(1).max(5000),
      cost: z.number().int().min(0).max(5000),
      weight_g: z.number().int().min(0).max(3000),
      calories: z.number().int().min(0).max(3000),
      protein: z.number().int().min(0).max(300),
      fat: z.number().int().min(0).max(300),
      carbs: z.number().int().min(0).max(400),
      tags: z.string().max(80),
      image_key: z.string().max(40),
      portion_limit: z.number().int().min(1).max(999).nullable(),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    if (data.id) {
      await sql.query(
        `update dishes set
           category_id=$1, name=$2, description=$3, price=$4, cost=$5,
           weight_g=$6, calories=$7, protein=$8, fat=$9, carbs=$10,
           tags=$11, image_key=$12, portion_limit=$13
         where id=$14`,
        [
          data.category_id,
          data.name,
          data.description,
          data.price,
          data.cost,
          data.weight_g,
          data.calories,
          data.protein,
          data.fat,
          data.carbs,
          data.tags,
          data.image_key,
          data.portion_limit,
          data.id,
        ],
      );
      return { id: data.id };
    }
    const rows = await sql.query<{ id: number }>(
      `insert into dishes (
         category_id, name, description, price, cost, weight_g, calories,
         protein, fat, carbs, tags, image_key, portion_limit, is_available, on_board
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,true,false)
       returning id`,
      [
        data.category_id,
        data.name,
        data.description,
        data.price,
        data.cost,
        data.weight_g,
        data.calories,
        data.protein,
        data.fat,
        data.carbs,
        data.tags,
        data.image_key,
        data.portion_limit,
      ],
    );
    return { id: rows[0]!.id };
  });

export const setDishFlags = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      id: z.number().int(),
      on_board: z.boolean().optional(),
      is_available: z.boolean().optional(),
      featured: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    if (data.on_board !== undefined) {
      await sql.query("update dishes set on_board = $1 where id = $2", [
        data.on_board,
        data.id,
      ]);
    }
    if (data.is_available !== undefined) {
      await sql.query("update dishes set is_available = $1 where id = $2", [
        data.is_available,
        data.id,
      ]);
    }
    if (data.featured !== undefined) {
      await sql.query("update dishes set featured = $1 where id = $2", [
        data.featured,
        data.id,
      ]);
    }
    return { ok: true };
  });

export const applyWeekdayPlan = createServerFn({ method: "POST" })
  .validator(z.object({ pin: z.string().min(1), weekday: z.number().int().min(1).max(6) }))
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    await sql.query("update dishes set on_board = false, portions_sold = 0");
    await sql.query(
      `update dishes set on_board = true
       where id in (select dish_id from weekday_plan where weekday = $1)`,
      [data.weekday],
    );
    await sql.query(
      `insert into site_settings (key, value) values ('board_date', $1)
       on conflict (key) do update set value = excluded.value`,
      [todayISO()],
    );
    return { ok: true };
  });

export const saveWeekdayPlan = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      weekday: z.number().int().min(1).max(6),
      dish_ids: z.array(z.number().int()).max(40),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    await sql.query("delete from weekday_plan where weekday = $1", [data.weekday]);
    for (const id of data.dish_ids) {
      await sql.query(
        "insert into weekday_plan (weekday, dish_id) values ($1,$2) on conflict do nothing",
        [data.weekday, id],
      );
    }
    return { ok: true };
  });

export const importSales = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      rows: z
        .array(
          z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            dish: z.string().trim().min(1).max(80),
            qty: z.number().int().min(1).max(5000),
            price: z.number().int().min(1).max(5000).optional(),
          }),
        )
        .min(1)
        .max(400),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    const dishes = await sql.query<{
      id: number;
      name: string;
      price: number;
      cost: number;
    }>("select id, name, price, cost from dishes");
    const byName = new Map(dishes.map((d) => [d.name.toLowerCase(), d]));
    let imported = 0;
    for (const row of data.rows) {
      const dish = byName.get(row.dish.toLowerCase());
      const price = row.price ?? dish?.price ?? 0;
      if (!price) continue;
      const cost = dish?.cost ?? Math.round(price * 0.45);
      await sql.query(
        `delete from sales_lines
         where sale_date = $1 and lower(dish_name) = lower($2) and source = 'import'`,
        [row.date, row.dish],
      );
      await sql.query(
        `insert into sales_lines (sale_date, dish_id, dish_name, qty, unit_price, unit_cost, source)
         values ($1,$2,$3,$4,$5,$6,'import')`,
        [row.date, dish?.id ?? null, dish?.name ?? row.dish, row.qty, price, cost],
      );
      imported += 1;
    }
    return { imported };
  });

export const getReports = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    const daysRaw = await sql.query<{
      sale_date: string;
      revenue: number;
      cost: number;
      portions: number;
    }>(
      `select sale_date::text as sale_date,
              coalesce(sum(qty * unit_price),0)::int as revenue,
              coalesce(sum(qty * unit_cost),0)::int as cost,
              coalesce(sum(qty),0)::int as portions
       from sales_lines
       where sale_date >= $1 and sale_date <= $2
       group by sale_date
       order by sale_date`,
      [data.from, data.to],
    );
    const days: DayPoint[] = daysRaw.map((d) => ({
      ...d,
      profit: d.revenue - d.cost,
    }));
    const dishesRaw = await sql.query<{
      dish_name: string;
      qty: number;
      revenue: number;
      cost: number;
    }>(
      `select dish_name,
              coalesce(sum(qty),0)::int as qty,
              coalesce(sum(qty * unit_price),0)::int as revenue,
              coalesce(sum(qty * unit_cost),0)::int as cost
       from sales_lines
       where sale_date >= $1 and sale_date <= $2
       group by dish_name
       order by revenue desc`,
      [data.from, data.to],
    );
    const dishes: DishStat[] = dishesRaw.map((d) => ({
      ...d,
      profit: d.revenue - d.cost,
    }));
    const catsRaw = await sql.query<{ category: string | null; revenue: number }>(
      `select coalesce(c.name, 'Прочее') as category,
              coalesce(sum(s.qty * s.unit_price),0)::int as revenue
       from sales_lines s
       left join dishes d on d.id = s.dish_id
       left join categories c on c.id = d.category_id
       where s.sale_date >= $1 and s.sale_date <= $2
       group by coalesce(c.name, 'Прочее')
       order by revenue desc`,
      [data.from, data.to],
    );
    const categories: CategoryStat[] = catsRaw.map((c) => ({
      category: c.category ?? "Прочее",
      revenue: c.revenue,
    }));
    const [{ n: orders_online }] = await sql.query<{ n: number }>(
      `select coalesce(sum(qty),0)::int as n from sales_lines
       where sale_date >= $1 and sale_date <= $2 and source = 'order'`,
      [data.from, data.to],
    );
    const revenue = days.reduce((s, d) => s + d.revenue, 0);
    const cost = days.reduce((s, d) => s + d.cost, 0);
    const report: Report = {
      from: data.from,
      to: data.to,
      revenue,
      cost,
      profit: revenue - cost,
      portions: days.reduce((s, d) => s + d.portions, 0),
      orders_online,
      days,
      dishes,
      categories,
    };
    return report;
  });

export const listOrders = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
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
       from orders order by id desc limit 80`,
    );
    const items = await sql.query<{
      id: number;
      order_id: number;
      dish_id: number | null;
      dish_name: string;
      qty: number;
      unit_price: number;
    }>(
      "select id, order_id, dish_id, dish_name, qty, unit_price from order_items",
    );
    const byOrder = new Map<number, Order["items"]>();
    for (const it of items) {
      const list = byOrder.get(it.order_id) ?? [];
      list.push({
        id: it.id,
        dish_id: it.dish_id,
        dish_name: it.dish_name,
        qty: it.qty,
        unit_price: it.unit_price,
      });
      byOrder.set(it.order_id, list);
    }
    return orders.map((o) => ({ ...o, items: byOrder.get(o.id) ?? [] }));
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      id: z.number().int(),
      status: z.enum(["paid", "cooking", "ready", "picked_up", "cancelled"]),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    const prev = await sql.query<{ status: string }>(
      "select status from orders where id = $1",
      [data.id],
    );
    if (!prev[0]) throw new Error("Заказ не найден");
    await sql.query(
      "update orders set status = $1, updated_at = now() where id = $2",
      [data.status, data.id],
    );
    return { ok: true };
  });

export const listWishesAdmin = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    return sql.query<Wish>(
      `select id, alias, body, votes, status, created_at::text as created_at
       from wishes order by votes desc, id desc`,
    );
  });

export const setWishStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      id: z.number().int(),
      status: z.enum(["new", "planned", "done", "declined"]),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    await sql.query("update wishes set status = $1 where id = $2", [
      data.status,
      data.id,
    ]);
    return { ok: true };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      college_name: z.string().trim().min(3).max(120),
      address: z.string().trim().min(8).max(200),
      phone: z.string().trim().min(6).max(40),
      about: z.string().trim().min(8).max(1200),
      pickup_rules: z.string().trim().min(8).max(800),
      director: z.string().trim().max(120),
      hours_text: z.string().trim().min(8).max(400),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    const pairs: Array<[string, string]> = [
      ["college_name", data.college_name],
      ["address", data.address],
      ["phone", data.phone],
      ["about", data.about],
      ["pickup_rules", data.pickup_rules],
      ["director", data.director],
    ];
    for (const [key, value] of pairs) {
      await sql.query(
        `insert into site_settings (key, value) values ($1,$2)
         on conflict (key) do update set value = excluded.value`,
        [key, value],
      );
    }
    const hoursRows = data.hours_text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [days, rest] = line.split(":").map((s) => s.trim());
        return { days: days || line, line: rest || "", kitchen: "" };
      });
    if (hoursRows.length) {
      await sql.query(
        `insert into site_settings (key, value) values ('hours', $1)
         on conflict (key) do update set value = excluded.value`,
        [JSON.stringify(hoursRows)],
      );
    }
    return { ok: true };
  });

export const addAnnouncement = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      title: z.string().trim().min(3).max(80),
      body: z.string().trim().min(8).max(400),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    const rows = await sql.query<Announcement>(
      `insert into announcements (title, body) values ($1,$2)
       returning id, title, body, is_published, created_at::text as created_at`,
      [data.title, data.body],
    );
    return rows[0];
  });

export const setAnnouncementPublished = createServerFn({ method: "POST" })
  .validator(
    z.object({
      pin: z.string().min(1),
      id: z.number().int(),
      is_published: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    await sql.query("update announcements set is_published = $1 where id = $2", [
      data.is_published,
      data.id,
    ]);
    return { ok: true };
  });

export const listAnnouncementsAdmin = createServerFn({ method: "POST" })
  .validator(pinSchema)
  .handler(async ({ data }) => {
    assertStaff(data.pin);
    const sql = await ready();
    return sql.query<Announcement>(
      `select id, title, body, is_published, created_at::text as created_at
       from announcements order by id desc`,
    );
  });
