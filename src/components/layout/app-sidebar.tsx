import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./nav-items";
import logo from "@/assets/logo.webp";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 264 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="sticky top-0 z-30 hidden h-dvh shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col"
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border/70 px-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-sidebar-accent">
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-border">
            <img src={logo} alt="Max Rehab" className="h-7 w-7 object-contain" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="min-w-0"
              >
                <p className="truncate text-sm font-semibold leading-tight">Max Rehab</p>
                <p className="truncate text-[11px] text-muted-foreground">Admin · Downtown</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={onToggle}
          className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="scrollbar-thin flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            {group.items.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary/10 ring-1 ring-primary/15"
                      transition={{ type: "spring", stiffness: 350, damping: 32 }}
                    />
                  )}
                  <item.icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-primary")} />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        className="flex min-w-0 flex-1 items-center justify-between gap-2"
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {item.badge}
                          </span>
                        ) : null}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>


    </motion.aside>
  );
}
