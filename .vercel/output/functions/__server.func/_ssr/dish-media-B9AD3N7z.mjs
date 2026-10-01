//#region node_modules/.nitro/vite/services/ssr/assets/dish-media-B9AD3N7z.js
var DISH_PHOTOS = [
	{
		key: "borscht",
		label: "Борщ"
	},
	{
		key: "chicken-soup",
		label: "Куриный суп"
	},
	{
		key: "cutlet",
		label: "Котлета"
	},
	{
		key: "goulash",
		label: "Гуляш"
	},
	{
		key: "fish",
		label: "Рыба в кляре"
	},
	{
		key: "plov",
		label: "Плов"
	},
	{
		key: "olivier",
		label: "Оливье"
	},
	{
		key: "pirozhok",
		label: "Пирожок"
	},
	{
		key: "syrniki",
		label: "Сырники"
	},
	{
		key: "cocoa",
		label: "Какао"
	},
	{
		key: "combo",
		label: "Комплекс"
	}
];
var KNOWN = new Set(DISH_PHOTOS.map((p) => p.key));
function dishImage(key) {
	if (key && KNOWN.has(key)) return `/food/${key}.jpg`;
	return null;
}
function dishInitials(name) {
	const parts = name.replace(/[«»"]/g, "").split(/\s+/).filter(Boolean);
	return ((parts[0]?.[0] ?? "Б") + (parts[1]?.[0] ?? "")).toUpperCase();
}
function tagList(tags) {
	return (Array.isArray(tags) ? tags : String(tags ?? "").split(",")).map((t) => t.trim()).filter(Boolean);
}
function hasMeatlessTag(tags) {
	return tagList(tags).includes("veg");
}
function withMeatlessTag(tags, meatless) {
	const rest = tagList(tags).filter((t) => t !== "veg");
	return (meatless ? [...rest, "veg"] : rest).join(",");
}
//#endregion
export { withMeatlessTag as a, hasMeatlessTag as i, dishImage as n, dishInitials as r, DISH_PHOTOS as t };
