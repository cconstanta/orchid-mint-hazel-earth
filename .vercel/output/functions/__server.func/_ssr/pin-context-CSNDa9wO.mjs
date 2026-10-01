import { o as __toESM } from "../_runtime.mjs";
import { h as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { n as createSsrRpc } from "./createSsrRpc-0WoJLQU-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pin-context-CSNDa9wO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var pinSchema = object({ pin: string().min(1) });
var verifyStaff = createServerFn({ method: "POST" }).validator(pinSchema).handler(createSsrRpc("2291a82b587a34a7f4c842b9ffbb9ba78ac34e8d54b52e50d06d9160b4416f89"));
var getAdminCatalog = createServerFn({ method: "POST" }).validator(pinSchema).handler(createSsrRpc("6063193e51a6acbb6ff99e2ffbf2b474b31d5584b4f085fe4b6b53a74bc25bde"));
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
})).handler(createSsrRpc("26c40ffcfdcdcae37fe55c4fc6bd5e7f897473e9e87a985ea5224b3c51b3f6e8"));
var setDishFlags = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	on_board: boolean().optional(),
	is_available: boolean().optional(),
	featured: boolean().optional()
})).handler(createSsrRpc("a0b1fe6aa5bc75c381c9d468b4883ec7f209ff4e634cb3f72b9f1c31b23546fa"));
var applyWeekdayPlan = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	weekday: number().int().min(1).max(6)
})).handler(createSsrRpc("c82650f7aac24b3094b8b0b2b8651554f3d482d3ba037c8e754652358a224c80"));
var saveWeekdayPlan = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	weekday: number().int().min(1).max(6),
	dish_ids: array(number().int()).max(40)
})).handler(createSsrRpc("c7c342c04c3d4d63333a18be2c5435b670accd18ccdb76ec6a11269b1993e888"));
var importSales = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	rows: array(object({
		date: string().regex(/^\d{4}-\d{2}-\d{2}$/),
		dish: string().trim().min(1).max(80),
		qty: number().int().min(1).max(5e3),
		price: number().int().min(1).max(5e3).optional()
	})).min(1).max(400)
})).handler(createSsrRpc("0d913411e6575ec10b2b420a9783aeab5c61f5c1ed902f5ccab4a63d5bd1d516"));
var getReports = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
	to: string().regex(/^\d{4}-\d{2}-\d{2}$/)
})).handler(createSsrRpc("587d84798b9859e5b69f45f357f90198307a30e4ba6a78fbe3906780a32e2018"));
var listOrders = createServerFn({ method: "POST" }).validator(pinSchema).handler(createSsrRpc("add3e59d0d630030a0a651376d0424423b042bd456cdf87cb2a45dae5286e937"));
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
})).handler(createSsrRpc("5bfc21a81c53fe20f51840567a3f4cc29a63297c8b790dc5e8fb99537c1530e1"));
var listWishesAdmin = createServerFn({ method: "POST" }).validator(pinSchema).handler(createSsrRpc("a138b36b84c6e276c97212be9fa85ddc75b73e617b353153133ac427873cdb37"));
var setWishStatus = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	status: _enum([
		"new",
		"planned",
		"done",
		"declined"
	])
})).handler(createSsrRpc("dab0367f768528ec952dcf82474888e0bd048d5b34162bcf4d8e89ef388f6444"));
var saveSettings = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	college_name: string().trim().min(3).max(120),
	address: string().trim().min(8).max(200),
	phone: string().trim().min(6).max(40),
	about: string().trim().min(8).max(1200),
	pickup_rules: string().trim().min(8).max(800),
	director: string().trim().max(120),
	hours_text: string().trim().min(8).max(400)
})).handler(createSsrRpc("d1023c6e4ab0bed4d15a06f330d860515a1f2a91d3520d26bb7d43110d0a4f0a"));
var addAnnouncement = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	title: string().trim().min(3).max(80),
	body: string().trim().min(8).max(400)
})).handler(createSsrRpc("b99a9f0212cde523a3a263ef15d60ac98043cdc35657e6a8b8734b40423b5480"));
var setAnnouncementPublished = createServerFn({ method: "POST" }).validator(object({
	pin: string().min(1),
	id: number().int(),
	is_published: boolean()
})).handler(createSsrRpc("d895627b7cc35835c31ddf1f2b3c1a3d92389e9d3d143e0831eb90b55cc8318b"));
var listAnnouncementsAdmin = createServerFn({ method: "POST" }).validator(pinSchema).handler(createSsrRpc("6a0a4514d1026396ce52634048bb2ac93e17d9bb6ef89038bc51883f2a7d551e"));
var PinCtx = (0, import_react.createContext)("");
function useStaffPin() {
	return (0, import_react.useContext)(PinCtx);
}
//#endregion
export { useStaffPin as _, getReports as a, listOrders as c, saveWeekdayPlan as d, setAnnouncementPublished as f, upsertDish as g, updateOrderStatus as h, getAdminCatalog as i, listWishesAdmin as l, setWishStatus as m, addAnnouncement as n, importSales as o, setDishFlags as p, applyWeekdayPlan as r, listAnnouncementsAdmin as s, PinCtx as t, saveSettings as u, verifyStaff as v };
