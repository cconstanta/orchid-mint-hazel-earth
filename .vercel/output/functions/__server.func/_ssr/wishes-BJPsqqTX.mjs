import { o as __toESM } from "../_runtime.mjs";
import { h as require_react, m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as WISH_STATUS_LABEL } from "./types-9cYW1rdd.mjs";
import { t as Button } from "./createSsrRpc-0WoJLQU-.mjs";
import { t as Input } from "./input-CdHUkiXz.mjs";
import { t as Label } from "./label-DnoV1xZ7.mjs";
import { g as ArrowUp } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-Bc9kqMO9.mjs";
import { a as getPublicWishes, s as voteWish, t as createWish } from "./public-CcmRuIuT.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-BilPiwiN.mjs";
import { t as SiteShell } from "./site-shell-NBV_EkLt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishes-BJPsqqTX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WishesPage() {
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["wishes"],
		queryFn: () => getPublicWishes()
	});
	const [alias, setAlias] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const send = useMutation({
		mutationFn: () => createWish({ data: {
			alias,
			body
		} }),
		onSuccess: () => {
			setBody("");
			toast.success("Пожелание ушло заведующей");
			qc.invalidateQueries({ queryKey: ["wishes"] });
		},
		onError: (err) => toast.error(err.message)
	});
	const vote = useMutation({
		mutationFn: (id) => voteWish({ data: { id } }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["wishes"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[20rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-medium",
				children: "Пожелания"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Что добавить в линию, что убрать, какие комплексы сделать постоянными. Голос без регистрации — пишите псевдоним и группу, если хотите."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3 rounded-xl border border-border bg-card p-5",
				onSubmit: (e) => {
					e.preventDefault();
					send.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "alias",
							children: "Псевдоним"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "alias",
							value: alias,
							onChange: (e) => setAlias(e.target.value),
							required: true,
							minLength: 2,
							placeholder: "Ира, ИС-22"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "wish",
							children: "Идея"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "wish",
							value: body,
							onChange: (e) => setBody(e.target.value),
							required: true,
							minLength: 8,
							placeholder: "Например: гренки к борщу по вторникам"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: send.isPending,
						children: "Отправить"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: (list.data ?? []).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-4 rounded-xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-border hover:bg-muted",
					onClick: () => vote.mutate(w.id),
					"aria-label": "Поддержать",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium tabular-nums",
						children: w.votes
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: w.alias
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: WISH_STATUS_LABEL[w.status] ?? w.status
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: w.body
					})]
				})]
			}, w.id))
		})]
	}) });
}
//#endregion
export { WishesPage as component };
