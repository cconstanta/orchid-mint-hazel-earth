import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as formatDateRu } from "./utils-aBt_XD6u.mjs";
import { i as WEEKDAYS } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { _ as ArrowRight, m as Clock3, n as Wallet, o as Ticket, p as MapPin } from "../_libs/lucide-react.mjs";
import { i as getPublicMenu, r as getPublicInfo } from "./public-CcmRuIuT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
import { n as Skeleton, t as DishCard } from "./skeleton-CCGXjT9b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BdGuoEtX.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const menu = useQuery({
		queryKey: ["menu"],
		queryFn: () => getPublicMenu()
	});
	const info = useQuery({
		queryKey: ["info"],
		queryFn: () => getPublicInfo()
	});
	const featured = (menu.data?.dishes ?? []).filter((d) => d.featured).slice(0, 4);
	const fallback = (menu.data?.dishes ?? []).slice(0, 4);
	const show = featured.length ? featured : fallback;
	const weekday = WEEKDAYS.find((w) => w.id === menu.data?.weekday);
	const closed = menu.data?.closed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/food/hero.jpg",
					alt: "Линия раздачи столовой",
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-foreground/55" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tracking-wide text-primary-foreground/80 uppercase",
							children: "ГБПОУ «Политех-колледж №12»"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-xl font-display text-4xl font-medium text-primary-foreground md:text-6xl",
							children: "Обед без очереди — на перемене и после пары"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-lg text-base text-primary-foreground/85 md:text-lg",
							children: "Соберите меню на сегодня, оплатите заранее и заберите по коду. Линия раздачи открыта, карта в приложении обновляется сразу из админки."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/menu",
									children: ["Меню на сегодня", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "bg-background text-foreground hover:bg-background/90",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/order",
									children: "Оформить предзаказ"
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Сегодня"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: closed ? "Воскресенье · меню ближайшего дня" : `${weekday?.full ?? "Будни"} · линия 08:00–16:00`
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Адрес"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "ул. Учебная, 12, 1 этаж"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Предзаказ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Полная предоплата, выдача по коду"
						})] })]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: menu.data ? formatDateRu(menu.data.date) : "Сегодня"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium",
					children: "На линии сейчас"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/menu",
						children: "Всё меню"
					})
				})]
			}), menu.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: show.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishCard, { dish: d }, d.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-card border-y border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-medium",
					children: "Как заказать заранее"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-8 grid gap-6 md:grid-cols-3",
					children: [
						{
							icon: Ticket,
							n: "01",
							t: "Соберите поднос",
							d: "Первое, второе и напиток дают скидку 40 ₽ на комплекс. Или возьмите готовый набор."
						},
						{
							icon: Wallet,
							n: "02",
							t: "Оплатите полностью",
							d: "Имя, группа и окно выдачи. Деньги списываются сразу — на линии только код."
						},
						{
							icon: Clock3,
							n: "03",
							t: "Заберите в слот",
							d: "Покажите код на раздаче. Статус заказа виден по ссылке, без входа."
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-background p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs tracking-wide text-muted-foreground uppercase",
								children: s.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 font-display text-xl font-medium",
								children: s.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: s.d
							})
						]
					}, s.n))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-medium",
				children: "Объявления"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-3",
				children: (info.data?.announcements ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-medium",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: a.body
					})]
				}, a.id))
			})]
		})
	] });
}
//#endregion
export { Home as component };
