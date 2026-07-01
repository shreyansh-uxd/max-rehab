import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  index?: number;
}

export function SectionCard({ title, description, action, children, className, bodyClassName, index = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
      className={cn("overflow-hidden rounded-2xl border bg-card shadow-soft", className)}
    >
      {(title || action) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/60 px-5 py-4">
          <div className="min-w-0">
            {title ? <h3 className="truncate text-sm font-semibold">{title}</h3> : null}
            {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </motion.section>
  );
}
