import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, MapPin, Ticket, Wallet } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { DishCard } from "@/components/menu/dish-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicInfo, getPublicMenu } from "@/lib/canteen/public";
import { formatDateRu } from "@/lib/utils";
import { WEEKDAYS } from "@/lib/canteen/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const menu = useQuery({ queryKey: ["menu"], queryFn: () => getPublicMenu() });
  const info = useQuery({ queryKey: ["info"], queryFn: () => getPublicInfo() });
  const featured = (menu.data?.dishes ?? []).filter((d) => d.featured).slice(0, 4);
  const fallback = (menu.data?.dishes ?? []).slice(0, 4);
  const show = featured.length ? featured : fallback;
  const weekday = WEEKDAYS.find((w) => w.id === menu.data?.weekday);
  const closed = menu.data?.closed;

  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden">
        <img
          src="/food/hero.jpg"
          alt="Линия раздачи столовой"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:py-24">
          <p className="text-sm tracking-wide text-primary-foreground/80 uppercase">
            ГБПОУ «Политех-колледж №12»
          </p>
          <h1 className="max-w-xl font-display text-4xl font-medium text-primary-foreground md:text-6xl">
            Обед без очереди — на перемене и после пары
          </h1>
          <p className="max-w-lg text-base text-primary-foreground/85 md:text-lg">
            Соберите меню на сегодня, оплатите заранее и заберите по коду. Линия
            раздачи открыта, карта в приложении обновляется сразу из админки.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/menu">
                Меню на сегодня
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
              asChild
            >
              <Link to="/order">Оформить предзаказ</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Сегодня</p>
              <p className="text-sm text-muted-foreground">
                {closed
                  ? "Воскресенье · меню ближайшего дня"
                  : `${weekday?.full ?? "Будни"} · линия 08:00–16:00`}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Адрес</p>
              <p className="text-sm text-muted-foreground">
                ул. Учебная, 12, 1 этаж
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Ticket className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Предзаказ</p>
              <p className="text-sm text-muted-foreground">
                Полная предоплата, выдача по коду
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {menu.data ? formatDateRu(menu.data.date) : "Сегодня"}
            </p>
            <h2 className="font-display text-3xl font-medium">На линии сейчас</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/menu">Всё меню</Link>
          </Button>
        </div>
        {menu.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {show.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl font-medium">Как заказать заранее</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Ticket,
                n: "01",
                t: "Соберите поднос",
                d: "Первое, второе и напиток дают скидку 40 ₽ на комплекс. Или возьмите готовый набор.",
              },
              {
                icon: Wallet,
                n: "02",
                t: "Оплатите полностью",
                d: "Имя, группа и окно выдачи. Деньги списываются сразу — на линии только код.",
              },
              {
                icon: Clock3,
                n: "03",
                t: "Заберите в слот",
                d: "Покажите код на раздаче. Статус заказа виден по ссылке, без входа.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-xl border border-border bg-background p-5">
                <s.icon className="size-5 text-primary" />
                <p className="mt-4 text-xs tracking-wide text-muted-foreground uppercase">
                  {s.n}
                </p>
                <h3 className="mt-1 font-display text-xl font-medium">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-3xl font-medium">Объявления</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(info.data?.announcements ?? []).map((a) => (
            <article key={a.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display text-lg font-medium">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
