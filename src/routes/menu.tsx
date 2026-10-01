import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { DishCard } from "@/components/menu/dish-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicMenu } from "@/lib/canteen/public";
import { COMBO_DISCOUNT, type PublicDish } from "@/lib/canteen/types";
import { useCart } from "@/lib/canteen/cart";
import { cn, formatDateRu, rub } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/menu")({ component: MenuPage });

function MenuPage() {
  const menu = useQuery({ queryKey: ["menu"], queryFn: () => getPublicMenu() });
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const dishes = menu.data?.dishes ?? [];
  const categories = menu.data?.categories ?? [];

  const visible = useMemo(() => {
    return dishes.filter((d) => {
      if (filter === "veg") return d.tags.includes("veg");
      if (filter !== "all" && d.category_slug !== filter) return false;
      if (q.trim() && !`${d.name} ${d.description}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [dishes, filter, q]);

  const grouped = categories
    .map((c) => ({
      ...c,
      items: visible.filter((d) => d.category_id === c.id),
    }))
    .filter((c) => c.items.length);

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-muted-foreground">
          {menu.data ? formatDateRu(menu.data.date) : "…"}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-medium">Меню на сегодня</h1>
          <Button asChild>
            <Link to="/order">К оформлению</Link>
          </Button>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Карта линии обновляется из админки сразу. Комплекс из первого, второго и
          напитка — скидка {rub(COMBO_DISCOUNT)} при оплате.
        </p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Всё" },
              { id: "veg", label: "Без мяса" },
              ...categories.map((c) => ({ id: c.slug, label: c.name })),
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "h-10 rounded-full border px-3 text-sm font-medium",
                  filter === chip.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Найти блюдо"
            className="md:ml-auto md:max-w-xs"
          />
        </div>

        {menu.isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {menu.data?.closed ? (
              <p className="mt-6 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                По графику воскресенье — выходной. Ниже меню ближайшего рабочего
                дня, предзаказ можно оформить.
              </p>
            ) : null}
            <ComboBuilder dishes={dishes} />
            {grouped.map((g) => (
              <section key={g.id} className="mt-12">
                <h2 className="font-display text-2xl font-medium">{g.name}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((d) => (
                    <DishCard key={d.id} dish={d} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </SiteShell>
  );
}

function ComboBuilder({ dishes }: { dishes: PublicDish[] }) {
  const add = useCart((s) => s.add);
  const [soup, setSoup] = useState<number | "">("");
  const [main, setMain] = useState<number | "">("");
  const [drink, setDrink] = useState<number | "">("");
  const soups = dishes.filter((d) => d.category_slug === "soups");
  const mains = dishes.filter((d) => d.category_slug === "mains");
  const drinks = dishes.filter((d) => d.category_slug === "drinks");
  if (!soups.length || !mains.length || !drinks.length) return null;
  const picked = [soup, main, drink]
    .map((id) => dishes.find((d) => d.id === id))
    .filter(Boolean) as PublicDish[];
  const sum = picked.reduce((s, d) => s + d.price, 0);
  const ready = picked.length === 3;

  return (
    <section className="mt-10 rounded-xl border border-border bg-card p-5 md:p-6">
      <h2 className="font-display text-2xl font-medium">Соберите комплекс</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Первое + второе + напиток. Скидка {rub(COMBO_DISCOUNT)} применится на
        оплате.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          { label: "Первое", list: soups, value: soup, set: setSoup },
          { label: "Второе", list: mains, value: main, set: setMain },
          { label: "Напиток", list: drinks, value: drink, set: setDrink },
        ].map((col) => (
          <label key={col.label} className="block text-sm font-medium">
            {col.label}
            <select
              value={col.value}
              onChange={(e) =>
                col.set(e.target.value ? Number(e.target.value) : "")
              }
              className="mt-1.5 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
            >
              <option value="">Выберите</option>
              {col.list.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.price} ₽
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm tabular-nums">
          {ready ? (
            <>
              <span className="text-muted-foreground line-through">{rub(sum)}</span>
              <span className="ml-2 font-medium">{rub(sum - COMBO_DISCOUNT)}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Выберите три позиции</span>
          )}
        </p>
        <Button
          disabled={!ready}
          onClick={() => {
            for (const d of picked) {
              add({
                dishId: d.id,
                name: d.name,
                price: d.price,
                categorySlug: d.category_slug,
                image_key: d.image_key,
              });
            }
            toast.success("Комплекс в подносе");
            setSoup("");
            setMain("");
            setDrink("");
          }}
        >
          Добавить комплекс
        </Button>
      </div>
    </section>
  );
}
