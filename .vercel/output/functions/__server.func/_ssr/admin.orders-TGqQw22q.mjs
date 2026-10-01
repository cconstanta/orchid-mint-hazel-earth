import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as rub } from "./utils-aBt_XD6u.mjs";
import { t as ORDER_STATUS_LABEL } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { _ as useStaffPin, c as listOrders, h as updateOrderStatus } from "./pin-context-CSNDa9wO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-BilPiwiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-TGqQw22q.js
var import_jsx_runtime = require_jsx_runtime();
var NEXT = {
	paid: "cooking",
	cooking: "ready",
	ready: "picked_up"
};
function AdminOrders() {
	const pin = useStaffPin();
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => listOrders({ data: { pin } }),
		enabled: Boolean(pin),
		refetchInterval: 6e3
	});
	const setStatus = useMutation({
		mutationFn: (p) => updateOrderStatus({ data: {
			pin,
			...p
		} }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-orders"] }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium",
			children: "Предзаказы"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Кухня двигает статус. Гость видит тот же код на странице выдачи."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-3",
			children: (list.data ?? []).map((o) => {
				const next = NEXT[o.status];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl tracking-wide",
								children: o.pickup_code
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									o.guest_label,
									", ",
									o.group_code,
									" · ",
									o.pickup_slot
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: ORDER_STATUS_LABEL[o.status] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 text-sm text-muted-foreground",
							children: o.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								it.dish_name,
								" × ",
								it.qty
							] }, it.id))
						}),
						o.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm",
							children: ["Заметка: ", o.note]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium tabular-nums",
								children: rub(o.total)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [next ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => setStatus.mutate({
										id: o.id,
										status: next
									}),
									children: ORDER_STATUS_LABEL[next]
								}) : null, o.status !== "cancelled" && o.status !== "picked_up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setStatus.mutate({
										id: o.id,
										status: "cancelled"
									}),
									children: "Отменить"
								}) : null]
							})]
						})
					]
				}, o.id);
			})
		})
	] });
}
//#endregion
export { AdminOrders as component };
