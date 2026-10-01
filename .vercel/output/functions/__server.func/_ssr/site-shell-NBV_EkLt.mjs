import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-aBt_XD6u.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { f as Menu, r as UtensilsCrossed, s as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-NBV_EkLt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
function SheetContent({ className, children, side = "right", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 bg-card text-card-foreground shadow-lg", side === "right" && "inset-y-0 right-0 h-full w-full max-w-md border-l border-border", side === "left" && "inset-y-0 left-0 h-full w-full max-w-sm border-r border-border", side === "bottom" && "inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl border-t border-border", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Закрыть"
			})]
		})]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 p-5", className),
		...props
	});
}
function SheetTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		className: cn("font-display text-xl font-medium", className),
		...props
	});
}
var useCart = create()(persist((set, get) => ({
	items: [],
	add: (item, qty = 1) => {
		if (get().items.find((i) => i.dishId === item.dishId)) set({ items: get().items.map((i) => i.dishId === item.dishId ? {
			...i,
			qty: i.qty + qty
		} : i) });
		else set({ items: [...get().items, {
			...item,
			qty
		}] });
	},
	setQty: (dishId, qty) => {
		if (qty <= 0) {
			set({ items: get().items.filter((i) => i.dishId !== dishId) });
			return;
		}
		set({ items: get().items.map((i) => i.dishId === dishId ? {
			...i,
			qty
		} : i) });
	},
	remove: (dishId) => set({ items: get().items.filter((i) => i.dishId !== dishId) }),
	clear: () => set({ items: [] })
}), { name: "peremena-cart" }));
function cartCount(items) {
	return items.reduce((s, i) => s + i.qty, 0);
}
function cartSubtotal(items) {
	return items.reduce((s, i) => s + i.price * i.qty, 0);
}
function comboCount(items) {
	const soup = items.filter((i) => i.categorySlug === "soups").reduce((s, i) => s + i.qty, 0);
	const main = items.filter((i) => i.categorySlug === "mains").reduce((s, i) => s + i.qty, 0);
	const drink = items.filter((i) => i.categorySlug === "drinks").reduce((s, i) => s + i.qty, 0);
	return Math.min(soup, main, drink);
}
function cartDiscount(items) {
	if (items.some((i) => i.categorySlug === "combos")) return 0;
	return comboCount(items) * 40;
}
function cartTotal(items) {
	return Math.max(0, cartSubtotal(items) - cartDiscount(items));
}
var NAV = [
	{
		to: "/",
		label: "Сегодня"
	},
	{
		to: "/menu",
		label: "Меню"
	},
	{
		to: "/order",
		label: "Заказ"
	},
	{
		to: "/wishes",
		label: "Пожелания"
	},
	{
		to: "/info",
		label: "Столовая"
	}
];
function SiteHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const items = useCart((s) => s.items);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setHydrated(true), []);
	const count = hydrated ? cartCount(items) : 0;
	const links = (onClick) => NAV.map((item) => {
		const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: item.to,
			onClick,
			className: cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"),
			children: item.label
		}, item.to);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-md bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-base font-medium",
							children: "Перемена"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[11px] tracking-wide text-muted-foreground uppercase",
							children: "столовая колледжа"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: links()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							className: "relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/order",
								"aria-label": "Поднос",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums",
									children: count
								}) : null]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							className: "hidden md:inline-flex",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								children: "Сотрудникам"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "md:hidden",
									"aria-label": "Меню",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "right",
								className: "flex flex-col",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Перемена" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
										className: "flex flex-col gap-1 px-4",
										children: links(() => setOpen(false))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-auto p-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											className: "w-full",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/admin",
												onClick: () => setOpen(false),
												children: "Кабинет сотрудника"
											})
										})
									})
								]
							})]
						})
					]
				})
			]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-auto border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Столовая «Перемена» · ГБПОУ «Политех-колледж №12»" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/info",
						className: "hover:text-foreground",
						children: "График и адрес"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishes",
						className: "hover:text-foreground",
						children: "Пожелания"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "hover:text-foreground",
						children: "Админка"
					})
				]
			})]
		})
	});
}
function SiteShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { comboCount as a, cartTotal as i, cartDiscount as n, useCart as o, cartSubtotal as r, SiteShell as t };
