import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Phone, Pin, Search, Send, Smile, Video } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { patients } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({
    meta: [
      { title: "Messages · Max Rehab" },
      { name: "description", content: "Care team conversations with patients." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [active, setActive] = useState(patients[0]);
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Messages" description={`${patients.length} conversations · 3 unread`} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)_300px]">
        <aside className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations" className="pl-9" />
            </div>
          </div>
          <ul className="scrollbar-thin max-h-[60vh] divide-y overflow-y-auto">
            {patients.slice(0, 14).map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => setActive(p)}
                  className={cn(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                    active.id === p.id && "bg-primary/8",
                  )}
                >
                  <AvatarInitials name={p.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{["Thanks!","See you Friday","Pain is better","Doc, quick question"][i % 4]}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-muted-foreground">{(i + 9) % 12}m</span>
                    {i < 3 && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">{i + 1}</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
          <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3">
            <AvatarInitials name={active.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.name}</p>
              <p className="truncate text-xs text-muted-foreground">{active.condition} · last active 2m ago</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Pin className="h-4 w-4" /></Button>
            </div>
          </header>
          <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-5">
            {[
              { who: "p", text: "Morning! My knee is feeling much better today after the new exercise set." },
              { who: "me", text: "That's great to hear, well done sticking with the plan!" },
              { who: "p", text: "Should I push the reps a little higher this week?" },
              { who: "me", text: "Let's add 2 reps on the single-leg squats only. Keep everything else the same." },
              { who: "p", text: "Got it. Will report back Friday." },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn("flex", m.who === "me" ? "justify-end" : "justify-start")}
              >
                <div className={cn("max-w-[70%] rounded-2xl px-3.5 py-2 text-sm", m.who === "me" ? "bg-primary text-primary-foreground" : "bg-muted")}>{m.text}</div>
              </motion.div>
            ))}
            <p className="text-center text-[11px] text-muted-foreground">Patient is typing…</p>
          </div>
          <footer className="border-t p-3">
            <div className="flex items-end gap-2">
              <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Smile className="h-4 w-4" /></Button>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="min-h-[40px] resize-none" rows={1} />
              <Button className="gap-1.5"><Send className="h-4 w-4" /></Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Got it 👍","Let's discuss Friday","Increase reps by 2","Schedule check-in"].map((q) => (
                <button key={q} onClick={() => setDraft(q)} className="rounded-full border bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted-foreground/10">{q}</button>
              ))}
            </div>
          </footer>
        </section>

        <aside className="hidden flex-col gap-3 overflow-hidden rounded-2xl border bg-card p-5 shadow-soft lg:flex">
          <div className="text-center">
            <AvatarInitials name={active.name} size={72} className="mx-auto" />
            <p className="mt-3 font-semibold">{active.name}</p>
            <p className="text-xs text-muted-foreground">{active.condition}</p>
          </div>
          <div className="rounded-xl border p-3 text-xs">
            <p className="text-muted-foreground">Therapist</p>
            <p className="font-semibold">{active.therapist}</p>
          </div>
          <div className="rounded-xl border p-3 text-xs">
            <p className="text-muted-foreground">Pinned</p>
            <p>“Increase reps gradually — track pain after each session.”</p>
          </div>
          <div className="rounded-xl border p-3 text-xs">
            <p className="text-muted-foreground">Quick links</p>
            <ul className="mt-1 space-y-1 text-sm">
              <li className="text-primary hover:underline">Open patient profile</li>
              <li className="text-primary hover:underline">View exercise plan</li>
              <li className="text-primary hover:underline">Schedule appointment</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
