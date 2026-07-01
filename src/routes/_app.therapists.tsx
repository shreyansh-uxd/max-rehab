import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { therapists } from "@/lib/mock";

export const Route = createFileRoute("/_app/therapists")({
  head: () => ({
    meta: [
      { title: "Therapists · Max Rehab" },
      { name: "description", content: "Therapist directory with availability, ratings, and workload." },
    ],
  }),
  component: TherapistsPage,
});

function TherapistsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const list = therapists.filter((t) => `${t.name} ${t.specialty}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Therapists"
        description={`${therapists.length} therapists · ${therapists.filter((t) => t.availability === "Available").length} available now`}
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Add therapist</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total therapists" value={therapists.length} delta={2} index={0} />
        <StatCard label="Available now" value={therapists.filter((t) => t.availability === "Available").length} accent="success" index={1} />
        <StatCard label="Avg workload" value={`${Math.round(therapists.reduce((s, t) => s + t.workload, 0) / therapists.length)}%`} accent="info" index={2} />
        <StatCard label="Avg rating" value={(therapists.reduce((s, t) => s + t.rating, 0) / therapists.length).toFixed(2)} accent="warning" index={3} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or specialty" className="w-full sm:w-72" />
        <div className="inline-flex items-center gap-1 rounded-xl border bg-card p-1 shadow-soft">
          <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className="group overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <AvatarInitials name={t.name} size={48} />
                <div className="min-w-0 flex-1">
                  <Link to="/therapists/$id" params={{ id: t.id }} className="truncate text-sm font-semibold hover:underline">{t.name}</Link>
                  <p className="truncate text-xs text-muted-foreground">{t.title} · {t.specialty}</p>
                </div>
                <StatusBadge status={t.availability} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <Cell label="Patients" value={t.patients} />
                <Cell label="Years" value={t.experience} />
                <Cell label="Rating" value={t.rating.toFixed(1)} icon={<Star className="h-3 w-3 fill-warning text-warning" />} />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Workload</span><span className="font-semibold">{t.workload}%</span></div>
                <Progress value={t.workload} className="mt-1 h-1.5" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Assign</Button>
                <Link to="/therapists/$id" params={{ id: t.id }} className="inline-flex flex-1"><Button size="sm" className="w-full">Profile</Button></Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          {list.map((t) => (
            <Link key={t.id} to="/therapists/$id" params={{ id: t.id }} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-4 border-b px-5 py-3 last:border-0 hover:bg-muted/40">
              <AvatarInitials name={t.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{t.specialty} · {t.location}</p>
              </div>
              <div className="hidden w-40 sm:block">
                <Progress value={t.workload} className="h-1.5" />
              </div>
              <span className="text-xs font-medium">{t.rating.toFixed(1)} ★</span>
              <StatusBadge status={t.availability} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, icon }: { label: string; value: any; icon?: any }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <div className="flex items-center justify-center gap-1 text-sm font-semibold">{icon}{value}</div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
