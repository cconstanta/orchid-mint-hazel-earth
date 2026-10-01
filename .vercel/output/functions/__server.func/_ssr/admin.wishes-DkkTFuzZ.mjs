import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as WISH_STATUS_LABEL } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { _ as useStaffPin, l as listWishesAdmin, m as setWishStatus } from "./pin-context-CSNDa9wO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-BilPiwiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.wishes-DkkTFuzZ.js
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"new",
	"planned",
	"done",
	"declined"
];
function AdminWishes() {
	const pin = useStaffPin();
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-wishes"],
		queryFn: () => listWishesAdmin({ data: { pin } }),
		enabled: Boolean(pin)
	});
	const set = useMutation({
		mutationFn: (p) => setWishStatus({ data: {
			pin,
			...p
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-wishes"] });
			qc.invalidateQueries({ queryKey: ["wishes"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium",
			children: "Пожелания гостей"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Статус сразу виден на публичной доске."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-3",
			children: (list.data ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: w.alias
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "muted",
								children: WISH_STATUS_LABEL[w.status]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground tabular-nums",
								children: [w.votes, " голос."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: w.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: w.status === s ? "default" : "outline",
							onClick: () => set.mutate({
								id: w.id,
								status: s
							}),
							children: WISH_STATUS_LABEL[s]
						}, s))
					})
				]
			}, w.id))
		})
	] });
}
//#endregion
export { AdminWishes as component };
