import { Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "./app-sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { navGroups } from "./nav-items";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh w-full bg-background text-foreground">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <nav className="scrollbar-thin flex h-full flex-col gap-4 overflow-y-auto p-3">
            {navGroups.map((g) => (
              <div key={g.label}>
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{g.label}</p>
                {g.items.map((i) => {
                  const active = i.to === "/" ? pathname === "/" : pathname.startsWith(i.to);
                  return (
                    <Link
                      key={i.to}
                      to={i.to}
                      onClick={() => setMobile(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium",
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <i.icon className="h-4 w-4" /> {i.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenCommand={() => setCmd(true)} onToggleMobileNav={() => setMobile(true)} />
        <main className="relative flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8"
            >
              {children ?? <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={cmd} onOpenChange={setCmd} />
    </div>
  );
}
