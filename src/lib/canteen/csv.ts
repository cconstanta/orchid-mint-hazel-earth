export type SalesRow = {
  date: string;
  dish: string;
  qty: number;
  price?: number;
};

function looksLikeDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{2}\.\d{2}\.\d{4}$/.test(s);
}

function toIso(s: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return "";
}

export function parseSalesCsv(text: string): { rows: SalesRow[]; errors: string[] } {
  const raw = text.replace(/^\uFEFF/, "").trim();
  const errors: string[] = [];
  if (!raw) return { rows: [], errors: ["Файл пустой"] };
  const first = raw.split(/\r?\n/)[0] ?? "";
  const delim = first.includes(";") ? ";" : first.includes("\t") ? "\t" : ",";
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const cells = (line: string) =>
    line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
  const head = cells(lines[0] ?? "").map((h) => h.toLowerCase());
  const idx = {
    date: head.findIndex((h) => ["date", "дата", "день"].includes(h)),
    dish: head.findIndex((h) =>
      ["dish", "блюдо", "наименование", "название"].includes(h),
    ),
    qty: head.findIndex((h) =>
      ["qty", "количество", "кол-во", "порций", "продано"].includes(h),
    ),
    price: head.findIndex((h) => ["price", "цена"].includes(h)),
  };
  const hasHeader = idx.date >= 0 && idx.dish >= 0 && idx.qty >= 0;
  const start = hasHeader ? 1 : 0;
  const rows: SalesRow[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const cols = cells(lines[i] ?? "");
    const dateRaw = hasHeader ? (cols[idx.date] ?? "") : (cols[0] ?? "");
    const dish = hasHeader ? (cols[idx.dish] ?? "") : (cols[1] ?? "");
    const qtyRaw = hasHeader ? (cols[idx.qty] ?? "") : (cols[2] ?? "");
    const priceRaw = hasHeader
      ? idx.price >= 0
        ? (cols[idx.price] ?? "")
        : ""
      : (cols[3] ?? "");
    const date = toIso(dateRaw);
    const qty = Number.parseInt(qtyRaw.replace(/\s/g, ""), 10);
    const price = priceRaw
      ? Number.parseInt(priceRaw.replace(/\s/g, ""), 10)
      : undefined;
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
      price: price && price > 0 ? price : undefined,
    });
  }
  return { rows, errors };
}
