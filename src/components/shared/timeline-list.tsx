import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { type ReactNode } from "react";

export interface TimelineItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  at: string;
  tone?: "primary" | "success" | "warning" | "info" | "muted";
  actor?: string;
}

const toneRing: Record<string, string> = {
  primary: "bg-primary/10 text-primary ring-primary/20",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/15 text-warning-foreground ring-warning/25",
  info: "bg-info/10 text-info ring-info/20",
  muted: "bg-muted text-muted-foreground ring-border",
};

export function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative flex flex-col gap-4 pl-4">
      <span className="absolute left-[10px] top-1 bottom-1 w-px bg-border" aria-hidden />
      {items.map((it, i) => (
        <motion.li
          key={it.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="relative pl-6"
        >
          <span
            className={cn(
              "absolute -left-1.5 top-0.5 grid h-7 w-7 place-items-center rounded-full ring-4 ring-background",
              toneRing[it.tone ?? "primary"],
            )}
          >
            <it.icon className="h-3.5 w-3.5" />
          </span>
          <div className="rounded-xl border bg-card p-3 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">{it.title}</p>
              <span className="text-xs text-muted-foreground">{format(parseISO(it.at), "MMM d · h:mm a")}</span>
            </div>
            {it.description ? <div className="mt-1 text-xs text-muted-foreground">{it.description}</div> : null}
            {it.actor ? <p className="mt-1.5 text-[11px] text-muted-foreground">by {it.actor}</p> : null}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}