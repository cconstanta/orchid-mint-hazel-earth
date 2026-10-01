import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStaffPin } from "@/components/admin/pin-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  applyWeekdayPlan,
  getAdminCatalog,
  saveWeekdayPlan,
  setDishFlags,
  upsertDish,
} from "@/lib/canteen/admin";
import {
  DISH_PHOTOS,
  dishImage,
  hasMeatlessTag,
  withMeatlessTag,
} from "@/lib/canteen/dish-media";
import type { AdminDish } from "@/lib/canteen/types";
import { WEEKDAYS } from "@/lib/canteen/types";
import { cn, isoWeekday, rub } from "@/lib/utils";

export const Route = createFileRoute("/admin/menu")({ component: AdminMenu });

function AdminMenu() {
  const pin = useStaffPin();
  const qc = useQueryClient();
  const cat = useQuery({
    queryKey: ["admin-catalog"],
    queryFn: () => getAdminCatalog({ data: { pin } }),
    enabled: Boolean(pin),
  });
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<AdminDish> | null>(null);
  const [planDay, setPlanDay] = useState(isoWeekday() === 7 ? 1 : isoWeekday());

  const dishes = cat.data?.dishes ?? [];
  const categories = cat.data?.categories ?? [];
  const board = dishes.filter((d) => d.on_board);
  const catalog = useMemo(
    () =>
      dishes.filter((d) =>
        `${d.name} ${d.description}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [dishes, q],
  );

  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ["admin-catalog"] });
    void qc.invalidateQueries({ queryKey: ["menu"] });
  };

  const flags = useMutation({
    mutationFn: (p: { id: number; on_board?: boolean; is_available?: boolean; featured?: boolean }) =>
      setDishFlags({ data: { pin, ...p } }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });
  const apply = useMutation({
    mutationFn: (weekday: number) => applyWeekdayPlan({ data: { pin, weekday } }),
    onSuccess: () => {
      toast.success("Линия на сайте обновлена");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const savePlan = useMutation({
    mutationFn: () =>
      saveWeekdayPlan({
        data: {
          pin,
          weekday: planDay,
          dish_ids: board.map((d) => d.id),
        },
      }),
    onSuccess: () => {
      toast.success(`План ${WEEKDAYS.find((w) => w.id === planDay)?.full} сохранён`);
      invalidate();
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium">Конструктор линии</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Что стоит на доске — то сразу видно гостям на главной, без входа.
          </p>
        </div>
        <Button onClick={() => setEditing({ category_id: categories[0]?.id, price: 80, cost: 30, weight_g: 200, calories: 0, protein: 0, fat: 0, carbs: 0, tags: [], image_key: "", description: "", name: "" })}>
          Новое блюдо
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {WEEKDAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setPlanDay(d.id)}
            className={cn(
              "h-10 rounded-full border px-3 text-sm font-medium",
              planDay === d.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            {d.short}
          </button>
        ))}
        <Button variant="outline" size="sm" onClick={() => apply.mutate(planDay)}>
          Поставить план дня на линию
        </Button>
        <Button variant="ghost" size="sm" onClick={() => savePlan.mutate()}>
          Запомнить текущую доску как план дня
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-medium">Картотека</h2>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск"
              className="max-w-48"
            />
          </div>
          <ul className="mt-3 max-h-[70vh] space-y-2 overflow-auto pr-1">
            {catalog.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.category_name} · {rub(d.price)} · себест. {rub(d.cost)}
                    {hasMeatlessTag(d.tags) ? " · без мяса" : ""}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditing(d)}>
                  Карточка
                </Button>
                <Button
                  size="sm"
                  variant={d.on_board ? "secondary" : "default"}
                  onClick={() => flags.mutate({ id: d.id, on_board: !d.on_board })}
                >
                  {d.on_board ? "Снять" : "На доску"}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-xl font-medium">
            Сегодня на линии · {board.length}
          </h2>
          <ul className="mt-3 space-y-2">
            {board.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                Доска пуста. Добавьте блюда слева или примените план дня.
              </li>
            ) : (
              board.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {rub(d.price)} · {d.weight_g} г
                      {d.portions_left != null ? ` · остаток ${d.portions_left}` : ""}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs">
                    <Checkbox
                      checked={d.featured}
                      onCheckedChange={(v) =>
                        flags.mutate({ id: d.id, featured: Boolean(v) })
                      }
                    />
                    витрина
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <Checkbox
                      checked={d.is_available}
                      onCheckedChange={(v) =>
                        flags.mutate({ id: d.id, is_available: Boolean(v) })
                      }
                    />
                    в продаже
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => flags.mutate({ id: d.id, on_board: false })}
                  >
                    Убрать
                  </Button>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <DishDialog
        open={Boolean(editing)}
        dish={editing}
        categories={categories}
        pin={pin}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          invalidate();
        }}
      />
    </div>
  );
}

function DishDialog({
  open,
  dish,
  categories,
  pin,
  onClose,
  onSaved,
}: {
  open: boolean;
  dish: Partial<AdminDish> | null;
  categories: Array<{ id: number; name: string }>;
  pin: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        {open && dish ? (
          <DishForm
            key={dish.id ?? "new"}
            initial={dish}
            categories={categories}
            pin={pin}
            onSaved={onSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function DishForm({
  initial,
  categories,
  pin,
  onSaved,
}: {
  initial: Partial<AdminDish>;
  categories: Array<{ id: number; name: string }>;
  pin: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [categoryId, setCategoryId] = useState(initial.category_id ?? categories[0]?.id ?? 0);
  const [description, setDescription] = useState(initial.description ?? "");
  const [price, setPrice] = useState(initial.price ?? 0);
  const [cost, setCost] = useState(initial.cost ?? 0);
  const [weight, setWeight] = useState(initial.weight_g ?? 0);
  const [calories, setCalories] = useState(initial.calories ?? 0);
  const [protein, setProtein] = useState(initial.protein ?? 0);
  const [fat, setFat] = useState(initial.fat ?? 0);
  const [carbs, setCarbs] = useState(initial.carbs ?? 0);
  const [meatless, setMeatless] = useState(hasMeatlessTag(initial.tags));
  const [imageKey, setImageKey] = useState(
    DISH_PHOTOS.some((p) => p.key === initial.image_key) ? (initial.image_key ?? "") : "",
  );
  const [limit, setLimit] = useState(
    initial.portion_limit == null ? "" : String(initial.portion_limit),
  );

  const save = useMutation({
    mutationFn: () =>
      upsertDish({
        data: {
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
          portion_limit: limit === "" ? null : Number(limit),
        },
      }),
    onSuccess: () => {
      toast.success("Карточка сохранена");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initial.id ? "Карточка блюда" : "Новое блюдо"}</DialogTitle>
      </DialogHeader>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid gap-1.5">
          <Label>Название</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label>Категория</Label>
          <select
            className="flex h-11 rounded-md border border-input bg-background px-3 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label>Описание</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label>Цена, ₽</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Себестоимость, ₽</Label>
            <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Выход, г</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Ккал</Label>
            <Input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Белки</Label>
            <Input type="number" value={protein} onChange={(e) => setProtein(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Жиры</Label>
            <Input type="number" value={fat} onChange={(e) => setFat(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Углеводы</Label>
            <Input type="number" value={carbs} onChange={(e) => setCarbs(Number(e.target.value))} />
          </div>
          <div className="grid gap-1.5">
            <Label>Лимит порций (пусто = без)</Label>
            <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
          </div>
        </div>
        <label className="flex items-start gap-3 rounded-md border border-border bg-background px-3 py-3">
          <Checkbox
            checked={meatless}
            onCheckedChange={(v) => setMeatless(Boolean(v))}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium">Без мяса</span>
            <span className="block text-xs text-muted-foreground">
              Гости увидят метку и найдут блюдо в фильтре «Без мяса»
            </span>
          </span>
        </label>
        <div className="grid gap-1.5">
          <Label>Фото на карточке</Label>
          <p className="text-xs text-muted-foreground">
            Выберите готовый снимок. Если не подходит — оставьте «Без фото».
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setImageKey("")}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center rounded-md border px-1 py-2 text-center text-xs font-medium",
                imageKey === ""
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              Без фото
            </button>
            {DISH_PHOTOS.map((photo) => {
              const src = dishImage(photo.key);
              const selected = imageKey === photo.key;
              return (
                <button
                  key={photo.key}
                  type="button"
                  onClick={() => setImageKey(photo.key)}
                  className={cn(
                    "overflow-hidden rounded-md border text-left",
                    selected ? "border-primary ring-2 ring-primary/30" : "border-border",
                  )}
                >
                  {src ? (
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  ) : null}
                  <span
                    className={cn(
                      "block truncate px-1 py-1 text-center text-xs font-medium",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {photo.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <Button type="submit" disabled={save.isPending} className="sticky bottom-0">
          Сохранить
        </Button>
      </form>
    </>
  );
}
