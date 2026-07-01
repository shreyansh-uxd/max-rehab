import { cn } from "@/lib/utils";
import { statusTone } from "@/lib/mock";

const toneMap: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusTone(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneMap[tone],
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-success": tone === "success",
          "bg-info": tone === "info",
          "bg-warning": tone === "warning",
          "bg-destructive": tone === "destructive",
          "bg-primary": tone === "primary",
          "bg-muted-foreground": tone === "muted",
        })}
      />
      {status}
    </span>
  );
}
