import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Столовая «Перемена» · ГБПОУ «Политех-колледж №12»</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/info" className="hover:text-foreground">
            График и адрес
          </Link>
          <Link to="/wishes" className="hover:text-foreground">
            Пожелания
          </Link>
          <Link to="/admin" className="hover:text-foreground">
            Админка
          </Link>
        </div>
      </div>
    </footer>
  );
}
