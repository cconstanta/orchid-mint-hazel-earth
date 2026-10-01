import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addAnnouncement,
  getReports,
  listAnnouncementsAdmin,
  listOrders,
  saveSettings,
  setAnnouncementPublished,
} from "@/lib/canteen/admin";
import { getPublicInfo } from "@/lib/canteen/public";
import { useStaffPin } from "@/components/admin/pin-context";
import { ORDER_STATUS_LABEL } from "@/lib/canteen/types";
import { rub, todayISO } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({ component: AdminHome });

function shiftDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function AdminHome() {
  const pin = useStaffPin();
  const from = shiftDays(todayISO(), -30);
  const to = todayISO();
  const report = useQuery({
    queryKey: ["report", from, to],
    queryFn: () => getReports({ data: { pin, from, to } }),
    enabled: Boolean(pin),
  });
  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listOrders({ data: { pin } }),
    enabled: Boolean(pin),
  });
  const active = (orders.data ?? []).filter((o) =>
    ["paid", "cooking", "ready"].includes(o.status),
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-medium">Сводка смены</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Выручка за 30 дней считается по кассовому импорту и предоплаченным заказам.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Выручка", v: report.isLoading ? "…" : rub(report.data?.revenue ?? 0) },
          { k: "Себестоимость", v: report.isLoading ? "…" : rub(report.data?.cost ?? 0) },
          { k: "Прибыль", v: report.isLoading ? "…" : rub(report.data?.profit ?? 0) },
          { k: "Порций", v: report.isLoading ? "…" : String(report.data?.portions ?? 0) },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{c.k}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{c.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-medium">Очередь выдачи</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">Все заказы</Link>
            </Button>
          </div>
          <ul className="mt-3 space-y-2">
            {active.length === 0 ? (
              <li className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                Живых предзаказов нет.
              </li>
            ) : (
              active.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span className="font-medium tracking-wide">{o.pickup_code}</span>
                  <span className="text-muted-foreground">
                    {o.guest_label} · {o.pickup_slot}
                  </span>
                  <span>{ORDER_STATUS_LABEL[o.status]}</span>
                </li>
              ))
            )}
          </ul>
        </section>
        <NewsEditor pin={pin} />
      </div>
      <SettingsEditor pin={pin} />
    </div>
  );
}

function NewsEditor({ pin }: { pin: string }) {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["admin-news"],
    queryFn: () => listAnnouncementsAdmin({ data: { pin } }),
    enabled: Boolean(pin),
  });
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const add = useMutation({
    mutationFn: () => addAnnouncement({ data: { pin, title, body } }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      void qc.invalidateQueries({ queryKey: ["admin-news"] });
      void qc.invalidateQueries({ queryKey: ["info"] });
      toast.success("Объявление на сайте");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const pub = useMutation({
    mutationFn: (p: { id: number; is_published: boolean }) =>
      setAnnouncementPublished({ data: { pin, ...p } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-news"] });
      void qc.invalidateQueries({ queryKey: ["info"] });
    },
  });

  return (
    <section>
      <h2 className="font-display text-xl font-medium">Объявления на главной</h2>
      <form
        className="mt-3 grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          required
        />
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Текст"
          required
        />
        <Button type="submit" disabled={add.isPending}>
          Опубликовать
        </Button>
      </form>
      <ul className="mt-4 space-y-2">
        {(list.data ?? []).map((a) => (
          <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
            <span>
              <span className="font-medium">{a.title}</span>
              <span className="block text-muted-foreground">{a.body}</span>
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                pub.mutate({ id: a.id, is_published: !a.is_published })
              }
            >
              {a.is_published ? "Скрыть" : "Показать"}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SettingsEditor({ pin }: { pin: string }) {
  const qc = useQueryClient();
  const info = useQuery({ queryKey: ["info"], queryFn: () => getPublicInfo() });
  const [form, setForm] = useState<null | {
    college_name: string;
    address: string;
    phone: string;
    about: string;
    pickup_rules: string;
    director: string;
    hours_text: string;
  }>(null);
  const i = info.data?.info;
  const current =
    form ??
    (i
      ? {
          college_name: i.college_name,
          address: i.address,
          phone: i.phone,
          about: i.about,
          pickup_rules: i.pickup_rules,
          director: i.director,
          hours_text: i.hours
            .map((h) => `${h.days}: ${h.line}`)
            .join("\n"),
        }
      : null);
  const save = useMutation({
    mutationFn: () => saveSettings({ data: { pin, ...current! } }),
    onSuccess: () => {
      toast.success("Реквизиты обновлены на сайте");
      void qc.invalidateQueries({ queryKey: ["info"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (!current) return null;
  const set = (k: keyof typeof current, v: string) =>
    setForm({ ...current, [k]: v });

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-medium">Реквизиты и график</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Меняется вкладка «Столовая» без перезапуска.
      </p>
      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid gap-1.5">
          <Label>Колледж</Label>
          <Input
            value={current.college_name}
            onChange={(e) => set("college_name", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Телефон</Label>
          <Input value={current.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label>Адрес</Label>
          <Input
            value={current.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label>О столовой</Label>
          <Textarea
            value={current.about}
            onChange={(e) => set("about", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5 md:col-span-2">
          <Label>Правила предоплаты</Label>
          <Textarea
            value={current.pickup_rules}
            onChange={(e) => set("pickup_rules", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Заведующая</Label>
          <Input
            value={current.director}
            onChange={(e) => set("director", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label>График, по строке «дни: часы»</Label>
          <Textarea
            value={current.hours_text}
            onChange={(e) => set("hours_text", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={save.isPending}>
            Сохранить на сайт
          </Button>
        </div>
      </form>
    </section>
  );
}
