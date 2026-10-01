import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { DishPhoto } from "@/components/menu/dish-photo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  cartDiscount,
  cartSubtotal,
  cartTotal,
  comboCount,
  useCart,
} from "@/lib/canteen/cart";
import { placeOrder } from "@/lib/canteen/public";
import { COMBO_DISCOUNT, PICKUP_SLOTS } from "@/lib/canteen/types";
import { rub } from "@/lib/utils";

export const Route = createFileRoute("/order")({ component: OrderPage });

function OrderPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [guest, setGuest] = useState("");
  const [group, setGroup] = useState("");
  const [slot, setSlot] = useState(PICKUP_SLOTS[2] ?? PICKUP_SLOTS[0]);
  const [note, setNote] = useState("");
  const [lookup, setLookup] = useState("");
  const subtotal = cartSubtotal(items);
  const discount = cartDiscount(items);
  const total = cartTotal(items);
  const combos = comboCount(items);

  const pay = useMutation({
    mutationFn: () =>
      placeOrder({
        data: {
          guest_label: guest,
          group_code: group,
          pickup_slot: slot,
          note,
          items: items.map((i) => ({ dishId: i.dishId, qty: i.qty })),
        },
      }),
    onSuccess: (res) => {
      clear();
      void qc.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Оплачено. Заказ принят.");
      void navigate({ to: "/pickup/$code", params: { code: res.pickup_code } });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <h1 className="font-display text-4xl font-medium">Предзаказ</h1>
          <p className="mt-2 text-muted-foreground">
            Полная предоплата. На линии называете код — без кассы.
          </p>

          {items.length === 0 ? (
            <div className="mt-8 rounded-xl border border-border bg-card p-8">
              <p className="text-muted-foreground">Поднос пуст.</p>
              <Button className="mt-4" asChild>
                <Link to="/menu">Открыть меню</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
              {items.map((item) => (
                <li key={item.dishId} className="flex items-center gap-3 p-4">
                  <div className="size-16 overflow-hidden rounded-md bg-muted">
                    <DishPhoto imageKey={item.image_key} name={item.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {rub(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-9"
                      onClick={() => setQty(item.dishId, item.qty - 1)}
                    >
                      <Minus />
                    </Button>
                    <span className="w-8 text-center tabular-nums">{item.qty}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-9"
                      onClick={() => setQty(item.dishId, item.qty + 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-9"
                    onClick={() => remove(item.dishId)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <form
            className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!items.length) return;
              pay.mutate();
            }}
          >
            <h2 className="font-display text-xl font-medium">Получатель и оплата</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="guest">Как к вам обратиться</Label>
                <Input
                  id="guest"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Алексей"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="group">Группа</Label>
                <Input
                  id="group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  required
                  minLength={2}
                  placeholder="ИС-21"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="slot">Окно выдачи</Label>
              <select
                id="slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {PICKUP_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="note">Комментарий для раздачи</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={160}
                placeholder="Без хлеба, компот в стакане"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Учебная оплата: средства не списываются с карты. Нажимаете
              «Оплатить» — заказ сразу считается предоплаченным.
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={!items.length || pay.isPending}
            >
              {pay.isPending ? "Оплата…" : `Оплатить ${rub(total)}`}
            </Button>
          </form>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-medium">Итого</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between tabular-nums">
              <dt className="text-muted-foreground">Позиции</dt>
              <dd>{rub(subtotal)}</dd>
            </div>
            <div className="flex justify-between tabular-nums">
              <dt className="text-muted-foreground">
                Комплекс {combos ? `× ${combos}` : ""}
              </dt>
              <dd>{discount ? `− ${rub(discount)}` : "—"}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium tabular-nums">
              <dt>К оплате</dt>
              <dd>{rub(total)}</dd>
            </div>
          </dl>
          {combos ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Скидка {rub(COMBO_DISCOUNT)} за каждый набор первое+второе+напиток.
            </p>
          ) : null}

          <form
            className="mt-8 border-t border-border pt-5"
            onSubmit={(e) => {
              e.preventDefault();
              const code = lookup.trim().toUpperCase();
              if (code.length < 4) return;
              void navigate({ to: "/pickup/$code", params: { code } });
            }}
          >
            <Label htmlFor="lookup">Уже заказывали? Код выдачи</Label>
            <div className="mt-2 flex gap-2">
              <Input
                id="lookup"
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                placeholder="ПМ2401"
                className="uppercase"
              />
              <Button type="submit" variant="outline">
                Найти
              </Button>
            </div>
          </form>
        </aside>
      </div>
    </SiteShell>
  );
}
