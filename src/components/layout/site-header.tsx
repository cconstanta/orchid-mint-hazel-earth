import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cartCount, useCart } from "@/lib/canteen/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Сегодня" },
  { to: "/menu", label: "Меню" },
  { to: "/order", label: "Заказ" },
  { to: "/wishes", label: "Пожелания" },
  { to: "/info", label: "Столовая" },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = useCart((s) => s.items);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const count = hydrated ? cartCount(items) : 0;

  const links = (onClick?: () => void) =>
    NAV.map((item) => {
      const active =
        item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClick}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted",
          )}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-medium">Перемена</span>
            <span className="block text-[11px] tracking-wide text-muted-foreground uppercase">
              столовая колледжа
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">{links()}</nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/order" aria-label="Поднос">
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
            <Link to="/admin">Сотрудникам</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Меню">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle>Перемена</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">{links(() => setOpen(false))}</nav>
              <div className="mt-auto p-4">
                <Button className="w-full" asChild>
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    Кабинет сотрудника
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
