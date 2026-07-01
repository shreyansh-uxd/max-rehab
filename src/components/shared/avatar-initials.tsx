import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
}

const palette = [
  "bg-primary/10 text-primary",
  "bg-success/15 text-success",
  "bg-warning/20 text-warning-foreground",
  "bg-info/15 text-info",
  "bg-destructive/10 text-destructive",
];

export function AvatarInitials({ name, className, size = 36 }: { name: string; className?: string; size?: number }) {
  const idx = name.charCodeAt(0) % palette.length;
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold ring-2 ring-background",
        palette[idx],
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}
