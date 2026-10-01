import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStaffPin } from "@/components/admin/pin-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { importSales } from "@/lib/canteen/admin";
import { parseSalesCsv, type SalesRow } from "@/lib/canteen/csv";
import { rub } from "@/lib/utils";

export const Route = createFileRoute("/admin/sales")({ component: AdminSales });

function AdminSales() {
  const pin = useStaffPin();
  const qc = useQueryClient();
  const [preview, setPreview] = useState<SalesRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [raw, setRaw] = useState("");

  function applyText(text: string) {
    setRaw(text);
    const parsed = parseSalesCsv(text);
    setPreview(parsed.rows);
    setErrors(parsed.errors);
  }

  const send = useMutation({
    mutationFn: () => importSales({ data: { pin, rows: preview } }),
    onSuccess: (res) => {
      toast.success(`Загружено строк: ${res.imported}`);
      void qc.invalidateQueries({ queryKey: ["report"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-medium">Импорт продаж</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Выгрузка с кассы: дата, блюдо, количество, цена. Повторная загрузка той же
        даты и блюда заменяет строку кассы, онлайн-заказы не трогает.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <label className="inline-flex h-11 cursor-pointer items-center rounded-md border border-border bg-card px-4 text-sm font-medium">
          Выбрать CSV
          <input
            type="file"
            accept=".csv,text/csv,text/plain"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => applyText(String(reader.result ?? ""));
              reader.readAsText(file);
            }}
          />
        </label>
        <Button variant="outline" asChild>
          <a href="/samples/sales-template.csv" download>
            Скачать шаблон
          </a>
        </Button>
      </div>
      <Textarea
        className="mt-4 min-h-40 font-mono text-sm"
        value={raw}
        onChange={(e) => applyText(e.target.value)}
        placeholder={"дата,блюдо,количество,цена\n2026-09-12,Борщ украинский,40,95"}
      />
      {errors.length ? (
        <ul className="mt-3 text-sm text-destructive">
          {errors.slice(0, 6).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
      {preview.length ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-medium">
              Предпросмотр · {preview.length}
            </h2>
            <Button disabled={send.isPending} onClick={() => send.mutate()}>
              Записать в отчёт
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Дата</th>
                  <th className="px-3 py-2 font-medium">Блюдо</th>
                  <th className="px-3 py-2 font-medium">Порц.</th>
                  <th className="px-3 py-2 font-medium">Цена</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 40).map((r, i) => (
                  <tr key={`${r.date}-${r.dish}-${i}`} className="border-t border-border">
                    <td className="px-3 py-2 tabular-nums">{r.date}</td>
                    <td className="px-3 py-2">{r.dish}</td>
                    <td className="px-3 py-2 tabular-nums">{r.qty}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {r.price ? rub(r.price) : "из карточки"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
