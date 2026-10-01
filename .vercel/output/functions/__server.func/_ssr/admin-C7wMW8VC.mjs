import { t as createServerFn } from "./ssr.mjs";
import { i as isoWeekday, o as todayISO } from "./utils-aBt_XD6u.mjs";
import { i as rolloverBoard, n as ensureSeeded, r as getSql, t as createServerRpc } from "./seed-CFmP2pYQ.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C7wMW8VC.js
var STAFF_PIN = "2468";
function assertStaff(pin) {
	if (pin !== STAFF_PIN) throw new Error("Неверный код сотрудника");
}
async function ready() {
	const sql = await getSql();
	await ensureSeeded(sql);
	await rolloverBoard(sql);
	return sql;
}
function splitTags(tags) {
	return tags.split(",").map((t) => t.trim()).filter(Boolean);
}
var pinSchema = object({ pin: string().min(1) });
var verifyStaff_createServerFn_handler = createServerRpc({
	id: "2291a82b587a34a7f4c842b9ffbb9ba78ac34e8d54b52e50d06d9160b4416f89",
	name: "verifyStaff",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => verifyStaff.__executeServer(opts));
var verifyStaff = createServerFn({ method: "POST" }).validator(pinSchema).handler(verifyStaff_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	return { ok: true };
});
var getAdminCatalog_createServerFn_handler = createServerRpc({
	id: "6063193e51a6acbb6ff99e2ffbf2b474b31d5584b4f085fe4b6b53a74bc25bde",
	name: "getAdminCatalog",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => getAdminCatalog.__executeServer(opts));
var getAdminCatalog = createServerFn({ method: "POST" }).validator(pinSchema).handler(getAdminCatalog_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	const categories = await sql.query("select id, slug, name, sort_order from categories order by sort_order");
	const dishes = (await sql.query(`select d.id, d.category_id, c.slug as category_slug, c.name as category_name,
              d.name, d.description, d.price, d.cost, d.weight_g, d.calories,
              d.protein, d.fat, d.carbs, d.tags, d.image_key, d.featured,
              d.is_available, d.on_board, d.portion_limit, d.portions_sold, d.sort_order
       from dishes d join categories c on c.id = d.category_id
       order by c.sort_order, d.sort_order, d.name`)).map((r) => ({
		...r,
		tags: splitTags(r.tags),
		portions_left: r.portion_limit == null ? null : Math.max(0, r.portion_limit - r.portions_sold)
	}));
	const plan = await sql.query("select weekday, dish_id from weekday_plan");
	const planMap = {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: []
	};
	for (const row of plan) (planMap[row.weekday] ??= []).push(row.dish_id);
	return {
		categories,
		dishes,
		plan: planMap,
		weekday: isoWeekday()
	};
});
var upsertDish_createServerFn_handler = createServerRpc({
	id: "26c40ffcfdcdcae37fe55c4fc6bd5e7f897473e9e87a985ea5224b3c51b3f6e8",
	name: "upsertDish",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => upsertDish.__executeServer(opts));
var upsertDish = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int().optional(),
	category_id: number().int(),
	name: string().trim().min(2).max(80),
	description: string().trim().max(280),
	price: number().int().min(1).max(5e3),
	cost: number().int().min(0).max(5e3),
	weight_g: number().int().min(0).max(3e3),
	calories: number().int().min(0).max(3e3),
	protein: number().int().min(0).max(300),
	fat: number().int().min(0).max(300),
	carbs: number().int().min(0).max(400),
	tags: string().max(80),
	image_key: string().max(40),
	portion_limit: number().int().min(1).max(999).nullable()
})).handler(upsertDish_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	if (data.id) {
		await sql.query(`update dishes set
           category_id=$1, name=$2, description=$3, price=$4, cost=$5,
           weight_g=$6, calories=$7, protein=$8, fat=$9, carbs=$10,
           tags=$11, image_key=$12, portion_limit=$13
         where id=$14`, [
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
			data.id
		]);
		return { id: data.id };
	}
	return { id: (await sql.query(`insert into dishes (
         category_id, name, description, price, cost, weight_g, calories,
         protein, fat, carbs, tags, image_key, portion_limit, is_available, on_board
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,true,false)
       returning id`, [
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
		data.portion_limit
	]))[0].id };
});
var setDishFlags_createServerFn_handler = createServerRpc({
	id: "a0b1fe6aa5bc75c381c9d468b4883ec7f209ff4e634cb3f72b9f1c31b23546fa",
	name: "setDishFlags",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => setDishFlags.__executeServer(opts));
var setDishFlags = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	on_board: boolean().optional(),
	is_available: boolean().optional(),
	featured: boolean().optional()
})).handler(setDishFlags_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	if (data.on_board !== void 0) await sql.query("update dishes set on_board = $1 where id = $2", [data.on_board, data.id]);
	if (data.is_available !== void 0) await sql.query("update dishes set is_available = $1 where id = $2", [data.is_available, data.id]);
	if (data.featured !== void 0) await sql.query("update dishes set featured = $1 where id = $2", [data.featured, data.id]);
	return { ok: true };
});
var applyWeekdayPlan_createServerFn_handler = createServerRpc({
	id: "c82650f7aac24b3094b8b0b2b8651554f3d482d3ba037c8e754652358a224c80",
	name: "applyWeekdayPlan",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => applyWeekdayPlan.__executeServer(opts));
var applyWeekdayPlan = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	weekday: number().int().min(1).max(6)
})).handler(applyWeekdayPlan_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	await sql.query("update dishes set on_board = false, portions_sold = 0");
	await sql.query(`update dishes set on_board = true
       where id in (select dish_id from weekday_plan where weekday = $1)`, [data.weekday]);
	await sql.query(`insert into site_settings (key, value) values ('board_date', $1)
       on conflict (key) do update set value = excluded.value`, [todayISO()]);
	return { ok: true };
});
var saveWeekdayPlan_createServerFn_handler = createServerRpc({
	id: "c7c342c04c3d4d63333a18be2c5435b670accd18ccdb76ec6a11269b1993e888",
	name: "saveWeekdayPlan",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => saveWeekdayPlan.__executeServer(opts));
var saveWeekdayPlan = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	weekday: number().int().min(1).max(6),
	dish_ids: array(number().int()).max(40)
})).handler(saveWeekdayPlan_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	await sql.query("delete from weekday_plan where weekday = $1", [data.weekday]);
	for (const id of data.dish_ids) await sql.query("insert into weekday_plan (weekday, dish_id) values ($1,$2) on conflict do nothing", [data.weekday, id]);
	return { ok: true };
});
var importSales_createServerFn_handler = createServerRpc({
	id: "0d913411e6575ec10b2b420a9783aeab5c61f5c1ed902f5ccab4a63d5bd1d516",
	name: "importSales",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => importSales.__executeServer(opts));
var importSales = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	rows: array(object({
		date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
		dish: string().trim().min(1).max(80),
		qty: number().int().min(1).max(5e3),
		price: number().int().min(1).max(5e3).optional()
	})).min(1).max(400)
})).handler(importSales_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	const dishes = await sql.query("select id, name, price, cost from dishes");
	const byName = new Map(dishes.map((d) => [d.name.toLowerCase(), d]));
	let imported = 0;
	for (const row of data.rows) {
		const dish = byName.get(row.dish.toLowerCase());
		const price = row.price ?? dish?.price ?? 0;
		if (!price) continue;
		const cost = dish?.cost ?? Math.round(price * .45);
		await sql.query(`delete from sales_lines
         where sale_date = $1 and lower(dish_name) = lower($2) and source = 'import'`, [row.date, row.dish]);
		await sql.query(`insert into sales_lines (sale_date, dish_id, dish_name, qty, unit_price, unit_cost, source)
         values ($1,$2,$3,$4,$5,$6,'import')`, [
			row.date,
			dish?.id ?? null,
			dish?.name ?? row.dish,
			row.qty,
			price,
			cost
		]);
		imported += 1;
	}
	return { imported };
});
var getReports_createServerFn_handler = createServerRpc({
	id: "587d84798b9859e5b69f45f357f90198307a30e4ba6a78fbe3906780a32e2018",
	name: "getReports",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => getReports.__executeServer(opts));
var getReports = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	to: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(getReports_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	const days = (await sql.query(`select sale_date::text as sale_date,
              coalesce(sum(qty * unit_price),0)::int as revenue,
              coalesce(sum(qty * unit_cost),0)::int as cost,
              coalesce(sum(qty),0)::int as portions
       from sales_lines
       where sale_date >= $1 and sale_date <= $2
       group by sale_date
       order by sale_date`, [data.from, data.to])).map((d) => ({
		...d,
		profit: d.revenue - d.cost
	}));
	const dishes = (await sql.query(`select dish_name,
              coalesce(sum(qty),0)::int as qty,
              coalesce(sum(qty * unit_price),0)::int as revenue,
              coalesce(sum(qty * unit_cost),0)::int as cost
       from sales_lines
       where sale_date >= $1 and sale_date <= $2
       group by dish_name
       order by revenue desc`, [data.from, data.to])).map((d) => ({
		...d,
		profit: d.revenue - d.cost
	}));
	const categories = (await sql.query(`select coalesce(c.name, 'Прочее') as category,
              coalesce(sum(s.qty * s.unit_price),0)::int as revenue
       from sales_lines s
       left join dishes d on d.id = s.dish_id
       left join categories c on c.id = d.category_id
       where s.sale_date >= $1 and s.sale_date <= $2
       group by coalesce(c.name, 'Прочее')
       order by revenue desc`, [data.from, data.to])).map((c) => ({
		category: c.category ?? "Прочее",
		revenue: c.revenue
	}));
	const [{ n: orders_online }] = await sql.query(`select coalesce(sum(qty),0)::int as n from sales_lines
       where sale_date >= $1 and sale_date <= $2 and source = 'order'`, [data.from, data.to]);
	const revenue = days.reduce((s, d) => s + d.revenue, 0);
	const cost = days.reduce((s, d) => s + d.cost, 0);
	return {
		from: data.from,
		to: data.to,
		revenue,
		cost,
		profit: revenue - cost,
		portions: days.reduce((s, d) => s + d.portions, 0),
		orders_online,
		days,
		dishes,
		categories
	};
});
var listOrders_createServerFn_handler = createServerRpc({
	id: "add3e59d0d630030a0a651376d0424423b042bd456cdf87cb2a45dae5286e937",
	name: "listOrders",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "POST" }).validator(pinSchema).handler(listOrders_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	const orders = await sql.query(`select id, pickup_code, guest_label, group_code, status, total, discount,
              pickup_slot, note, created_at::text as created_at
       from orders order by id desc limit 80`);
	const items = await sql.query("select id, order_id, dish_id, dish_name, qty, unit_price from order_items");
	const byOrder = /* @__PURE__ */ new Map();
	for (const it of items) {
		const list = byOrder.get(it.order_id) ?? [];
		list.push({
			id: it.id,
			dish_id: it.dish_id,
			dish_name: it.dish_name,
			qty: it.qty,
			unit_price: it.unit_price
		});
		byOrder.set(it.order_id, list);
	}
	return orders.map((o) => ({
		...o,
		items: byOrder.get(o.id) ?? []
	}));
});
var updateOrderStatus_createServerFn_handler = createServerRpc({
	id: "5bfc21a81c53fe20f51840567a3f4cc29a63297c8b790dc5e8fb99537c1530e1",
	name: "updateOrderStatus",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
var updateOrderStatus = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	status: _enum([
		"paid",
		"cooking",
		"ready",
		"picked_up",
		"cancelled"
	])
})).handler(updateOrderStatus_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	if (!(await sql.query("select status from orders where id = $1", [data.id]))[0]) throw new Error("Заказ не найден");
	await sql.query("update orders set status = $1, updated_at = now() where id = $2", [data.status, data.id]);
	return { ok: true };
});
var listWishesAdmin_createServerFn_handler = createServerRpc({
	id: "a138b36b84c6e276c97212be9fa85ddc75b73e617b353153133ac427873cdb37",
	name: "listWishesAdmin",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => listWishesAdmin.__executeServer(opts));
var listWishesAdmin = createServerFn({ method: "POST" }).validator(pinSchema).handler(listWishesAdmin_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	return (await ready()).query(`select id, alias, body, votes, status, created_at::text as created_at
       from wishes order by votes desc, id desc`);
});
var setWishStatus_createServerFn_handler = createServerRpc({
	id: "dab0367f768528ec952dcf82474888e0bd048d5b34162bcf4d8e89ef388f6444",
	name: "setWishStatus",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => setWishStatus.__executeServer(opts));
var setWishStatus = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	status: _enum([
		"new",
		"planned",
		"done",
		"declined"
	])
})).handler(setWishStatus_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	await (await ready()).query("update wishes set status = $1 where id = $2", [data.status, data.id]);
	return { ok: true };
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "d1023c6e4ab0bed4d15a06f330d860515a1f2a91d3520d26bb7d43110d0a4f0a",
	name: "saveSettings",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	college_name: string().trim().min(3).max(120),
	address: string().trim().min(8).max(200),
	phone: string().trim().min(6).max(40),
	about: string().trim().min(8).max(1200),
	pickup_rules: string().trim().min(8).max(800),
	director: string().trim().max(120),
	hours_text: string().trim().min(8).max(400)
})).handler(saveSettings_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	const sql = await ready();
	const pairs = [
		["college_name", data.college_name],
		["address", data.address],
		["phone", data.phone],
		["about", data.about],
		["pickup_rules", data.pickup_rules],
		["director", data.director]
	];
	for (const [key, value] of pairs) await sql.query(`insert into site_settings (key, value) values ($1,$2)
         on conflict (key) do update set value = excluded.value`, [key, value]);
	const hoursRows = data.hours_text.split("\n").map((l) => l.trim()).filter(Boolean).map((line) => {
		const [days, rest] = line.split(":").map((s) => s.trim());
		return {
			days: days || line,
			line: rest || "",
			kitchen: ""
		};
	});
	if (hoursRows.length) await sql.query(`insert into site_settings (key, value) values ('hours', $1)
         on conflict (key) do update set value = excluded.value`, [JSON.stringify(hoursRows)]);
	return { ok: true };
});
var addAnnouncement_createServerFn_handler = createServerRpc({
	id: "b99a9f0212cde523a3a263ef15d60ac98043cdc35657e6a8b8734b40423b5480",
	name: "addAnnouncement",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => addAnnouncement.__executeServer(opts));
var addAnnouncement = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	title: string().trim().min(3).max(80),
	body: string().trim().min(8).max(400)
})).handler(addAnnouncement_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	return (await (await ready()).query(`insert into announcements (title, body) values ($1,$2)
       returning id, title, body, is_published, created_at::text as created_at`, [data.title, data.body]))[0];
});
var setAnnouncementPublished_createServerFn_handler = createServerRpc({
	id: "d895627b7cc35835c31ddf1f2b3c1a3d92389e9d3d143e0831eb90b55cc8318b",
	name: "setAnnouncementPublished",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => setAnnouncementPublished.__executeServer(opts));
var setAnnouncementPublished = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	is_published: boolean()
})).handler(setAnnouncementPublished_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	await (await ready()).query("update announcements set is_published = $1 where id = $2", [data.is_published, data.id]);
	return { ok: true };
});
var listAnnouncementsAdmin_createServerFn_handler = createServerRpc({
	id: "6a0a4514d1026396ce52634048bb2ac93e17d9bb6ef89038bc51883f2a7d551e",
	name: "listAnnouncementsAdmin",
	filename: "src/lib/canteen/admin.ts"
}, (opts) => listAnnouncementsAdmin.__executeServer(opts));
var listAnnouncementsAdmin = createServerFn({ method: "POST" }).validator(pinSchema).handler(listAnnouncementsAdmin_createServerFn_handler, async ({ data }) => {
	assertStaff(data.pin);
	return (await ready()).query(`select id, title, body, is_published, created_at::text as created_at
       from announcements order by id desc`);
});
//#endregion
export { addAnnouncement_createServerFn_handler, applyWeekdayPlan_createServerFn_handler, getAdminCatalog_createServerFn_handler, getReports_createServerFn_handler, importSales_createServerFn_handler, listAnnouncementsAdmin_createServerFn_handler, listOrders_createServerFn_handler, listWishesAdmin_createServerFn_handler, saveSettings_createServerFn_handler, saveWeekdayPlan_createServerFn_handler, setAnnouncementPublished_createServerFn_handler, setDishFlags_createServerFn_handler, setWishStatus_createServerFn_handler, updateOrderStatus_createServerFn_handler, upsertDish_createServerFn_handler, verifyStaff_createServerFn_handler };
