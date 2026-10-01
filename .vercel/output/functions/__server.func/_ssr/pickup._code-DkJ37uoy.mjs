import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rub } from "./utils-aBt_XD6u.mjs";
import { t as ORDER_STATUS_LABEL } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { n as getOrderByCode } from "./public-CcmRuIuT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-BilPiwiN.mjs";
import { t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
import { n as Route } from "./router-lF8PY6MV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pickup._code-DkJ37uoy.js
var import_jsx_runtime = require_jsx_runtime();
function PickupPage() {
	const { code } = Route.useParams();
	const q = useQuery({
		queryKey: ["order", code],
		queryFn: () => getOrderByCode({ data: { code } }),
		refetchInterval: 8e3
	});
	const order = q.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Код выдачи"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-medium tracking-wide",
				children: code.toUpperCase()
			}),
			q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted-foreground",
				children: "Ищем заказ…"
			}) : !order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Заказ с таким кодом не найден." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/order",
						children: "К оформлению"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: ORDER_STATUS_LABEL[order.status] ?? order.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: order.pickup_slot
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-medium",
						children: [
							order.guest_label,
							", ",
							order.group_code
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: order.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								it.dish_name,
								" × ",
								it.qty
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rub(it.unit_price * it.qty) })]
						}, it.id))
					}),
					order.discount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 flex justify-between text-sm tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Комплекс"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["− ", rub(order.discount)] })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex justify-between border-t border-border pt-3 font-medium tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Оплачено" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rub(order.total) })]
					}),
					order.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: ["Заметка: ", order.note]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted-foreground",
						children: "Назовите код на раздаче. Страница обновляется сама — когда статус «Можно забирать», подойдите к окну."
					})
				]
			})
		]
	}) });
}
//#endregion
export { PickupPage as component };
