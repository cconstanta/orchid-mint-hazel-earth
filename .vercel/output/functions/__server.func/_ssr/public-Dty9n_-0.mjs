import { t as createServerFn } from "./ssr.mjs";
import { i as isoWeekday, o as todayISO } from "./utils-aBt_XD6u.mjs";
import { i as rolloverBoard, n as ensureSeeded, r as getSql, t as createServerRpc } from "./seed-CFmP2pYQ.mjs";
import { a as number, n as array, o as object, s as string } from "../_libs/zod.mjs";
import { n as PICKUP_SLOTS } from "./types-9cYW1rdd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-Dty9n_-0.js
async function ready() {
	const sql = await getSql();
	await ensureSeeded(sql);
	await rolloverBoard(sql);
	return sql;
}
function splitTags(tags) {
	return tags.split(",").map((t) => t.trim()).filter(Boolean);
}
var getPublicMenu_createServerFn_handler = createServerRpc({
	id: "7ded9dfa200bd804a9a3d9cdaef2df06c79f6cef0a32d60f1228cf7f1cb0e51e",
	name: "getPublicMenu",
	filename: "src/lib/canteen/public.ts"
}, (opts) => getPublicMenu.__executeServer(opts));
var getPublicMenu = createServerFn({ method: "GET" }).handler(getPublicMenu_createServerFn_handler, async () => {
	const sql = await ready();
	const categories = await sql.query("select id, slug, name, sort_order from categories order by sort_order");
	const dishes = (await sql.query(`select d.id, d.category_id, c.slug as category_slug, c.name as category_name,
            d.name, d.description, d.price, d.weight_g, d.calories, d.protein, d.fat, d.carbs,
            d.tags, d.image_key, d.featured, d.portion_limit, d.portions_sold, d.sort_order
     from dishes d
     join categories c on c.id = d.category_id
     where d.on_board = true and d.is_available = true
     order by c.sort_order, d.sort_order, d.name`)).map((r) => ({
		...r,
		tags: splitTags(r.tags),
		portions_left: r.portion_limit == null ? null : Math.max(0, r.portion_limit - r.portions_sold)
	}));
	const wd = isoWeekday();
	return {
		date: todayISO(),
		weekday: wd,
		closed: wd === 7,
		categories,
		dishes
	};
});
var getPublicInfo_createServerFn_handler = createServerRpc({
	id: "a17124bb3e902246c516b2794ee0767002cf4f43a44a9659deb7a7ad4d9de5c2",
	name: "getPublicInfo",
	filename: "src/lib/canteen/public.ts"
}, (opts) => getPublicInfo.__executeServer(opts));
var getPublicInfo = createServerFn({ method: "GET" }).handler(getPublicInfo_createServerFn_handler, async () => {
	const sql = await ready();
	const rows = await sql.query("select key, value from site_settings");
	const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
	let hours = [];
	try {
		hours = JSON.parse(map.hours ?? "[]");
	} catch {
		hours = [];
	}
	return {
		info: {
			college_name: map.college_name ?? "",
			canteen_name: map.canteen_name ?? "Столовая «Перемена»",
			address: map.address ?? "",
			phone: map.phone ?? "",
			about: map.about ?? "",
			pickup_rules: map.pickup_rules ?? "",
			director: map.director ?? "",
			hours
		},
		announcements: await sql.query(`select id, title, body, is_published, created_at::text as created_at
     from announcements where is_published = true order by id desc limit 8`),
		slots: PICKUP_SLOTS
	};
});
var getPublicWishes_createServerFn_handler = createServerRpc({
	id: "0e5eacc129b28a72a6e2a9d132d5d7d8acac0e340dcb1a0a1e9c412ccd217613",
	name: "getPublicWishes",
	filename: "src/lib/canteen/public.ts"
}, (opts) => getPublicWishes.__executeServer(opts));
var getPublicWishes = createServerFn({ method: "GET" }).handler(getPublicWishes_createServerFn_handler, async () => {
	return (await ready()).query(`select id, alias, body, votes, status, created_at::text as created_at
     from wishes order by votes desc, id desc`);
});
var createWish_createServerFn_handler = createServerRpc({
	id: "fb71264d3782df0573c863c6ae39549bd8e32350591adac0c801e277df12189b",
	name: "createWish",
	filename: "src/lib/canteen/public.ts"
}, (opts) => createWish.__executeServer(opts));
var createWish = createServerFn({ method: "POST" }).validator(object({
	alias: string().trim().min(2).max(40),
	body: string().trim().min(8).max(400)
})).handler(createWish_createServerFn_handler, async ({ data }) => {
	return (await (await ready()).query(`insert into wishes (alias, body) values ($1, $2)
       returning id, alias, body, votes, status, created_at::text as created_at`, [data.alias, data.body]))[0];
});
var voteWish_createServerFn_handler = createServerRpc({
	id: "27894cb0d0cb8a57b9681a01b63ef3a57bb3ad4e30fd3c816142c9200226178d",
	name: "voteWish",
	filename: "src/lib/canteen/public.ts"
}, (opts) => voteWish.__executeServer(opts));
var voteWish = createServerFn({ method: "POST" }).validator(object({ id: number().int() })).handler(voteWish_createServerFn_handler, async ({ data }) => {
	await (await ready()).query("update wishes set votes = votes + 1 where id = $1", [data.id]);
	return { ok: true };
});
var getOrderByCode_createServerFn_handler = createServerRpc({
	id: "937738e1833fac6ab8bef1f1f7bb7431ea0c92a16e4603e509bb0dbc69c681d3",
	name: "getOrderByCode",
	filename: "src/lib/canteen/public.ts"
}, (opts) => getOrderByCode.__executeServer(opts));
var getOrderByCode = createServerFn({ method: "POST" }).validator(object({ code: string().trim().min(4).max(12) })).handler(getOrderByCode_createServerFn_handler, async ({ data }) => {
	const sql = await ready();
	const code = data.code.toUpperCase();
	const order = (await sql.query(`select id, pickup_code, guest_label, group_code, status, total, discount,
              pickup_slot, note, created_at::text as created_at
       from orders where pickup_code = $1`, [code]))[0];
	if (!order) return null;
	const items = await sql.query("select id, dish_id, dish_name, qty, unit_price from order_items where order_id = $1", [order.id]);
	return {
		...order,
		items
	};
});
function comboDiscountFor(lines) {
	if (lines.some((l) => l.category_slug === "combos")) return 0;
	const soup = lines.filter((l) => l.category_slug === "soups").reduce((s, l) => s + l.qty, 0);
	const main = lines.filter((l) => l.category_slug === "mains").reduce((s, l) => s + l.qty, 0);
	const drink = lines.filter((l) => l.category_slug === "drinks").reduce((s, l) => s + l.qty, 0);
	return Math.min(soup, main, drink) * 40;
}
function makeCode() {
	const letters = "АВЕКМНОРСТУХ";
	return `${letters[Math.floor(Math.random() * 12)]}${letters[Math.floor(Math.random() * 12)]}${String(1e3 + Math.floor(Math.random() * 9e3))}`;
}
var placeOrder_createServerFn_handler = createServerRpc({
	id: "434707aac93f6d52841964d14a7890279f21e009c8b2aee1a3a78c98bae9d468",
	name: "placeOrder",
	filename: "src/lib/canteen/public.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator(object({
	guest_label: string().trim().min(2).max(40),
	group_code: string().trim().min(2).max(16),
	pickup_slot: string().min(3).max(24),
	note: string().trim().max(160).optional(),
	items: array(object({
		dishId: number().int(),
		qty: number().int().min(1).max(20)
	})).min(1).max(30)
})).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	if (!PICKUP_SLOTS.includes(data.pickup_slot)) throw new Error("Выберите окно выдачи из списка");
	const sql = await ready();
	const ids = data.items.map((i) => i.dishId);
	const dishes = await sql.query(`select d.id, d.name, d.price, d.cost, c.slug as category_slug,
              d.on_board, d.is_available, d.portion_limit, d.portions_sold
       from dishes d join categories c on c.id = d.category_id
       where d.id in (${ids.map((_, i) => `$${i + 1}`).join(",")})`, ids);
	const byId = Object.fromEntries(dishes.map((d) => [d.id, d]));
	const lines = [];
	for (const item of data.items) {
		const dish = byId[item.dishId];
		if (!dish || !dish.on_board || !dish.is_available) throw new Error("Блюдо уже сняли с линии. Обновите меню.");
		if (dish.portion_limit != null) {
			const left = dish.portion_limit - dish.portions_sold;
			if (item.qty > left) throw new Error(`«${dish.name}» осталось ${Math.max(0, left)} порц.`);
		}
		lines.push({
			dish,
			qty: item.qty
		});
	}
	const subtotal = lines.reduce((s, l) => s + l.dish.price * l.qty, 0);
	const discount = comboDiscountFor(lines.map((l) => ({
		category_slug: l.dish.category_slug,
		qty: l.qty,
		name: l.dish.name
	})));
	const total = Math.max(0, subtotal - discount);
	let code = makeCode();
	for (let attempt = 0; attempt < 8; attempt += 1) {
		if (((await sql.query("select count(*)::int as n from orders where pickup_code = $1", [code]))[0]?.n ?? 1) === 0) break;
		code = makeCode();
	}
	const orderId = (await sql.query(`insert into orders (pickup_code, guest_label, group_code, status, total, discount, pickup_slot, note)
       values ($1,$2,$3,'paid',$4,$5,$6,$7) returning id`, [
		code,
		data.guest_label,
		data.group_code,
		total,
		discount,
		data.pickup_slot,
		data.note ?? ""
	]))[0]?.id;
	if (!orderId) throw new Error("Не удалось создать заказ");
	const today = todayISO();
	for (const line of lines) {
		await sql.query(`insert into order_items (order_id, dish_id, dish_name, qty, unit_price)
         values ($1,$2,$3,$4,$5)`, [
			orderId,
			line.dish.id,
			line.dish.name,
			line.qty,
			line.dish.price
		]);
		await sql.query("update dishes set portions_sold = portions_sold + $1 where id = $2", [line.qty, line.dish.id]);
		await sql.query(`insert into sales_lines (sale_date, dish_id, dish_name, qty, unit_price, unit_cost, source)
         values ($1,$2,$3,$4,$5,$6,'order')`, [
			today,
			line.dish.id,
			line.dish.name,
			line.qty,
			line.dish.price,
			line.dish.cost
		]);
	}
	return {
		pickup_code: code,
		total,
		discount,
		pickup_slot: data.pickup_slot
	};
});
//#endregion
export { createWish_createServerFn_handler, getOrderByCode_createServerFn_handler, getPublicInfo_createServerFn_handler, getPublicMenu_createServerFn_handler, getPublicWishes_createServerFn_handler, placeOrder_createServerFn_handler, voteWish_createServerFn_handler };
