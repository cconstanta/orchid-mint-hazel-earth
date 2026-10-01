import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as rub } from "./utils-aBt_XD6u.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { _ as useStaffPin, o as importSales } from "./pin-context-CSNDa9wO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-Bc9kqMO9.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.sales-B5pp-FEO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function looksLikeDate(s) {
	return /^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{2}\.\d{2}\.\d{4}$/.test(s);
}
function toIso(s) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
	const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
	if (m) return `${m[3]}-${m[2]}-${m[1]}`;
	return "";
}
function parseSalesCsv(text) {
	const raw = text.replace(/^\uFEFF/, "").trim();
	const errors = [];
	if (!raw) return {
		rows: [],
		errors: ["Файл пустой"]
	};
	const first = raw.split(/\r?\n/)[0] ?? "";
	const delim = first.includes(";") ? ";" : first.includes("	") ? "	" : ",";
	const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	const cells = (line) => line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
	const head = cells(lines[0] ?? "").map((h) => h.toLowerCase());
	const idx = {
		date: head.findIndex((h) => [
			"date",
			"дата",
			"день"
		].includes(h)),
		dish: head.findIndex((h) => [
			"dish",
			"блюдо",
			"наименование",
			"название"
		].includes(h)),
		qty: head.findIndex((h) => [
			"qty",
			"количество",
			"кол-во",
			"порций",
			"продано"
		].includes(h)),
		price: head.findIndex((h) => ["price", "цена"].includes(h))
	};
	const hasHeader = idx.date >= 0 && idx.dish >= 0 && idx.qty >= 0;
	const start = hasHeader ? 1 : 0;
	const rows = [];
	for (let i = start; i < lines.length; i += 1) {
		const cols = cells(lines[i] ?? "");
		const dateRaw = hasHeader ? cols[idx.date] ?? "" : cols[0] ?? "";
		const dish = hasHeader ? cols[idx.dish] ?? "" : cols[1] ?? "";
		const qtyRaw = hasHeader ? cols[idx.qty] ?? "" : cols[2] ?? "";
		const priceRaw = hasHeader ? idx.price >= 0 ? cols[idx.price] ?? "" : "" : cols[3] ?? "";
		const date = toIso(dateRaw);
		const qty = Number.parseInt(qtyRaw.replace(/\s/g, ""), 10);
		const price = priceRaw ? Number.parseInt(priceRaw.replace(/\s/g, ""), 10) : void 0;
		if (!looksLikeDate(dateRaw) || !date) {
			errors.push(`Строка ${i + 1}: неверная дата`);
			continue;
		}
		if (!dish) {
			errors.push(`Строка ${i + 1}: нет названия`);
			continue;
		}
		if (!Number.isFinite(qty) || qty < 1) {
			errors.push(`Строка ${i + 1}: количество`);
			continue;
		}
		rows.push({
			date,
			dish,
			qty,
			price: price && price > 0 ? price : void 0
		});
	}
	return {
		rows,
		errors
	};
}
function AdminSales() {
	const pin = useStaffPin();
	const qc = useQueryClient();
	const [preview, setPreview] = (0, import_react.useState)([]);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [raw, setRaw] = (0, import_react.useState)("");
	function applyText(text) {
		setRaw(text);
		const parsed = parseSalesCsv(text);
		setPreview(parsed.rows);
		setErrors(parsed.errors);
	}
	const send = useMutation({
		mutationFn: () => importSales({ data: {
			pin,
			rows: preview
		} }),
		onSuccess: (res) => {
			toast.success(`Загружено строк: ${res.imported}`);
			qc.invalidateQueries({ queryKey: ["report"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium",
			children: "Импорт продаж"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-muted-foreground",
			children: "Выгрузка с кассы: дата, блюдо, количество, цена. Повторная загрузка той же даты и блюда заменяет строку кассы, онлайн-заказы не трогает."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "inline-flex h-11 cursor-pointer items-center rounded-md border border-border bg-card px-4 text-sm font-medium",
				children: ["Выбрать CSV", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: ".csv,text/csv,text/plain",
					className: "sr-only",
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						const reader = new FileReader();
						reader.onload = () => applyText(String(reader.result ?? ""));
						reader.readAsText(file);
					}
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/samples/sales-template.csv",
					download: true,
					children: "Скачать шаблон"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
			className: "mt-4 min-h-40 font-mono text-sm",
			value: raw,
			onChange: (e) => applyText(e.target.value),
			placeholder: "дата,блюдо,количество,цена\n2026-09-12,Борщ украинский,40,95"
		}),
		errors.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 text-sm text-destructive",
			children: errors.slice(0, 6).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, e))
		}) : null,
		preview.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-xl font-medium",
					children: ["Предпросмотр · ", preview.length]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: send.isPending,
					onClick: () => send.mutate(),
					children: "Записать в отчёт"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted text-left text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 font-medium",
								children: "Дата"
							}),
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
								children: "Цена"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: preview.slice(0, 40).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: r.dish
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 tabular-nums",
								children: r.price ? rub(r.price) : "из карточки"
							})
						]
					}, `${r.date}-${r.dish}-${i}`)) })]
				})
			})]
		}) : null
	] });
}
//#endregion
export { AdminSales as component };
