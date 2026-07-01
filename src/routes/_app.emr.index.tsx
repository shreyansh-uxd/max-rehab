import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ClipboardList, FolderHeart, ShieldCheck, FileWarning, Sparkles,
  Search, ArrowRight, Activity, MessageSquare, FileText, Stethoscope,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { StatusBadge } from "@/components/shared/status-badge";
import { TimelineList } from "@/components/shared/timeline-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  patients, medicalRecords, consentForms, activityFeed,
} from "@/lib/mock";

export const Route = createFileRoute("/_app/emr/")({
  head: () => ({
    meta: [
      { title: "EMR · Max Rehab" },
      { name: "description", content: "Central Electronic Medical Records for every patient across Max Rehab." },
    ],
  }),
  component: EMRDashboard,
});

function EMRDashboard() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q) return [] as typeof patients;
    const s = q.toLowerCase();
    return patients.filter((p) =>
      [p.name, p.id, p.phone, p.therapist, p.condition].some((v) => v.toLowerCase().includes(s)),
    ).slice(0, 6);
  }, [q]);

  const missing = patients.length - new Set(consentForms.filter((c) => c.status === "Signed").map((c) => c.patientId)).size;
  const recent = Object.values(medicalRecords)
    .sort((a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated))
    .slice(0, 5);

  const feed = activityFeed.slice(0, 8).map((e) => ({
    id: e.id,
    icon: e.kind === "appointment" ? Stethoscope
        : e.kind === "message" ? MessageSquare
        : e.kind === "document" ? FileText
        : e.kind === "assessment" ? Activity
        : e.kind === "consent" ? ShieldCheck
        : e.kind === "ai" ? Sparkles
        : FileText,
    title: e.title,
    description: e.description,
    at: e.at,
    actor: e.actor,
    tone: (e.kind === "consent" ? "success" : e.kind === "ai" ? "info" : "primary") as "success" | "info" | "primary",
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Electronic Medical Records"
        description="The single source of truth for every patient's clinical journey."
        actions={
          <>
            <Button variant="outline" asChild><Link to="/emr/consent">Consent hub</Link></Button>
            <Button asChild><Link to="/emr/records">Open records</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard label="Total records" value={patients.length} icon={FolderHeart} accent="primary" index={0} />
        <StatCard label="Updated 24h" value={12} delta={8} icon={ClipboardList} accent="info" index={1} />
        <StatCard label="Pending docs" value={9} icon={FileText} accent="warning" index={2} />
        <StatCard label="Missing consent" value={missing} icon={FileWarning} accent="warning" index={3} />
        <StatCard label="New assessments" value={7} delta={3} icon={Activity} accent="success" index={4} />
        <StatCard label="Recent uploads" value={14} delta={5} icon={FileText} accent="primary" index={5} />
      </div>

      <SectionCard title="Quick search" description="Search by name, patient ID, phone, therapist, or diagnosis" index={0}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Sophia, MRN-100002, +1 628…"
            className="h-11 pl-9 text-base"
          />
        </div>
        {results.length > 0 && (
          <ul className="mt-3 divide-y overflow-hidden rounded-xl border">
            {results.map((p) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-muted/40"
                onClick={() => navigate({ to: "/emr/$id", params: { id: p.id } })}
              >
                <AvatarInitials name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{medicalRecords[p.id].mrn} · {p.condition} · {p.therapist}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </motion.li>
            ))}
          </ul>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2" title="Recently updated records" description="Last modified across the clinic" index={0} bodyClassName="p-0">
          <ul className="divide-y">
            {recent.map((r) => {
              const p = patients.find((x) => x.id === r.patientId)!;
              return (
                <li key={r.patientId} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30">
                  <AvatarInitials name={p.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <span className="text-[10px] text-muted-foreground">{r.mrn}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{r.primaryDiagnosis} · Stage {r.recoveryStage}</p>
                  </div>
                  <StatusBadge status={p.status} />
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/emr/$id" params={{ id: p.id }}>Open</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
        <SectionCard title="Recent activity" index={1}>
          <TimelineList items={feed} />
        </SectionCard>
      </div>
    </div>
  );
}