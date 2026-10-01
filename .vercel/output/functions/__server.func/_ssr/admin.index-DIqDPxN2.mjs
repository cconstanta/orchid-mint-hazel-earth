import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rub, o as todayISO } from "./utils-aBt_XD6u.mjs";
import { t as ORDER_STATUS_LABEL } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { _ as useStaffPin, a as getReports, c as listOrders, f as setAnnouncementPublished, n as addAnnouncement, s as listAnnouncementsAdmin, u as saveSettings } from "./pin-context-CSNDa9wO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-Bc9kqMO9.mjs";
import { r as getPublicInfo } from "./public-CcmRuIuT.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-DIqDPxN2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function shiftDays(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
	dt.setDate(dt.getDate() + days);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function AdminHome() {
	const pin = useStaffPin();
	const from = shiftDays(todayISO(), -30);
	const to = todayISO();
	const report = useQuery({
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
	});
	const active = (useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => listOrders({ data: { pin } }),
		enabled: Boolean(pin)
	}).data ?? []).filter((o) => [
		"paid",
		"cooking",
		"ready"
	].includes(o.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium",
			children: "Сводка смены"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Выручка за 30 дней считается по кассовому импорту и предоплаченным заказам."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					k: "Выручка",
					v: report.isLoading ? "…" : rub(report.data?.revenue ?? 0)
				},
				{
					k: "Себестоимость",
					v: report.isLoading ? "…" : rub(report.data?.cost ?? 0)
				},
				{
					k: "Прибыль",
					v: report.isLoading ? "…" : rub(report.data?.profit ?? 0)
				},
				{
					k: "Порций",
					v: report.isLoading ? "…" : String(report.data?.portions ?? 0)
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: "Очередь выдачи"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/orders",
						children: "Все заказы"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground",
					children: "Живых предзаказов нет."
				}) : active.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium tracking-wide",
							children: o.pickup_code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								o.guest_label,
								" · ",
								o.pickup_slot
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ORDER_STATUS_LABEL[o.status] })
					]
				}, o.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsEditor, { pin })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsEditor, { pin })
	] });
}
function NewsEditor({ pin }) {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["admin-news"],
		queryFn: () => listAnnouncementsAdmin({ data: { pin } }),
		enabled: Boolean(pin)
	});
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const add = useMutation({
		mutationFn: () => addAnnouncement({ data: {
			pin,
			title,
			body
		} }),
		onSuccess: () => {
			setTitle("");
			setBody("");
			qc.invalidateQueries({ queryKey: ["admin-news"] });
			qc.invalidateQueries({ queryKey: ["info"] });
			toast.success("Объявление на сайте");
		},
		onError: (e) => toast.error(e.message)
	});
	const pub = useMutation({
		mutationFn: (p) => setAnnouncementPublished({ data: {
			pin,
			...p
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-news"] });
			qc.invalidateQueries({ queryKey: ["info"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-medium",
			children: "Объявления на главной"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 grid gap-2",
			onSubmit: (e) => {
				e.preventDefault();
				add.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Заголовок",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Текст",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: add.isPending,
					children: "Опубликовать"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: (list.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: a.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-muted-foreground",
					children: a.body
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => pub.mutate({
						id: a.id,
						is_published: !a.is_published
					}),
					children: a.is_published ? "Скрыть" : "Показать"
				})]
			}, a.id))
		})
	] });
}
function SettingsEditor({ pin }) {
	const qc = useQueryClient();
	const info = useQuery({
		queryKey: ["info"],
		queryFn: () => getPublicInfo()
	});
	const [form, setForm] = (0, import_react.useState)(null);
	const i = info.data?.info;
	const current = form ?? (i ? {
		college_name: i.college_name,
		address: i.address,
		phone: i.phone,
		about: i.about,
		pickup_rules: i.pickup_rules,
		director: i.director,
		hours_text: i.hours.map((h) => `${h.days}: ${h.line}`).join("\n")
	} : null);
	const save = useMutation({
		mutationFn: () => saveSettings({ data: {
			pin,
			...current
		} }),
		onSuccess: () => {
			toast.success("Реквизиты обновлены на сайте");
			qc.invalidateQueries({ queryKey: ["info"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!current) return null;
	const set = (k, v) => setForm({
		...current,
		[k]: v
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-medium",
				children: "Реквизиты и график"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Меняется вкладка «Столовая» без перезапуска."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Колледж" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: current.college_name,
							onChange: (e) => set("college_name", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Телефон" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: current.phone,
							onChange: (e) => set("phone", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Адрес" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: current.address,
							onChange: (e) => set("address", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "О столовой" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: current.about,
							onChange: (e) => set("about", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Правила предоплаты" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: current.pickup_rules,
							onChange: (e) => set("pickup_rules", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Заведующая" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: current.director,
							onChange: (e) => set("director", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "График, по строке «дни: часы»" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: current.hours_text,
							onChange: (e) => set("hours_text", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending,
							children: "Сохранить на сайт"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { AdminHome as component };
