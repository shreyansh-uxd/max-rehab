import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon?: LucideIcon;
  accent?: "primary" | "success" | "warning" | "info";
  index?: number;
}

const accentMap: Record<string, string> = {
  primary: "from-primary/15 to-primary/0 text-primary",
  success: "from-success/15 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning-foreground",
  info: "from-info/15 to-info/0 text-info",
};

export function StatCard({ label, value, delta, hint, icon: Icon, accent = "primary", index = 0 }: Props) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div className={cn("pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-70 blur-2xl", accentMap[accent])} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight">{value}</span>
            {typeof delta === "number" ? (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
                  up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
                )}
              >
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(delta)}%
              </span>
            ) : null}
          </div>
          {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br", accentMap[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
