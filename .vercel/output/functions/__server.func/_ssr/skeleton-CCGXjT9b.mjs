import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as rub, t as cn } from "./utils-aBt_XD6u.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { l as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-BilPiwiN.mjs";
import { o as useCart } from "./site-shell-NBV_EkLt.mjs";
import { t as DishPhoto } from "./dish-photo-zvl2UGa4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-CCGXjT9b.js
var import_jsx_runtime = require_jsx_runtime();
var TAG_LABEL = { veg: "без мяса" };
function DishCard({ dish }) {
	const add = useCart((s) => s.add);
	const soldOut = dish.portions_left === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[4/3] overflow-hidden bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishPhoto, {
				imageKey: dish.image_key,
				name: dish.name
			}), dish.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute top-3 left-3",
				children: "на линии"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-medium leading-snug",
					children: dish.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: dish.description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium tabular-nums whitespace-nowrap",
					children: rub(dish.price)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground tabular-nums",
					children: [
						dish.weight_g,
						" г · ",
						dish.calories,
						" ккал",
						dish.tags.map((t) => TAG_LABEL[t] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" · ", TAG_LABEL[t]] }, t) : null),
						dish.portions_left != null ? ` · ещё ${dish.portions_left}` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					disabled: soldOut,
					onClick: () => {
						add({
							dishId: dish.id,
							name: dish.name,
							price: dish.price,
							categorySlug: dish.category_slug,
							image_key: dish.image_key
						});
						toast.success(`«${dish.name}» в подносе`);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), soldOut ? "Нет" : "В поднос"]
				})]
			})]
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
//#endregion
export { Skeleton as n, DishCard as t };
