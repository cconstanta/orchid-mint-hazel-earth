import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as rub } from "./utils-aBt_XD6u.mjs";
import { n as PICKUP_SLOTS } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { a as Trash2, d as Minus, l as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-Bc9kqMO9.mjs";
import { o as placeOrder } from "./public-CcmRuIuT.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as comboCount, i as cartTotal, n as cartDiscount, o as useCart, r as cartSubtotal, t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
import { t as DishPhoto } from "./dish-photo-zvl2UGa4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-BEUReTV0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const clear = useCart((s) => s.clear);
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [guest, setGuest] = (0, import_react.useState)("");
	const [group, setGroup] = (0, import_react.useState)("");
	const [slot, setSlot] = (0, import_react.useState)(PICKUP_SLOTS[2] ?? PICKUP_SLOTS[0]);
	const [note, setNote] = (0, import_react.useState)("");
	const [lookup, setLookup] = (0, import_react.useState)("");
	const subtotal = cartSubtotal(items);
	const discount = cartDiscount(items);
	const total = cartTotal(items);
	const combos = comboCount(items);
	const pay = useMutation({
		mutationFn: () => placeOrder({ data: {
			guest_label: guest,
			group_code: group,
			pickup_slot: slot,
			note,
			items: items.map((i) => ({
				dishId: i.dishId,
				qty: i.qty
			}))
		} }),
		onSuccess: (res) => {
			clear();
			qc.invalidateQueries({ queryKey: ["menu"] });
			toast.success("Оплачено. Заказ принят.");
			navigate({
				to: "/pickup/$code",
				params: { code: res.pickup_code }
			});
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_22rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-medium",
				children: "Предзаказ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Полная предоплата. На линии называете код — без кассы."
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border border-border bg-card p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Поднос пуст."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/menu",
						children: "Открыть меню"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 divide-y divide-border rounded-xl border border-border bg-card",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 overflow-hidden rounded-md bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishPhoto, {
								imageKey: item.image_key,
								name: item.name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground tabular-nums",
								children: rub(item.price)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									className: "size-9",
									onClick: () => setQty(item.dishId, item.qty - 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-8 text-center tabular-nums",
									children: item.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "outline",
									className: "size-9",
									onClick: () => setQty(item.dishId, item.qty + 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "size-9",
							onClick: () => remove(item.dishId),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})
					]
				}, item.dishId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid gap-4 rounded-xl border border-border bg-card p-5",
				onSubmit: (e) => {
					e.preventDefault();
					if (!items.length) return;
					pay.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium",
						children: "Получатель и оплата"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "guest",
								children: "Как к вам обратиться"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "guest",
								value: guest,
								onChange: (e) => setGuest(e.target.value),
								required: true,
								minLength: 2,
								placeholder: "Алексей"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "group",
								children: "Группа"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "group",
								value: group,
								onChange: (e) => setGroup(e.target.value),
								required: true,
								minLength: 2,
								placeholder: "ИС-21"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "slot",
							children: "Окно выдачи"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "slot",
							value: slot,
							onChange: (e) => setSlot(e.target.value),
							className: "flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: PICKUP_SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "Комментарий для раздачи"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							maxLength: 160,
							placeholder: "Без хлеба, компот в стакане"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Учебная оплата: средства не списываются с карты. Нажимаете «Оплатить» — заказ сразу считается предоплаченным."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: !items.length || pay.isPending,
						children: pay.isPending ? "Оплата…" : `Оплатить ${rub(total)}`
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium",
					children: "Итого"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Позиции"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: rub(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "text-muted-foreground",
								children: ["Комплекс ", combos ? `× ${combos}` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: discount ? `− ${rub(discount)}` : "—" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-t border-border pt-2 text-base font-medium tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "К оплате" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: rub(total) })]
						})
					]
				}),
				combos ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: [
						"Скидка ",
						rub(40),
						" за каждый набор первое+второе+напиток."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 border-t border-border pt-5",
					onSubmit: (e) => {
						e.preventDefault();
						const code = lookup.trim().toUpperCase();
						if (code.length < 4) return;
						navigate({
							to: "/pickup/$code",
							params: { code }
						});
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "lookup",
						children: "Уже заказывали? Код выдачи"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lookup",
							value: lookup,
							onChange: (e) => setLookup(e.target.value),
							placeholder: "ПМ2401",
							className: "uppercase"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "outline",
							children: "Найти"
						})]
					})]
				})
			]
		})]
	}) });
}
//#endregion
export { OrderPage as component };
