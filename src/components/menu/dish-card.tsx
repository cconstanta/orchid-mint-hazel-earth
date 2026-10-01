import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DishPhoto } from "@/components/menu/dish-photo";
import type { PublicDish } from "@/lib/canteen/types";
import { useCart } from "@/lib/canteen/cart";
import { rub } from "@/lib/utils";
import { toast } from "sonner";

const TAG_LABEL: Record<string, string> = { veg: "без мяса" };

export function DishCard({ dish }: { dish: PublicDish }) {
  const add = useCart((s) => s.add);
  const soldOut = dish.portions_left === 0;
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <DishPhoto imageKey={dish.image_key} name={dish.name} />
        {dish.featured ? (
          <Badge className="absolute top-3 left-3">на линии</Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-medium leading-snug">
              {dish.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{dish.description}</p>
          </div>
          <p className="font-medium tabular-nums whitespace-nowrap">
            {rub(dish.price)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            {dish.weight_g} г · {dish.calories} ккал
            {dish.tags.map((t) =>
              TAG_LABEL[t] ? (
                <span key={t}> · {TAG_LABEL[t]}</span>
              ) : null,
            )}
            {dish.portions_left != null ? ` · ещё ${dish.portions_left}` : ""}
          </p>
          <Button
            size="sm"
            disabled={soldOut}
            onClick={() => {
              add({
                dishId: dish.id,
                name: dish.name,
                price: dish.price,
                categorySlug: dish.category_slug,
                image_key: dish.image_key,
              });
              toast.success(`«${dish.name}» в подносе`);
            }}
          >
            <Plus />
            {soldOut ? "Нет" : "В поднос"}
          </Button>
        </div>
      </div>
    </article>
  );
}
