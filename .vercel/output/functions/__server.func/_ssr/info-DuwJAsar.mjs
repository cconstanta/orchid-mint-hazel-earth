import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { c as ShieldCheck, m as Clock3, p as MapPin, u as Phone } from "../_libs/lucide-react.mjs";
import { r as getPublicInfo } from "./public-CcmRuIuT.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/info-DuwJAsar.js
var import_jsx_runtime = require_jsx_runtime();
function InfoPage() {
	const info = useQuery({
		queryKey: ["info"],
		queryFn: () => getPublicInfo()
	}).data?.info;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: info?.college_name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-medium",
				children: info?.canteen_name ?? "Столовая"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted-foreground",
				children: info?.about
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-xl font-medium",
								children: "Адрес"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: info?.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: info?.director
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-xl font-medium",
								children: "Стойка"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: info?.phone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Вопросы по предзаказу — в рабочие часы линии."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-xl font-medium",
								children: "График"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: (info?.hours ?? []).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.days }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums text-muted-foreground",
										children: [h.line, h.kitchen ? ` · кухня ${h.kitchen}` : ""]
									})]
								}, h.days))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-xl font-medium",
								children: "Предоплата"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: info?.pickup_rules
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl border border-border bg-card p-5 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium",
					children: "Как устроена линия"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-6 text-sm text-muted-foreground md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Меню на день собирает заведующая в конструкторе. Как только блюдо ставят на доску, оно появляется на главной и в разделе «Меню» — вход для этого не нужен." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Наличные и карта — на кассе линии. Предзаказ в приложении всегда с полной предоплатой: так кухня видит загрузку по слотам и не готовит вхолостую." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Продажи с кассы загружают файлом (CSV). Графики выручки и прибыли считают себестоимость каждого блюда, заданную в карточке." })
					]
				})]
			})
		]
	}) });
}
//#endregion
export { InfoPage as component };
