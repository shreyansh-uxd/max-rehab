import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  steps: { label: string; hint?: string }[];
  current: number;
}

export function WizardStepper({ steps, current }: Props) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.label} className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{ scale: active ? 1.05 : 1 }}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold transition-colors",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-primary/10 text-primary",
                !done && !active && "border-border bg-card text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </motion.div>
            <div className="hidden sm:block">
              <p className={cn("text-xs font-semibold", active ? "text-foreground" : "text-muted-foreground")}>{s.label}</p>
              {s.hint ? <p className="text-[10px] text-muted-foreground">{s.hint}</p> : null}
            </div>
            {i < steps.length - 1 && <div className="mx-1 h-px w-6 bg-border sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}