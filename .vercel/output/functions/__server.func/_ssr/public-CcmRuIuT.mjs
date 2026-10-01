import { t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, s as string } from "../_libs/zod.mjs";
import { n as createSsrRpc } from "./createSsrRpc-0WoJLQU-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public-CcmRuIuT.js
var getPublicMenu = createServerFn({ method: "GET" }).handler(createSsrRpc("7ded9dfa200bd804a9a3d9cdaef2df06c79f6cef0a32d60f1228cf7f1cb0e51e"));
var getPublicInfo = createServerFn({ method: "GET" }).handler(createSsrRpc("a17124bb3e902246c516b2794ee0767002cf4f43a44a9659deb7a7ad4d9de5c2"));
var getPublicWishes = createServerFn({ method: "GET" }).handler(createSsrRpc("0e5eacc129b28a72a6e2a9d132d5d7d8acac0e340dcb1a0a1e9c412ccd217613"));
var createWish = createServerFn({ method: "POST" }).validator(object({
	alias: string().trim().min(2).max(40),
	body: string().trim().min(8).max(400)
})).handler(createSsrRpc("fb71264d3782df0573c863c6ae39549bd8e32350591adac0c801e277df12189b"));
var voteWish = createServerFn({ method: "POST" }).validator(object({ id: number().int() })).handler(createSsrRpc("27894cb0d0cb8a57b9681a01b63ef3a57bb3ad4e30fd3c816142c9200226178d"));
var getOrderByCode = createServerFn({ method: "POST" }).validator(object({ code: string().trim().min(4).max(12) })).handler(createSsrRpc("937738e1833fac6ab8bef1f1f7bb7431ea0c92a16e4603e509bb0dbc69c681d3"));
var placeOrder = createServerFn({ method: "POST" }).validator(object({
	guest_label: string().trim().min(2).max(40),
	group_code: string().trim().min(2).max(16),
	pickup_slot: string().min(3).max(24),
	note: string().trim().max(160).optional(),
	items: array(object({
		dishId: number().int(),
		qty: number().int().min(1).max(20)
	})).min(1).max(30)
})).handler(createSsrRpc("434707aac93f6d52841964d14a7890279f21e009c8b2aee1a3a78c98bae9d468"));
//#endregion
export { getPublicWishes as a, getPublicMenu as i, getOrderByCode as n, placeOrder as o, getPublicInfo as r, voteWish as s, createWish as t };
