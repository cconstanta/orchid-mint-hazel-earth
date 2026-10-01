import type { Sql } from "@/lib/db";
import { isoWeekday, todayISO } from "@/lib/utils";

type SeedDish = {
  category: string;
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
  featured?: boolean;
  sort: number;
};

const CATEGORIES = [
  { slug: "soups", name: "Первые блюда", sort: 1 },
  { slug: "mains", name: "Вторые блюда", sort: 2 },
  { slug: "sides", name: "Гарниры", sort: 3 },
  { slug: "salads", name: "Салаты", sort: 4 },
  { slug: "bakery", name: "Выпечка", sort: 5 },
  { slug: "drinks", name: "Напитки", sort: 6 },
  { slug: "combos", name: "Комплексные обеды", sort: 7 },
];

const DISHES: SeedDish[] = [
  {
    category: "soups",
    name: "Борщ украинский",
    description: "Свекольный на говяжьем бульоне, сметана, укроп.",
    price: 95,
    cost: 42,
    weight_g: 300,
    calories: 186,
    protein: 9,
    fat: 8,
    carbs: 18,
    tags: "",
    image_key: "borscht",
    featured: true,
    sort: 1,
  },
  {
    category: "soups",
    name: "Солянка мясная",
    description: "Сборная, с оливками, лимоном и сметаной.",
    price: 110,
    cost: 52,
    weight_g: 300,
    calories: 228,
    protein: 12,
    fat: 12,
    carbs: 16,
    tags: "",
    image_key: "",
    sort: 2,
  },
  {
    category: "soups",
    name: "Куриный с лапшой",
    description: "Прозрачный бульон, домашняя лапша, морковь.",
    price: 85,
    cost: 36,
    weight_g: 300,
    calories: 154,
    protein: 11,
    fat: 5,
    carbs: 16,
    tags: "",
    image_key: "chicken-soup",
    featured: true,
    sort: 3,
  },
  {
    category: "soups",
    name: "Щи суточные",
    description: "Квашенная капуста, морковь, сметана.",
    price: 80,
    cost: 32,
    weight_g: 300,
    calories: 138,
    protein: 6,
    fat: 5,
    carbs: 16,
    tags: "veg",
    image_key: "",
    sort: 4,
  },
  {
    category: "mains",
    name: "Котлета домашняя",
    description: "Свинно-говяжья, с подливкой. Гарнир отдельно.",
    price: 160,
    cost: 78,
    weight_g: 120,
    calories: 318,
    protein: 18,
    fat: 22,
    carbs: 8,
    tags: "",
    image_key: "cutlet",
    featured: true,
    sort: 1,
  },
  {
    category: "mains",
    name: "Гуляш говяжий",
    description: "Томатная подлива, паприка. К гречке или пюре.",
    price: 190,
    cost: 96,
    weight_g: 180,
    calories: 342,
    protein: 24,
    fat: 18,
    carbs: 14,
    tags: "",
    image_key: "goulash",
    featured: true,
    sort: 2,
  },
  {
    category: "mains",
    name: "Рыба в кляре",
    description: "Филе минтая, лимон. По пятницам — рыбный день.",
    price: 175,
    cost: 84,
    weight_g: 140,
    calories: 304,
    protein: 22,
    fat: 14,
    carbs: 18,
    tags: "",
    image_key: "fish",
    sort: 3,
  },
  {
    category: "mains",
    name: "Плов",
    description: "Рис, говядина, морковь, зира.",
    price: 155,
    cost: 70,
    weight_g: 250,
    calories: 386,
    protein: 16,
    fat: 14,
    carbs: 48,
    tags: "",
    image_key: "plov",
    sort: 4,
  },
  {
    category: "mains",
    name: "Макароны по-флотски",
    description: "Спирали с тушёной говядиной и луком.",
    price: 140,
    cost: 58,
    weight_g: 250,
    calories: 412,
    protein: 18,
    fat: 16,
    carbs: 48,
    tags: "",
    image_key: "",
    sort: 5,
  },
  {
    category: "mains",
    name: "Курица запечённая",
    description: "Бедро в травах, без панировки.",
    price: 170,
    cost: 80,
    weight_g: 160,
    calories: 286,
    protein: 26,
    fat: 16,
    carbs: 4,
    tags: "",
    image_key: "",
    sort: 6,
  },
  {
    category: "sides",
    name: "Картофельное пюре",
    description: "На молоке, со сливочным маслом.",
    price: 55,
    cost: 18,
    weight_g: 180,
    calories: 162,
    protein: 4,
    fat: 6,
    carbs: 24,
    tags: "veg",
    image_key: "",
    sort: 1,
  },
  {
    category: "sides",
    name: "Гречка",
    description: "Рассыпчатая, заправленная маслом.",
    price: 50,
    cost: 16,
    weight_g: 180,
    calories: 174,
    protein: 6,
    fat: 4,
    carbs: 30,
    tags: "veg",
    image_key: "",
    sort: 2,
  },
  {
    category: "sides",
    name: "Рис отварной",
    description: "Длиннозёрный, рассыпчатый.",
    price: 45,
    cost: 14,
    weight_g: 180,
    calories: 178,
    protein: 4,
    fat: 1,
    carbs: 38,
    tags: "veg",
    image_key: "",
    sort: 3,
  },
  {
    category: "salads",
    name: "Оливье",
    description: "Классический, с варёным яйцом и горошком.",
    price: 85,
    cost: 32,
    weight_g: 150,
    calories: 224,
    protein: 6,
    fat: 16,
    carbs: 12,
    tags: "",
    image_key: "olivier",
    sort: 1,
  },
  {
    category: "salads",
    name: "Винегрет",
    description: "Свекла, картофель, квашеная капуста, горошек.",
    price: 70,
    cost: 22,
    weight_g: 150,
    calories: 128,
    protein: 3,
    fat: 6,
    carbs: 16,
    tags: "veg",
    image_key: "",
    sort: 2,
  },
  {
    category: "salads",
    name: "Капуста свежая",
    description: "С морковью и подсолнечным маслом.",
    price: 55,
    cost: 14,
    weight_g: 120,
    calories: 72,
    protein: 2,
    fat: 4,
    carbs: 8,
    tags: "veg",
    image_key: "",
    sort: 3,
  },
  {
    category: "salads",
    name: "Огурец с яйцом",
    description: "Свежий огурец, яйцо, зелёный лук, сметана.",
    price: 75,
    cost: 26,
    weight_g: 140,
    calories: 148,
    protein: 6,
    fat: 10,
    carbs: 6,
    tags: "veg",
    image_key: "",
    sort: 4,
  },
  {
    category: "bakery",
    name: "Пирожок с капустой",
    description: "Дрожжевой, печёный, из утренней смены.",
    price: 45,
    cost: 14,
    weight_g: 80,
    calories: 214,
    protein: 5,
    fat: 8,
    carbs: 30,
    tags: "veg",
    image_key: "pirozhok",
    featured: true,
    sort: 1,
  },
  {
    category: "bakery",
    name: "Булочка с корицей",
    description: "Мягкая, с сахарной коричной начинкой.",
    price: 50,
    cost: 16,
    weight_g: 70,
    calories: 238,
    protein: 5,
    fat: 8,
    carbs: 36,
    tags: "veg",
    image_key: "",
    sort: 2,
  },
  {
    category: "bakery",
    name: "Сырники",
    description: "Творожные, со сметаной и ягодным соусом.",
    price: 95,
    cost: 38,
    weight_g: 160,
    calories: 286,
    protein: 14,
    fat: 12,
    carbs: 28,
    tags: "veg",
    image_key: "syrniki",
    sort: 3,
  },
  {
    category: "drinks",
    name: "Компот из сухофруктов",
    description: "Яблоко, курага, изюм. Кувшин с линии.",
    price: 40,
    cost: 12,
    weight_g: 200,
    calories: 86,
    protein: 0,
    fat: 0,
    carbs: 22,
    tags: "veg",
    image_key: "",
    sort: 1,
  },
  {
    category: "drinks",
    name: "Какао",
    description: "На молоке, с пенкой.",
    price: 55,
    cost: 18,
    weight_g: 200,
    calories: 142,
    protein: 5,
    fat: 5,
    carbs: 18,
    tags: "veg",
    image_key: "cocoa",
    sort: 2,
  },
  {
    category: "drinks",
    name: "Чай с лимоном",
    description: "Чёрный листовой, лимон отдельно.",
    price: 30,
    cost: 8,
    weight_g: 200,
    calories: 8,
    protein: 0,
    fat: 0,
    carbs: 2,
    tags: "veg",
    image_key: "",
    sort: 3,
  },
  {
    category: "drinks",
    name: "Морс клюквенный",
    description: "Кисловатый, без красителя.",
    price: 45,
    cost: 14,
    weight_g: 200,
    calories: 68,
    protein: 0,
    fat: 0,
    carbs: 16,
    tags: "veg",
    image_key: "",
    sort: 4,
  },
  {
    category: "combos",
    name: "Комплекс «Классика»",
    description: "Борщ, котлета с пюре, компот. Выгоднее по отдельности.",
    price: 250,
    cost: 112,
    weight_g: 780,
    calories: 752,
    protein: 31,
    fat: 36,
    carbs: 72,
    tags: "",
    image_key: "combo",
    featured: true,
    sort: 1,
  },
  {
    category: "combos",
    name: "Комплекс «Сытный»",
    description: "Солянка, гуляш с гречкой, морс.",
    price: 280,
    cost: 128,
    weight_g: 830,
    calories: 812,
    protein: 42,
    fat: 34,
    carbs: 78,
    tags: "",
    image_key: "combo",
    sort: 2,
  },
];

const WEEKDAY_NAMES: Record<number, string[]> = {
  1: [
    "Борщ украинский",
    "Котлета домашняя",
    "Картофельное пюре",
    "Оливье",
    "Пирожок с капустой",
    "Компот из сухофруктов",
    "Чай с лимоном",
    "Комплекс «Классика»",
  ],
  2: [
    "Солянка мясная",
    "Гуляш говяжий",
    "Гречка",
    "Винегрет",
    "Булочка с корицей",
    "Какао",
    "Морс клюквенный",
    "Комплекс «Сытный»",
  ],
  3: [
    "Куриный с лапшой",
    "Плов",
    "Капуста свежая",
    "Пирожок с капустой",
    "Компот из сухофруктов",
    "Чай с лимоном",
    "Сырники",
    "Рис отварной",
  ],
  4: [
    "Щи суточные",
    "Макароны по-флотски",
    "Огурец с яйцом",
    "Гречка",
    "Какао",
    "Пирожок с капустой",
    "Комплекс «Классика»",
    "Чай с лимоном",
  ],
  5: [
    "Куриный с лапшой",
    "Рыба в кляре",
    "Картофельное пюре",
    "Капуста свежая",
    "Морс клюквенный",
    "Булочка с корицей",
    "Компот из сухофруктов",
    "Комплекс «Классика»",
  ],
  6: [
    "Борщ украинский",
    "Курица запечённая",
    "Рис отварной",
    "Винегрет",
    "Сырники",
    "Какао",
    "Пирожок с капустой",
    "Чай с лимоном",
  ],
};

const HOURS = [
  { days: "Понедельник — пятница", line: "08:00–16:00", kitchen: "09:00–15:30" },
  { days: "Суббота", line: "09:00–14:00", kitchen: "09:30–13:30" },
  { days: "Воскресенье", line: "выходной", kitchen: "" },
];

function hash32(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function qtyFor(date: string, name: string, weekday: number) {
  const n = hash32(`${date}:${name}`);
  let base = 10 + (n % 38);
  if (weekday === 6) base = Math.round(base * 0.55);
  if (name.includes("Комплекс")) base = Math.round(base * 0.7);
  if (name.includes("Пирожок") || name.includes("Чай")) base = Math.round(base * 1.25);
  if (name.includes("Рыба") && weekday !== 5) base = Math.round(base * 0.35);
  return Math.max(4, base);
}

let seeding: Promise<void> | null = null;

export async function ensureSeeded(sql: Sql) {
  if (!seeding) {
    seeding = seedOnce(sql).catch((err) => {
      seeding = null;
      throw err;
    });
  }
  await seeding;
  await sql.query(
    `delete from announcements a
     using announcements b
     where a.title = b.title and a.id > b.id`,
  );
}

async function seedOnce(sql: Sql) {
  for (const c of CATEGORIES) {
    await sql.query(
      `insert into categories (slug, name, sort_order) values ($1, $2, $3)
       on conflict (slug) do nothing`,
      [c.slug, c.name, c.sort],
    );
  }

  const [{ n: dishCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from dishes",
  );
  if (dishCount === 0) {
    const cats = await sql.query<{ id: number; slug: string }>(
      "select id, slug from categories",
    );
    const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
    for (const d of DISHES) {
      await sql.query(
        `insert into dishes (
           category_id, name, description, price, cost, weight_g, calories,
           protein, fat, carbs, tags, image_key, featured, sort_order, is_available, on_board
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,true,false)`,
        [
          catId[d.category],
          d.name,
          d.description,
          d.price,
          d.cost,
          d.weight_g,
          d.calories,
          d.protein,
          d.fat,
          d.carbs,
          d.tags,
          d.image_key,
          Boolean(d.featured),
          d.sort,
        ],
      );
    }
  }

  const [{ n: planCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from weekday_plan",
  );
  if (planCount === 0) {
    const dishes = await sql.query<{ id: number; name: string }>(
      "select id, name from dishes",
    );
    const byName = Object.fromEntries(dishes.map((d) => [d.name, d.id]));
    for (const [day, names] of Object.entries(WEEKDAY_NAMES)) {
      for (const name of names) {
        const id = byName[name];
        if (!id) continue;
        await sql.query(
          "insert into weekday_plan (weekday, dish_id) values ($1, $2) on conflict do nothing",
          [Number(day), id],
        );
      }
    }
  }

  const [{ n: onBoard }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from dishes where on_board = true",
  );
  if (onBoard === 0) {
    const wd = isoWeekday();
    const planDay = wd === 7 ? 6 : wd;
    await sql.query(
      `update dishes set on_board = true
       where id in (select dish_id from weekday_plan where weekday = $1)`,
      [planDay],
    );
  }

  const settings: Array<[string, string]> = [
    ["college_name", "ГБПОУ «Политех-колледж №12»"],
    ["canteen_name", "Столовая «Перемена»"],
    ["address", "127018, г. Москва, ул. Учебная, д. 12, 1 этаж"],
    ["phone", "+7 (495) 120-12-12"],
    [
      "about",
      "Столовая колледжа работает для студентов, преподавателей и сотрудников. Линия раздачи — комплексные обеды и свободный выбор. С 2026 года можно собрать заказ заранее, оплатить полностью и забрать в выбранное окно без очереди.",
    ],
    [
      "pickup_rules",
      "Предоплата 100%. Заказ принимаем до начала слота. Код выдачи придёт на экран сразу после оплаты — назовите его на раздаче. Отмена — не позднее чем за 40 минут до слота, через стойку.",
    ],
    ["director", "Заведующая: Мария Павловна Семёнова"],
    ["hours", JSON.stringify(HOURS)],
    ["board_date", todayISO()],
  ];
  for (const [key, value] of settings) {
    await sql.query(
      `insert into site_settings (key, value) values ($1, $2)
       on conflict (key) do nothing`,
      [key, value],
    );
  }

  const [{ n: wishCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from wishes",
  );
  if (wishCount === 0) {
    const wishes: Array<[string, string, number, string]> = [
      ["Ира, ИС-22", "Сделайте пиццу по пятницам хотя бы два вида.", 14, "planned"],
      ["Максим", "Больше вегетарианских вторых, не только гарнир.", 11, "new"],
      ["Катя П.", "Гренки к борщу, как в прошлом году.", 9, "done"],
      ["Группа ЭК-21", "Молочный коктейль на май–июнь.", 7, "new"],
      ["Андрей", "Можно ли пельмени раз в неделю?", 6, "declined"],
      ["Лена", "Укажите аллергены на каждом блюде крупнее.", 5, "planned"],
    ];
    for (const [alias, body, votes, status] of wishes) {
      await sql.query(
        "insert into wishes (alias, body, votes, status) values ($1,$2,$3,$4)",
        [alias, body, votes, status],
      );
    }
  }

  const [{ n: anCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from announcements",
  );
  if (anCount === 0) {
    await sql.query(
      "insert into announcements (title, body) values ($1,$2),($3,$4),($5,$6)",
      [
        "Комплекс «Классика» — 250 ₽",
        "Борщ, котлета с пюре и компот. Дешевле, чем брать по отдельности.",
        "Предзаказ до 10:30",
        "Оплатите комплекс утром и заберите в выбранное окно — без очереди на линии.",
        "Пятница — рыбный день",
        "На линии рыба в кляре и морс. Комплекс с рыбой собирайте в конструкторе.",
      ],
    );
  }

  const [{ n: salesCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from sales_lines",
  );
  if (salesCount === 0) {
    const dishes = await sql.query<{
      id: number;
      name: string;
      price: number;
      cost: number;
    }>("select id, name, price, cost from dishes");
    const byName = Object.fromEntries(dishes.map((d) => [d.name, d]));
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const chunk: unknown[] = [];
    const tuples: string[] = [];
    const flush = async () => {
      if (!tuples.length) return;
      await sql.query(
        `insert into sales_lines (sale_date, dish_id, dish_name, qty, unit_price, unit_cost, source)
         values ${tuples.join(",")}`,
        chunk,
      );
      chunk.length = 0;
      tuples.length = 0;
    };
    for (let i = 45; i >= 1; i -= 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const wd = isoWeekday(d);
      if (wd === 7) continue;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const iso = `${y}-${m}-${day}`;
      const names = WEEKDAY_NAMES[wd] ?? WEEKDAY_NAMES[1];
      for (const name of names) {
        const dish = byName[name];
        if (!dish) continue;
        const qty = qtyFor(iso, name, wd);
        const base = chunk.length;
        tuples.push(
          `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},'import')`,
        );
        chunk.push(iso, dish.id, dish.name, qty, dish.price, dish.cost);
        if (tuples.length >= 40) await flush();
      }
    }
    await flush();
  }

  const [{ n: orderCount }] = await sql.query<{ n: number }>(
    "select count(*)::int as n from orders",
  );
  if (orderCount === 0) {
    const borscht = await sql.query<{ id: number; price: number }>(
      "select id, price from dishes where name = $1",
      ["Борщ украинский"],
    );
    const cutlet = await sql.query<{ id: number; price: number }>(
      "select id, price from dishes where name = $1",
      ["Котлета домашняя"],
    );
    const kompot = await sql.query<{ id: number; price: number }>(
      "select id, price from dishes where name = $1",
      ["Компот из сухофруктов"],
    );
    if (borscht[0] && cutlet[0] && kompot[0]) {
      const discount = 40;
      const total = borscht[0].price + cutlet[0].price + kompot[0].price - discount;
      const ins = await sql.query<{ id: number }>(
        `insert into orders (pickup_code, guest_label, group_code, status, total, discount, pickup_slot, note)
         values ($1,$2,$3,'cooking',$4,$5,'12:00–12:30','Без хлеба')
         returning id`,
        ["ПМ2401", "Алексей", "ИС-21", total, discount],
      );
      const oid = ins[0]?.id;
      if (oid) {
        await sql.query(
          `insert into order_items (order_id, dish_id, dish_name, qty, unit_price) values
           ($1,$2,'Борщ украинский',1,$3),
           ($1,$4,'Котлета домашняя',1,$5),
           ($1,$6,'Компот из сухофруктов',1,$7)`,
          [
            oid,
            borscht[0].id,
            borscht[0].price,
            cutlet[0].id,
            cutlet[0].price,
            kompot[0].id,
            kompot[0].price,
          ],
        );
      }
      const combo = await sql.query<{ id: number; price: number }>(
        "select id, price from dishes where name = $1",
        ["Комплекс «Классика»"],
      );
      if (combo[0]) {
        const o2 = await sql.query<{ id: number }>(
          `insert into orders (pickup_code, guest_label, group_code, status, total, discount, pickup_slot)
           values ($1,$2,$3,'ready',$4,0,'12:30–13:00') returning id`,
          ["НР3188", "Марина", "ЭК-22", combo[0].price],
        );
        if (o2[0]) {
          await sql.query(
            `insert into order_items (order_id, dish_id, dish_name, qty, unit_price)
             values ($1,$2,'Комплекс «Классика»',1,$3)`,
            [o2[0].id, combo[0].id, combo[0].price],
          );
        }
      }
    }
  }

  await sql.query(
    `delete from announcements a
     using announcements b
     where a.title = b.title and a.id > b.id`,
  );
}

export async function rolloverBoard(sql: Sql) {
  const today = todayISO();
  const rows = await sql.query<{ value: string }>(
    "select value from site_settings where key = 'board_date'",
  );
  if (rows[0]?.value === today) return;
  await sql.query("update dishes set portions_sold = 0");
  await sql.query(
    `insert into site_settings (key, value) values ('board_date', $1)
     on conflict (key) do update set value = excluded.value`,
    [today],
  );
}
