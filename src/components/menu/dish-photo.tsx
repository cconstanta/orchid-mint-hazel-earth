import { cn } from "@/lib/utils";
import { dishImage, dishInitials } from "@/lib/canteen/dish-media";

export function DishPhoto({
  imageKey,
  name,
  className,
}: {
  imageKey: string;
  name: string;
  className?: string;
}) {
  const src = dishImage(imageKey);
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "grid h-full w-full place-items-center bg-accent text-primary",
        className,
      )}
      aria-hidden
    >
      <span className="font-display text-2xl tracking-tight">
        {dishInitials(name)}
      </span>
    </div>
  );
}
