import { createFileRoute, Outlet, useRouterState, Link } from "@tanstack/react-router";
import { Activity, BookOpen, Bot, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/ai")({
  component: AiLayout,
});

const tabs = [
  { label: "Dashboard", to: "/ai", icon: Bot, exact: true },
  { label: "AI Logs", to: "/ai/logs", icon: Activity },
  { label: "Knowledge Base", to: "/ai/knowledge", icon: BookOpen },
  { label: "Configuration", to: "/ai/config", icon: Sliders },
];

function AiLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border bg-card p-1 shadow-soft">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
          return (
            <Link key={t.to} to={t.to} className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/60",
            )}>
              <t.icon className="h-4 w-4" /> {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
