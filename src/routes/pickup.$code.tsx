import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderByCode } from "@/lib/canteen/public";
import { ORDER_STATUS_LABEL } from "@/lib/canteen/types";
import { rub } from "@/lib/utils";

export const Route = createFileRoute("/pickup/$code")({ component: PickupPage });

function PickupPage() {
  const { code } = Route.useParams();
  const q = useQuery({
    queryKey: ["order", code],
    queryFn: () => getOrderByCode({ data: { code } }),
    refetchInterval: 8000,
  });
  const order = q.data;

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg px-4 py-12">
        <p className="text-sm text-muted-foreground">Код выдачи</p>
        <h1 className="font-display text-4xl font-medium tracking-wide">
          {code.toUpperCase()}
        </h1>
        {q.isLoading ? (
          <p className="mt-6 text-muted-foreground">Ищем заказ…</p>
        ) : !order ? (
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <p>Заказ с таким кодом не найден.</p>
            <Button className="mt-4" asChild>
              <Link to="/order">К оформлению</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-3">
              <Badge>{ORDER_STATUS_LABEL[order.status] ?? order.status}</Badge>
              <p className="text-sm text-muted-foreground">{order.pickup_slot}</p>
            </div>
            <p className="mt-4 font-medium">
              {order.guest_label}, {order.group_code}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between gap-3 tabular-nums">
                  <span>
                    {it.dish_name} × {it.qty}
                  </span>
                  <span>{rub(it.unit_price * it.qty)}</span>
                </li>
              ))}
            </ul>
            {order.discount ? (
              <p className="mt-3 flex justify-between text-sm tabular-nums">
                <span className="text-muted-foreground">Комплекс</span>
                <span>− {rub(order.discount)}</span>
              </p>
            ) : null}
            <p className="mt-4 flex justify-between border-t border-border pt-3 font-medium tabular-nums">
              <span>Оплачено</span>
              <span>{rub(order.total)}</span>
            </p>
            {order.note ? (
              <p className="mt-3 text-sm text-muted-foreground">Заметка: {order.note}</p>
            ) : null}
            <p className="mt-6 text-sm text-muted-foreground">
              Назовите код на раздаче. Страница обновляется сама — когда статус
              «Можно забирать», подойдите к окну.
            </p>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
