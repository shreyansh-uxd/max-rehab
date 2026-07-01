import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { flatNav } from "./nav-items";
import { patients, therapists } from "@/lib/mock";
import { Plus, UserPlus, CalendarPlus, FileUp } from "lucide-react";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    setTimeout(fn, 60);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search patients, therapists, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => run(() => navigate({ to: "/patients" }))}>
            <UserPlus className="mr-2 h-4 w-4" /> New patient
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/appointments" }))}>
            <CalendarPlus className="mr-2 h-4 w-4" /> Book appointment
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/documents" }))}>
            <FileUp className="mr-2 h-4 w-4" /> Upload document
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: "/programmes" }))}>
            <Plus className="mr-2 h-4 w-4" /> Create programme
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {flatNav.map((n) => (
            <CommandItem key={n.to} value={`nav ${n.label}`} onSelect={() => run(() => navigate({ to: n.to }))}>
              <n.icon className="mr-2 h-4 w-4" /> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Patients">
          {patients.slice(0, 8).map((p) => (
            <CommandItem key={p.id} value={`patient ${p.name} ${p.condition}`} onSelect={() => run(() => navigate({ to: "/patients/$id", params: { id: p.id } }))}>
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">{p.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{p.condition}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Therapists">
          {therapists.slice(0, 6).map((t) => (
            <CommandItem key={t.id} value={`therapist ${t.name} ${t.specialty}`} onSelect={() => run(() => navigate({ to: "/therapists/$id", params: { id: t.id } }))}>
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
              <span className="font-medium">{t.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{t.specialty}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
