import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStaffPin } from "@/components/admin/pin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getReports } from "@/lib/canteen/admin";
import { formatDateShort, rub, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

function shiftDays(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

const PIE = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function AdminReports() {
  const pin = useStaffPin();
  const [from, setFrom] = useState(shiftDays(todayISO(), -30));
  const [to, setTo] = useState(todayISO());
  const report = useQuery({
    queryKey: ["report", from, to],
    queryFn: () => getReports({ data: { pin, from, to } }),
    enabled: Boolean(pin),
  });
  const r = report.data;
  const days = useMemo(
    () =>
      (r?.days ?? []).map((d) => ({
        ...d,
        label: formatDateShort(d.sale_date),
      })),
    [r],
  );

  function download() {
    if (!r) return;
    const header = "дата,выручка,себестоимость,прибыль,порций";
    const body = r.days
      .map((d) => `${d.sale_date},${d.revenue},${d.cost},${d.profit},${d.portions}`)
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peremena-${r.from}-${r.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium">Выручка и прибыль</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Касса (импорт) плюс предоплаченные заказы. Прибыль = выручка − себестоимость
        из карточек блюд.
      </p>
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <Label>С</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>По</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button variant="outline" onClick={download} disabled={!r}>
          Скачать CSV
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { k: "Выручка", v: rub(r?.revenue ?? 0) },
          { k: "Себестоимость", v: rub(r?.cost ?? 0) },
          { k: "Прибыль", v: rub(r?.profit ?? 0) },
          { k: "Порций / онлайн", v: `${r?.portions ?? 0} / ${r?.orders_online ?? 0}` },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{c.k}</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{c.v}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-4">
        <h2 className="font-display text-xl font-medium">По дням</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={days}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
              <Tooltip formatter={(v: number) => rub(v)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Выручка" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cost" name="Себест." stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" name="Прибыль" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-xl font-medium">Топ блюд</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(r?.dishes ?? []).slice(0, 8)} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="dish_name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => rub(v)} />
                <Bar dataKey="revenue" name="Выручка" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-xl font-medium">По категориям</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={r?.categories ?? []}
                  dataKey="revenue"
                  nameKey="category"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {(r?.categories ?? []).map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => rub(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Блюдо</th>
              <th className="px-3 py-2 font-medium">Порц.</th>
              <th className="px-3 py-2 font-medium">Выручка</th>
              <th className="px-3 py-2 font-medium">Себест.</th>
              <th className="px-3 py-2 font-medium">Прибыль</th>
            </tr>
          </thead>
          <tbody>
            {(r?.dishes ?? []).map((d) => (
              <tr key={d.dish_name} className="border-t border-border">
                <td className="px-3 py-2">{d.dish_name}</td>
                <td className="px-3 py-2 tabular-nums">{d.qty}</td>
                <td className="px-3 py-2 tabular-nums">{rub(d.revenue)}</td>
                <td className="px-3 py-2 tabular-nums">{rub(d.cost)}</td>
                <td className="px-3 py-2 tabular-nums">{rub(d.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
