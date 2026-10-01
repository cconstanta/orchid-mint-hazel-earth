export const DISH_PHOTOS = [
  { key: "borscht", label: "Борщ" },
  { key: "chicken-soup", label: "Куриный суп" },
  { key: "cutlet", label: "Котлета" },
  { key: "goulash", label: "Гуляш" },
  { key: "fish", label: "Рыба в кляре" },
  { key: "plov", label: "Плов" },
  { key: "olivier", label: "Оливье" },
  { key: "pirozhok", label: "Пирожок" },
  { key: "syrniki", label: "Сырники" },
  { key: "cocoa", label: "Какао" },
  { key: "combo", label: "Комплекс" },
] as const;

export type DishPhotoKey = (typeof DISH_PHOTOS)[number]["key"];

const KNOWN = new Set<string>(DISH_PHOTOS.map((p) => p.key));

export function dishImage(key: string) {
  if (key && KNOWN.has(key)) return `/food/${key}.jpg`;
  return null;
}

export function dishPhotoLabel(key: string) {
  return DISH_PHOTOS.find((p) => p.key === key)?.label ?? "";
}

export function dishInitials(name: string) {
  const parts = name.replace(/[«»"]/g, "").split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "Б";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export function tagList(tags: string | string[] | undefined) {
  const raw = Array.isArray(tags) ? tags : String(tags ?? "").split(",");
  return raw.map((t) => t.trim()).filter(Boolean);
}

export function hasMeatlessTag(tags: string | string[] | undefined) {
  return tagList(tags).includes("veg");
}

export function withMeatlessTag(tags: string | string[] | undefined, meatless: boolean) {
  const rest = tagList(tags).filter((t) => t !== "veg");
  return (meatless ? [...rest, "veg"] : rest).join(",");
}
