import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-aBt_XD6u.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function rub(amount) {
	return `${new Intl.NumberFormat("ru-RU").format(amount)}\u00a0₽`;
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isoWeekday(date = /* @__PURE__ */ new Date()) {
	const d = date.getDay();
	return d === 0 ? 7 : d;
}
function formatDateRu(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date(y, m - 1, d));
}
function formatDateShort(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	return new Intl.DateTimeFormat("ru-RU", {
		day: "numeric",
		month: "short"
	}).format(new Date(y, m - 1, d));
}
//#endregion
export { rub as a, isoWeekday as i, formatDateRu as n, todayISO as o, formatDateShort as r, cn as t };
