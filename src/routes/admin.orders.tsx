import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStaffPin } from "@/components/admin/pin-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listOrders, updateOrderStatus } from "@/lib/canteen/admin";
import { ORDER_STATUS_LABEL } from "@/lib/canteen/types";
import { rub } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const NEXT: Record<string, string | undefined> = {
  paid: "cooking",
  cooking: "ready",
  ready: "picked_up",
};

function AdminOrders() {
  const pin = useStaffPin();
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listOrders({ data: { pin } }),
    enabled: Boolean(pin),
    refetchInterval: 6000,
  });
  const setStatus = useMutation({
    mutationFn: (p: { id: number; status: "paid" | "cooking" | "ready" | "picked_up" | "cancelled" }) =>
      updateOrderStatus({ data: { pin, ...p } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-orders"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-medium">Предзаказы</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Кухня двигает статус. Гость видит тот же код на странице выдачи.
      </p>
      <ul className="mt-6 space-y-3">
        {(list.data ?? []).map((o) => {
          const next = NEXT[o.status];
          return (
            <li key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl tracking-wide">{o.pickup_code}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.guest_label}, {o.group_code} · {o.pickup_slot}
                  </p>
                </div>
                <Badge>{ORDER_STATUS_LABEL[o.status]}</Badge>
              </div>
              <ul className="mt-3 text-sm text-muted-foreground">
                {o.items.map((it) => (
                  <li key={it.id}>
                    {it.dish_name} × {it.qty}
                  </li>
                ))}
              </ul>
              {o.note ? (
                <p className="mt-2 text-sm">Заметка: {o.note}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium tabular-nums">{rub(o.total)}</p>
                <div className="flex flex-wrap gap-2">
                  {next ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        setStatus.mutate({
                          id: o.id,
                          status: next as "cooking" | "ready" | "picked_up",
                        })
                      }
                    >
                      {ORDER_STATUS_LABEL[next]}
                    </Button>
                  ) : null}
                  {o.status !== "cancelled" && o.status !== "picked_up" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatus.mutate({ id: o.id, status: "cancelled" })}
                    >
                      Отменить
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
