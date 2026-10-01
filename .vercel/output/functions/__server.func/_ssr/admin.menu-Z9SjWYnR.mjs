import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime, n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as rub, i as isoWeekday, t as cn } from "./utils-aBt_XD6u.mjs";
import { i as WEEKDAYS } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { _ as useStaffPin, d as saveWeekdayPlan, g as upsertDish, i as getAdminCatalog, p as setDishFlags, r as applyWeekdayPlan } from "./pin-context-CSNDa9wO.mjs";
import { h as Check, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-Bc9kqMO9.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as withMeatlessTag, i as hasMeatlessTag, n as dishImage, t as DISH_PHOTOS } from "./dish-media-B9AD3N7z.mjs";
import { a as DialogPortal$1, i as DialogOverlay$1, n as DialogClose, o as DialogTitle$1, r as DialogContent$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.menu-Z9SjWYnR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
		className: cn("grid size-5 place-items-center rounded-sm border border-input bg-card data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) })
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
		className: cn("fixed inset-0 z-50 bg-foreground/40", className),
		...props
	});
}
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg", className),
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
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 flex flex-col gap-1.5", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium", className),
		...props
	});
}
function AdminMenu() {
	const pin = useStaffPin();
	const qc = useQueryClient();
	const cat = useQuery({
		queryKey: ["admin-catalog"],
		queryFn: () => getAdminCatalog({ data: { pin } }),
		enabled: Boolean(pin)
	});
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [planDay, setPlanDay] = (0, import_react.useState)(isoWeekday() === 7 ? 1 : isoWeekday());
	const dishes = cat.data?.dishes ?? [];
	const categories = cat.data?.categories ?? [];
	const board = dishes.filter((d) => d.on_board);
	const catalog = (0, import_react.useMemo)(() => dishes.filter((d) => `${d.name} ${d.description}`.toLowerCase().includes(q.toLowerCase())), [dishes, q]);
	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["admin-catalog"] });
		qc.invalidateQueries({ queryKey: ["menu"] });
	};
	const flags = useMutation({
		mutationFn: (p) => setDishFlags({ data: {
			pin,
			...p
		} }),
		onSuccess: invalidate,
		onError: (e) => toast.error(e.message)
	});
	const apply = useMutation({
		mutationFn: (weekday) => applyWeekdayPlan({ data: {
			pin,
			weekday
		} }),
		onSuccess: () => {
			toast.success("Линия на сайте обновлена");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const savePlan = useMutation({
		mutationFn: () => saveWeekdayPlan({ data: {
			pin,
			weekday: planDay,
			dish_ids: board.map((d) => d.id)
		} }),
		onSuccess: () => {
			toast.success(`План ${WEEKDAYS.find((w) => w.id === planDay)?.full} сохранён`);
			invalidate();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium",
				children: "Конструктор линии"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Что стоит на доске — то сразу видно гостям на главной, без входа."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setEditing({
					category_id: categories[0]?.id,
					price: 80,
					cost: 30,
					weight_g: 200,
					calories: 0,
					protein: 0,
					fat: 0,
					carbs: 0,
					tags: [],
					image_key: "",
					description: "",
					name: ""
				}),
				children: "Новое блюдо"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap items-center gap-2",
			children: [
				WEEKDAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPlanDay(d.id),
					className: cn("h-10 rounded-full border px-3 text-sm font-medium", planDay === d.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"),
					children: d.short
				}, d.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => apply.mutate(planDay),
					children: "Поставить план дня на линию"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => savePlan.mutate(),
					children: "Запомнить текущую доску как план дня"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium",
						children: "Картотека"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Поиск",
						className: "max-w-48"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 max-h-[70vh] space-y-2 overflow-auto pr-1",
					children: catalog.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-lg border border-border px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										d.category_name,
										" · ",
										rub(d.price),
										" · себест. ",
										rub(d.cost),
										hasMeatlessTag(d.tags) ? " · без мяса" : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setEditing(d),
								children: "Карточка"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: d.on_board ? "secondary" : "default",
								onClick: () => flags.mutate({
									id: d.id,
									on_board: !d.on_board
								}),
								children: d.on_board ? "Снять" : "На доску"
							})
						]
					}, d.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-xl font-medium",
					children: ["Сегодня на линии · ", board.length]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "Доска пуста. Добавьте блюда слева или примените план дня."
					}) : board.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground tabular-nums",
									children: [
										rub(d.price),
										" · ",
										d.weight_g,
										" г",
										d.portions_left != null ? ` · остаток ${d.portions_left}` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: d.featured,
									onCheckedChange: (v) => flags.mutate({
										id: d.id,
										featured: Boolean(v)
									})
								}), "витрина"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: d.is_available,
									onCheckedChange: (v) => flags.mutate({
										id: d.id,
										is_available: Boolean(v)
									})
								}), "в продаже"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => flags.mutate({
									id: d.id,
									on_board: false
								}),
								children: "Убрать"
							})
						]
					}, d.id))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishDialog, {
			open: Boolean(editing),
			dish: editing,
			categories,
			pin,
			onClose: () => setEditing(null),
			onSaved: () => {
				setEditing(null);
				invalidate();
			}
		})
	] });
}
function DishDialog({ open, dish, categories, pin, onClose, onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[90vh] overflow-auto",
			children: open && dish ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishForm, {
				initial: dish,
				categories,
				pin,
				onSaved
			}, dish.id ?? "new") : null
		})
	});
}
function DishForm({ initial, categories, pin, onSaved }) {
	const [name, setName] = (0, import_react.useState)(initial.name ?? "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(initial.category_id ?? categories[0]?.id ?? 0);
	const [description, setDescription] = (0, import_react.useState)(initial.description ?? "");
	const [price, setPrice] = (0, import_react.useState)(initial.price ?? 0);
	const [cost, setCost] = (0, import_react.useState)(initial.cost ?? 0);
	const [weight, setWeight] = (0, import_react.useState)(initial.weight_g ?? 0);
	const [calories, setCalories] = (0, import_react.useState)(initial.calories ?? 0);
	const [protein, setProtein] = (0, import_react.useState)(initial.protein ?? 0);
	const [fat, setFat] = (0, import_react.useState)(initial.fat ?? 0);
	const [carbs, setCarbs] = (0, import_react.useState)(initial.carbs ?? 0);
	const [meatless, setMeatless] = (0, import_react.useState)(hasMeatlessTag(initial.tags));
	const [imageKey, setImageKey] = (0, import_react.useState)(DISH_PHOTOS.some((p) => p.key === initial.image_key) ? initial.image_key ?? "" : "");
	const [limit, setLimit] = (0, import_react.useState)(initial.portion_limit == null ? "" : String(initial.portion_limit));
	const save = useMutation({
		mutationFn: () => upsertDish({ data: {
			pin,
			id: initial.id,
			category_id: categoryId,
			name,
			description,
			price,
			cost,
			weight_g: weight,
			calories,
			protein,
			fat,
			carbs,
			tags: withMeatlessTag(initial.tags, meatless),
			image_key: imageKey,
			portion_limit: limit === "" ? null : Number(limit)
		} }),
		onSuccess: () => {
			toast.success("Карточка сохранена");
			onSaved();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: initial.id ? "Карточка блюда" : "Новое блюдо" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Название" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Категория" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "flex h-11 rounded-md border border-input bg-background px-3 text-sm",
					value: categoryId,
					onChange: (e) => setCategoryId(Number(e.target.value)),
					children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.name
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Описание" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Цена, ₽" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: price,
							onChange: (e) => setPrice(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Себестоимость, ₽" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: cost,
							onChange: (e) => setCost(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Выход, г" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: weight,
							onChange: (e) => setWeight(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ккал" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: calories,
							onChange: (e) => setCalories(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Белки" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: protein,
							onChange: (e) => setProtein(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Жиры" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: fat,
							onChange: (e) => setFat(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Углеводы" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: carbs,
							onChange: (e) => setCarbs(Number(e.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Лимит порций (пусто = без)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: limit,
							onChange: (e) => setLimit(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-start gap-3 rounded-md border border-border bg-background px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: meatless,
					onCheckedChange: (v) => setMeatless(Boolean(v)),
					className: "mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-medium",
					children: "Без мяса"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted-foreground",
					children: "Гости увидят метку и найдут блюдо в фильтре «Без мяса»"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Фото на карточке" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Выберите готовый снимок. Если не подходит — оставьте «Без фото»."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setImageKey(""),
							className: cn("flex min-h-16 flex-col items-center justify-center rounded-md border px-1 py-2 text-center text-xs font-medium", imageKey === "" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"),
							children: "Без фото"
						}), DISH_PHOTOS.map((photo) => {
							const src = dishImage(photo.key);
							const selected = imageKey === photo.key;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setImageKey(photo.key),
								className: cn("overflow-hidden rounded-md border text-left", selected ? "border-primary ring-2 ring-primary/30" : "border-border"),
								children: [src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src,
									alt: "",
									className: "aspect-square w-full object-cover"
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("block truncate px-1 py-1 text-center text-xs font-medium", selected ? "bg-primary text-primary-foreground" : "bg-muted"),
									children: photo.label
								})]
							}, photo.key);
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: save.isPending,
				className: "sticky bottom-0",
				children: "Сохранить"
			})
		]
	})] });
}
//#endregion
export { AdminMenu as component };
