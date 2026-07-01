import { createFileRoute } from "@tanstack/react-router";
import { Car, MapPin, Navigation, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/mock";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/_app/home-visits")({
  head: () => ({
    meta: [
      { title: "Home Visits · Max Rehab" },
      { name: "description", content: "Schedule and dispatch home visits with routing." },
    ],
  }),
  component: HomeVisits,
});

function HomeVisits() {
  const visits = appointments.filter((a) => a.type === "Home Visit");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Home Visits"
        description="Plan, route, and track in-home therapy"
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Schedule visit</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value={4} icon={Car} accent="primary" index={0} />
        <StatCard label="In transit" value={2} accent="info" index={1} />
        <StatCard label="Completed (7d)" value={18} accent="success" index={2} />
        <StatCard label="Avg drive time" value="22 min" accent="warning" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Live route map" description="Today's dispatch" index={0}>
          <div className="relative h-96 overflow-hidden rounded-xl border bg-gradient-to-br from-primary/8 via-info/8 to-success/8">
            <svg className="absolute inset-0 h-full w-full opacity-40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M40,300 Q200,200 380,260 T720,140" stroke="#1F5FFF" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            </svg>
            {[
              { x: "10%", y: "70%", label: "1" },
              { x: "32%", y: "55%", label: "2" },
              { x: "55%", y: "62%", label: "3" },
              { x: "78%", y: "30%", label: "4" },
            ].map((p) => (
              <div key={p.label} style={{ left: p.x, top: p.y }} className="absolute -translate-x-1/2 -translate-y-1/2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-elevated ring-4 ring-primary/20">{p.label}</div>
              </div>
            ))}
            <div className="absolute bottom-3 left-3 rounded-xl bg-card/90 px-3 py-2 text-xs shadow-soft backdrop-blur">
              <p className="font-semibold">San Francisco · Mission Bay</p>
              <p className="text-muted-foreground">4 stops · 18 mi total</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Today's stops" index={1} bodyClassName="p-0">
          <ol className="divide-y">
            {visits.slice(0, 5).map((v, i) => (
              <li key={v.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 p-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{v.patient}</p>
                  <p className="text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" /> 200 Market St · 4.2 mi</p>
                  <p className="text-xs text-muted-foreground">{format(parseISO(v.start), "h:mm a")} · {v.therapist}</p>
                </div>
                <StatusBadge status={v.status} />
              </li>
            ))}
          </ol>
          <div className="border-t p-3"><Button className="w-full gap-1.5"><Navigation className="h-4 w-4" /> Start route</Button></div>
        </SectionCard>
      </div>

      <SectionCard title="Upcoming visits" bodyClassName="p-0" index={2}>
        <ul className="divide-y">
          {visits.slice(0, 8).map((v) => (
            <li key={v.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 px-5 py-3">
              <AvatarInitials name={v.patient} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{v.patient}</p>
                <p className="truncate text-xs text-muted-foreground">{v.service} · {v.therapist}</p>
              </div>
              <span className="text-sm text-muted-foreground">{format(parseISO(v.start), "MMM d, h:mm a")}</span>
              <StatusBadge status={v.status} />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
