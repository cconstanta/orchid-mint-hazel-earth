import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
import { PinCtx } from "@/components/admin/pin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyStaff } from "@/lib/canteen/admin";
import { STAFF_PIN_HINT } from "@/lib/canteen/types";
import { clearStaffPin, getStaffPin, setStaffPin } from "@/lib/canteen/staff-session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const ADMIN_NAV = [
  { to: "/admin", label: "Сводка", exact: true },
  { to: "/admin/menu", label: "Конструктор" },
  { to: "/admin/orders", label: "Заказы" },
  { to: "/admin/sales", label: "Импорт продаж" },
  { to: "/admin/reports", label: "Отчёты" },
  { to: "/admin/wishes", label: "Пожелания" },
];

function AdminLayout() {
  const [pin, setPin] = useState("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const stored = getStaffPin();
    if (!stored) {
      setReady(true);
      return;
    }
    void verifyStaff({ data: { pin: stored } })
      .then(() => setPin(stored))
      .catch(() => clearStaffPin())
      .finally(() => setReady(true));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await verifyStaff({ data: { pin: input } });
      setStaffPin(input);
      setPin(input);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Нет доступа");
    }
  }

  if (!ready) {
    return <div className="min-h-svh bg-background" />;
  }

  if (!pin) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <UtensilsCrossed className="size-4" />
            </span>
            <div>
              <p className="font-display text-lg font-medium">Кабинет</p>
              <p className="text-xs text-muted-foreground">Только сотрудники линии</p>
            </div>
          </div>
          <div className="mt-6 grid gap-1.5">
            <Label htmlFor="pin">Код сотрудника</Label>
            <Input
              id="pin"
              inputMode="numeric"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Учебный доступ для преподавателя: {STAFF_PIN_HINT}
          </p>
          <Button type="submit" className="mt-5 w-full">
            Войти
          </Button>
          <Button variant="ghost" className="mt-2 w-full" asChild>
            <Link to="/">На главную</Link>
          </Button>
        </form>
      </div>
    );
  }

  return (
    <PinCtx.Provider value={pin}>
      <div className="min-h-svh bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
            <Link to="/admin" className="font-display text-lg font-medium">
              Перемена · цех
            </Link>
            <nav className="flex flex-1 flex-wrap gap-1">
              {ADMIN_NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-sm font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearStaffPin();
                setPin("");
              }}
            >
              Выйти
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">Сайт</Link>
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </div>
    </PinCtx.Provider>
  );
}
