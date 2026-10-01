import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createWish, getPublicWishes, voteWish } from "@/lib/canteen/public";
import { WISH_STATUS_LABEL } from "@/lib/canteen/types";

export const Route = createFileRoute("/wishes")({ component: WishesPage });

function WishesPage() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["wishes"], queryFn: () => getPublicWishes() });
  const [alias, setAlias] = useState("");
  const [body, setBody] = useState("");
  const send = useMutation({
    mutationFn: () => createWish({ data: { alias, body } }),
    onSuccess: () => {
      setBody("");
      toast.success("Пожелание ушло заведующей");
      void qc.invalidateQueries({ queryKey: ["wishes"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
  const vote = useMutation({
    mutationFn: (id: number) => voteWish({ data: { id } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["wishes"] }),
  });

  return (
    <SiteShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[20rem_1fr]">
        <div>
          <h1 className="font-display text-4xl font-medium">Пожелания</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Что добавить в линию, что убрать, какие комплексы сделать постоянными.
            Голос без регистрации — пишите псевдоним и группу, если хотите.
          </p>
          <form
            className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-5"
            onSubmit={(e) => {
              e.preventDefault();
              send.mutate();
            }}
          >
            <div className="grid gap-1.5">
              <Label htmlFor="alias">Псевдоним</Label>
              <Input
                id="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                required
                minLength={2}
                placeholder="Ира, ИС-22"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="wish">Идея</Label>
              <Textarea
                id="wish"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                minLength={8}
                placeholder="Например: гренки к борщу по вторникам"
              />
            </div>
            <Button type="submit" disabled={send.isPending}>
              Отправить
            </Button>
          </form>
        </div>
        <ul className="space-y-3">
          {(list.data ?? []).map((w) => (
            <li
              key={w.id}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <button
                type="button"
                className="flex h-16 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-border hover:bg-muted"
                onClick={() => vote.mutate(w.id)}
                aria-label="Поддержать"
              >
                <ArrowUp className="size-4" />
                <span className="text-sm font-medium tabular-nums">{w.votes}</span>
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{w.alias}</p>
                  <Badge variant="muted">
                    {WISH_STATUS_LABEL[w.status] ?? w.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm">{w.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
