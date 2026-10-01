import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rub, n as formatDateRu, t as cn } from "./utils-aBt_XD6u.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as getPublicMenu } from "./public-CcmRuIuT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { o as useCart, t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
import { n as Skeleton, t as DishCard } from "./skeleton-CCGXjT9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-CHSEgPCg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MenuPage() {
	const menu = useQuery({
		queryKey: ["menu"],
		queryFn: () => getPublicMenu()
	});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const dishes = menu.data?.dishes ?? [];
	const categories = menu.data?.categories ?? [];
	const visible = (0, import_react.useMemo)(() => {
		return dishes.filter((d) => {
			if (filter === "veg") return d.tags.includes("veg");
			if (filter !== "all" && d.category_slug !== filter) return false;
			if (q.trim() && !`${d.name} ${d.description}`.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		dishes,
		filter,
		q
	]);
	const grouped = categories.map((c) => ({
		...c,
		items: visible.filter((d) => d.category_id === c.id)
	})).filter((c) => c.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: menu.data ? formatDateRu(menu.data.date) : "…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-medium",
					children: "Меню на сегодня"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/order",
						children: "К оформлению"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: [
					"Карта линии обновляется из админки сразу. Комплекс из первого, второго и напитка — скидка ",
					rub(40),
					" при оплате."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 md:flex-row md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						{
							id: "all",
							label: "Всё"
						},
						{
							id: "veg",
							label: "Без мяса"
						},
						...categories.map((c) => ({
							id: c.slug,
							label: c.name
						}))
					].map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(chip.id),
						className: cn("h-10 rounded-full border px-3 text-sm font-medium", filter === chip.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted"),
						children: chip.label
					}, chip.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Найти блюдо",
					className: "md:ml-auto md:max-w-xs"
				})]
			}),
			menu.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				menu.data?.closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground",
					children: "По графику воскресенье — выходной. Ниже меню ближайшего рабочего дня, предзаказ можно оформить."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComboBuilder, { dishes }),
				grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium",
						children: g.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: g.items.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishCard, { dish: d }, d.id))
					})]
				}, g.id))
			] })
		]
	}) });
}
function ComboBuilder({ dishes }) {
	const add = useCart((s) => s.add);
	const [soup, setSoup] = (0, import_react.useState)("");
	const [main, setMain] = (0, import_react.useState)("");
	const [drink, setDrink] = (0, import_react.useState)("");
	const soups = dishes.filter((d) => d.category_slug === "soups");
	const mains = dishes.filter((d) => d.category_slug === "mains");
	const drinks = dishes.filter((d) => d.category_slug === "drinks");
	if (!soups.length || !mains.length || !drinks.length) return null;
	const picked = [
		soup,
		main,
		drink
	].map((id) => dishes.find((d) => d.id === id)).filter(Boolean);
	const sum = picked.reduce((s, d) => s + d.price, 0);
	const ready = picked.length === 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10 rounded-xl border border-border bg-card p-5 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-medium",
				children: "Соберите комплекс"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Первое + второе + напиток. Скидка ",
					rub(40),
					" применится на оплате."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-3",
				children: [
					{
						label: "Первое",
						list: soups,
						value: soup,
						set: setSoup
					},
					{
						label: "Второе",
						list: mains,
						value: main,
						set: setMain
					},
					{
						label: "Напиток",
						list: drinks,
						value: drink,
						set: setDrink
					}
				].map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-medium",
					children: [col.label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: col.value,
						onChange: (e) => col.set(e.target.value ? Number(e.target.value) : ""),
						className: "mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Выберите"
						}), col.list.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: d.id,
							children: [
								d.name,
								" — ",
								d.price,
								" ₽"
							]
						}, d.id))]
					})]
				}, col.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tabular-nums",
					children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground line-through",
						children: rub(sum)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-medium",
						children: rub(sum - 40)
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Выберите три позиции"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: !ready,
					onClick: () => {
						for (const d of picked) add({
							dishId: d.id,
							name: d.name,
							price: d.price,
							categorySlug: d.category_slug,
							image_key: d.image_key
						});
						toast.success("Комплекс в подносе");
						setSoup("");
						setMain("");
						setDrink("");
					},
					children: "Добавить комплекс"
				})]
			})
		]
	});
}
//#endregion
export { MenuPage as component };
