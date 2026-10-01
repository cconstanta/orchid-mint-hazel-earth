import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-aBt_XD6u.mjs";
import { r as STAFF_PIN_HINT } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { t as PinCtx, v as verifyStaff } from "./pin-context-CSNDa9wO.mjs";
import { r as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CFKB86gR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "peremena-staff-pin";
function getStaffPin() {
	if (typeof window === "undefined") return "";
	return sessionStorage.getItem(KEY) ?? "";
}
function setStaffPin(pin) {
	sessionStorage.setItem(KEY, pin);
}
function clearStaffPin() {
	sessionStorage.removeItem(KEY);
}
var ADMIN_NAV = [
	{
		to: "/admin",
		label: "Сводка",
		exact: true
	},
	{
		to: "/admin/menu",
		label: "Конструктор"
	},
	{
		to: "/admin/orders",
		label: "Заказы"
	},
	{
		to: "/admin/sales",
		label: "Импорт продаж"
	},
	{
		to: "/admin/reports",
		label: "Отчёты"
	},
	{
		to: "/admin/wishes",
		label: "Пожелания"
	}
];
function AdminLayout() {
	const [pin, setPin] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		const stored = getStaffPin();
		if (!stored) {
			setReady(true);
			return;
		}
		verifyStaff({ data: { pin: stored } }).then(() => setPin(stored)).catch(() => clearStaffPin()).finally(() => setReady(true));
	}, []);
	async function onSubmit(e) {
		e.preventDefault();
		try {
			await verifyStaff({ data: { pin: input } });
			setStaffPin(input);
			setPin(input);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Нет доступа");
		}
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-svh bg-background" });
	if (!pin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-svh items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "w-full max-w-sm rounded-xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-md bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtensilsCrossed, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-medium",
						children: "Кабинет"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Только сотрудники линии"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pin",
						children: "Код сотрудника"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "pin",
						inputMode: "numeric",
						autoComplete: "off",
						value: input,
						onChange: (e) => setInput(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: ["Учебный доступ для преподавателя: ", STAFF_PIN_HINT]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-5 w-full",
					children: "Войти"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-2 w-full",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "На главную"
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinCtx.Provider, {
		value: pin,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-svh bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "font-display text-lg font-medium",
							children: "Перемена · цех"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-1 flex-wrap gap-1",
							children: ADMIN_NAV.map((item) => {
								const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("rounded-md px-2.5 py-1.5 text-sm font-medium", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								clearStaffPin();
								setPin("");
							},
							children: "Выйти"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Сайт"
							})
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})
	});
}
//#endregion
export { AdminLayout as component };
