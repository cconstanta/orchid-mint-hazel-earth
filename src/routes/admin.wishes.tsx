import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStaffPin } from "@/components/admin/pin-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listWishesAdmin, setWishStatus } from "@/lib/canteen/admin";
import { WISH_STATUS_LABEL } from "@/lib/canteen/types";

export const Route = createFileRoute("/admin/wishes")({ component: AdminWishes });

const STATUSES = ["new", "planned", "done", "declined"] as const;

function AdminWishes() {
  const pin = useStaffPin();
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["admin-wishes"],
    queryFn: () => listWishesAdmin({ data: { pin } }),
    enabled: Boolean(pin),
  });
  const set = useMutation({
    mutationFn: (p: { id: number; status: (typeof STATUSES)[number] }) =>
      setWishStatus({ data: { pin, ...p } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-wishes"] });
      void qc.invalidateQueries({ queryKey: ["wishes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-medium">Пожелания гостей</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Статус сразу виден на публичной доске.
      </p>
      <ul className="mt-6 space-y-3">
        {(list.data ?? []).map((w) => (
          <li key={w.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{w.alias}</p>
              <Badge variant="muted">{WISH_STATUS_LABEL[w.status]}</Badge>
              <span className="text-xs text-muted-foreground tabular-nums">
                {w.votes} голос.
              </span>
            </div>
            <p className="mt-2 text-sm">{w.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={w.status === s ? "default" : "outline"}
                  onClick={() => set.mutate({ id: w.id, status: s })}
                >
                  {WISH_STATUS_LABEL[s]}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
