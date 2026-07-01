import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, List, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointments, type Appointment } from "@/lib/mock";
import { format, parseISO, isToday } from "date-fns";

export const Route = createFileRoute("/_app/appointments")({
  head: () => ({
    meta: [
      { title: "Appointments · Max Rehab" },
      { name: "description", content: "Calendar, list and timeline of all appointments." },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const [tab, setTab] = useState("list");
  const today = appointments.filter((a) => isToday(parseISO(a.start)));
  const cols: Column<Appointment>[] = [
    {
      key: "patient", header: "Patient",
      cell: (a) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={a.patient} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{a.patient}</p>
            <p className="truncate text-xs text-muted-foreground">{a.service}</p>
          </div>
        </div>
      ),
    },
    { key: "therapist", header: "Therapist", cell: (a) => <span className="text-sm text-muted-foreground">{a.therapist}</span> },
    { key: "start", header: "When", sort: (a, b) => +new Date(a.start) - +new Date(b.start), cell: (a) => <span className="text-sm">{format(parseISO(a.start), "MMM d, h:mm a")}</span> },
    { key: "duration", header: "Duration", cell: (a) => <span className="text-sm">{a.duration}m</span> },
    { key: "type", header: "Type", cell: (a) => <span className="text-xs text-muted-foreground">{a.type}</span> },
    { key: "status", header: "Status", cell: (a) => <StatusBadge status={a.status} /> },
    { key: "payment", header: "Payment", cell: (a) => <StatusBadge status={a.payment} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointments"
        description={`${today.length} today · ${appointments.filter((a) => a.status === "Scheduled").length} upcoming`}
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Book appointment</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value={today.length} icon={CalendarDays} accent="primary" index={0} />
        <StatCard label="In progress" value={appointments.filter((a) => a.status === "In Progress").length} accent="info" index={1} />
        <StatCard label="Completed (7d)" value={appointments.filter((a) => a.status === "Completed").length} accent="success" index={2} />
        <StatCard label="No-shows (7d)" value={appointments.filter((a) => a.status === "No Show").length} accent="warning" index={3} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list"><List className="mr-1.5 h-3.5 w-3.5" /> List</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-1.5 h-3.5 w-3.5" /> Calendar</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <DataTable data={appointments} columns={cols} searchKeys={["patient","therapist","service","location"]} pageSize={10} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <SectionCard index={0}>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d} className="text-center font-semibold text-muted-foreground">{d}</div>)}
              {Array.from({ length: 35 }).map((_, i) => {
                const count = (i * 3) % 7;
                return (
                  <div key={i} className="aspect-square rounded-xl border p-1.5 transition-colors hover:bg-muted/40">
                    <p className="text-[11px] font-medium">{((i % 30) + 1)}</p>
                    {count > 0 && <div className="mt-1 space-y-0.5">
                      {Array.from({ length: Math.min(count, 3) }).map((_, k) => (
                        <div key={k} className="truncate rounded bg-primary/10 px-1 text-[9px] text-primary">{8 + k}:00 · Patient</div>
                      ))}
                    </div>}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <SectionCard bodyClassName="p-0" index={0}>
            <ol className="divide-y">
              {appointments.slice(0, 10).map((a) => (
                <li key={a.id} className="grid grid-cols-[120px_auto_minmax(0,1fr)_auto] items-center gap-4 p-4">
                  <span className="text-xs text-muted-foreground">{format(parseISO(a.start), "MMM d, h:mm a")}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.patient} · {a.service}</p>
                    <p className="truncate text-xs text-muted-foreground">with {a.therapist} · {a.type}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
