import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { getPublicInfo } from "@/lib/canteen/public";

export const Route = createFileRoute("/info")({ component: InfoPage });

function InfoPage() {
  const q = useQuery({ queryKey: ["info"], queryFn: () => getPublicInfo() });
  const info = q.data?.info;

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-muted-foreground">{info?.college_name}</p>
        <h1 className="font-display text-4xl font-medium">
          {info?.canteen_name ?? "Столовая"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{info?.about}</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-5">
            <MapPin className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl font-medium">Адрес</h2>
            <p className="mt-2 text-sm">{info?.address}</p>
            <p className="mt-2 text-sm text-muted-foreground">{info?.director}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <Phone className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl font-medium">Стойка</h2>
            <p className="mt-2 text-sm">{info?.phone}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Вопросы по предзаказу — в рабочие часы линии.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <Clock3 className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl font-medium">График</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(info?.hours ?? []).map((h) => (
                <li key={h.days} className="flex justify-between gap-3">
                  <span>{h.days}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {h.line}
                    {h.kitchen ? ` · кухня ${h.kitchen}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-xl font-medium">Предоплата</h2>
            <p className="mt-2 text-sm text-muted-foreground">{info?.pickup_rules}</p>
          </article>
        </div>

        <section className="mt-10 rounded-xl border border-border bg-card p-5 md:p-8">
          <h2 className="font-display text-2xl font-medium">Как устроена линия</h2>
          <div className="mt-4 grid gap-6 text-sm text-muted-foreground md:grid-cols-3">
            <p>
              Меню на день собирает заведующая в конструкторе. Как только блюдо
              ставят на доску, оно появляется на главной и в разделе «Меню» — вход
              для этого не нужен.
            </p>
            <p>
              Наличные и карта — на кассе линии. Предзаказ в приложении всегда с
              полной предоплатой: так кухня видит загрузку по слотам и не готовит
              вхолостую.
            </p>
            <p>
              Продажи с кассы загружают файлом (CSV). Графики выручки и прибыли
              считают себестоимость каждого блюда, заданную в карточке.
            </p>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
