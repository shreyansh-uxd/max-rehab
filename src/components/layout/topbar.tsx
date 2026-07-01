import { useState } from "react";
import { Bell, Command, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Props {
  onOpenCommand: () => void;
  onToggleMobileNav: () => void;
}

export function Topbar({ onOpenCommand, onToggleMobileNav }: Props) {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleMobileNav}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <motion.button
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          onClick={onOpenCommand}
          className="group mx-auto flex w-full max-w-xl items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm text-muted-foreground shadow-soft transition-colors hover:bg-muted/40"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search patients, therapists, pages…</span>
          <kbd className="hidden items-center gap-1 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </kbd>
        </motion.button>
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="hidden gap-1.5 rounded-xl shadow-soft sm:inline-flex">
                <Plus className="h-4 w-4" /> Quick add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Create</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast.success("New patient draft created")}>New patient</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Appointment booking started")}>Book appointment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Home visit scheduled")}>Schedule home visit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Programme builder opened")}>New programme</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.success("Upload document")}>Upload document</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { t: "Sophia Patel completed exercise plan", time: "2m" },
                { t: "Therapist Dr. Khan flagged a pain spike", time: "18m" },
                { t: "Invoice INV-10240 paid via card", time: "1h" },
                { t: "AI escalated 2 conversations to staff", time: "3h" },
              ].map((n) => (
                <DropdownMenuItem key={n.t} className="flex flex-col items-start gap-0.5 py-2">
                  <span className="text-sm">{n.t}</span>
                  <span className="text-xs text-muted-foreground">{n.time} ago</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <AvatarInitials name="Alex Kim" size={36} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Alex Kim</span>
                  <span className="text-xs text-muted-foreground">alex@maxrehab.co</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
