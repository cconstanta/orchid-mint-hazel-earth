import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as rub, o as todayISO, r as formatDateShort } from "./utils-aBt_XD6u.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { _ as useStaffPin, a as getReports } from "./pin-context-CSNDa9wO.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-C8eo_RWT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function shiftDays(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
	dt.setDate(dt.getDate() + days);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
var PIE = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)"
];
function AdminReports() {
	const pin = useStaffPin();
	const [from, setFrom] = (0, import_react.useState)(shiftDays(todayISO(), -30));
	const [to, setTo] = (0, import_react.useState)(todayISO());
	const r = useQuery({
		queryKey: [
			"report",
			from,
			to
		],
		queryFn: () => getReports({ data: {
			pin,
			from,
			to
		} }),
		enabled: Boolean(pin)
	}).data;
	const days = (0, import_react.useMemo)(() => (r?.days ?? []).map((d) => ({
		...d,
		label: formatDateShort(d.sale_date)
	})), [r]);
	function download() {
		if (!r) return;
		const header = "дата,выручка,себестоимость,прибыль,порций";
		const body = r.days.map((d) => `${d.sale_date},${d.revenue},${d.cost},${d.profit},${d.portions}`).join("\n");
		const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `peremena-${r.from}-${r.to}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium",
			children: "Выручка и прибыль"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Касса (импорт) плюс предоплаченные заказы. Прибыль = выручка − себестоимость из карточек блюд."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap items-end gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "С" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "По" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: download,
					disabled: !r,
					children: "Скачать CSV"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					k: "Выручка",
					v: rub(r?.revenue ?? 0)
				},
				{
					k: "Себестоимость",
					v: rub(r?.cost ?? 0)
				},
				{
					k: "Прибыль",
					v: rub(r?.profit ?? 0)
				},
				{
					k: "Порций / онлайн",
					v: `${r?.portions ?? 0} / ${r?.orders_online ?? 0}`
				}
			].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: c.k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-2xl tabular-nums",
					children: c.v
				})]
			}, c.k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8 rounded-xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-medium",
				children: "По дням"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: days,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: { fontSize: 12 },
								stroke: "var(--color-muted-foreground)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: { fontSize: 12 },
								stroke: "var(--color-muted-foreground)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => rub(v) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "revenue",
								name: "Выручка",
								stroke: "var(--color-chart-1)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "cost",
								name: "Себест.",
								stroke: "var(--color-chart-2)",
								strokeWidth: 2,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "profit",
								name: "Прибыль",
								stroke: "var(--color-chart-3)",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: "Топ блюд"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: (r?.dishes ?? []).slice(0, 8),
							layout: "vertical",
							margin: { left: 16 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-border)",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 12 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									type: "category",
									dataKey: "dish_name",
									width: 110,
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => rub(v) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revenue",
									name: "Выручка",
									fill: "var(--color-chart-1)",
									radius: [
										0,
										4,
										4,
										0
									]
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: "По категориям"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: r?.categories ?? [],
								dataKey: "revenue",
								nameKey: "category",
								innerRadius: 48,
								outerRadius: 80,
								paddingAngle: 2,
								children: (r?.categories ?? []).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE[i % PIE.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => rub(v) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
						] })
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mt-6 overflow-x-auto rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted text-left text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Блюдо"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Порц."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Выручка"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Себест."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "Прибыль"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (r?.dishes ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: d.dish_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: d.qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: rub(d.revenue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: rub(d.cost)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular-nums",
							children: rub(d.profit)
						})
					]
				}, d.dish_name)) })]
			})
		})
	] });
}
//#endregion
export { AdminReports as component };
