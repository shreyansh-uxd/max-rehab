import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Filter, Plus, Tag, Upload, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patients, type Patient } from "@/lib/mock";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/patients")({
  head: () => ({
    meta: [
      { title: "Patients · Max Rehab" },
      { name: "description", content: "Manage and review all patients across Max Rehab clinics." },
    ],
  }),
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  const active = patients.filter((p) => p.status === "Active").length;
  const onboarding = patients.filter((p) => p.status === "Onboarding").length;
  const avgAdherence = Math.round(patients.reduce((s, p) => s + p.adherence, 0) / patients.length);

  const columns: Column<Patient>[] = [
    {
      key: "name",
      header: "Patient",
      sort: (a, b) => a.name.localeCompare(b.name),
      cell: (p) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={p.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{p.name}</p>
            <p className="truncate text-xs text-muted-foreground">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: "condition", header: "Condition", cell: (p) => <span className="text-sm">{p.condition}</span> },
    { key: "therapist", header: "Therapist", cell: (p) => <span className="text-sm text-muted-foreground">{p.therapist}</span> },
    {
      key: "tags",
      header: "Tags",
      cell: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "adherence",
      header: "Adherence",
      sort: (a, b) => a.adherence - b.adherence,
      cell: (p) => (
        <div className="flex w-32 items-center gap-2">
          <Progress value={p.adherence} className="h-1.5" />
          <span className="w-9 text-right text-xs font-medium text-muted-foreground">{p.adherence}%</span>
        </div>
      ),
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    {
      key: "next",
      header: "Next visit",
      sort: (a, b) => +new Date(a.nextVisit) - +new Date(b.nextVisit),
      cell: (p) => <span className="text-sm text-muted-foreground">{format(parseISO(p.nextVisit), "MMM d, h:mm a")}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patients"
        description="42 patients · 6 home-visit only · 3 awaiting onboarding"
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><Upload className="h-4 w-4" /> Import</Button>
            <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Patients exported as CSV")}><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> New patient</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total patients" value={patients.length} delta={4} icon={Users} index={0} />
        <StatCard label="Active" value={active} delta={2} accent="success" index={1} icon={Users} />
        <StatCard label="Onboarding" value={onboarding} accent="info" index={2} icon={Users} />
        <StatCard label="Avg adherence" value={`${avgAdherence}%`} delta={3} accent="warning" index={3} icon={Users} />
      </div>

      <DataTable
        data={patients}
        columns={columns}
        searchKeys={["name", "email", "condition", "therapist"]}
        filters={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Filters</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem>Active only</DropdownMenuItem>
              <DropdownMenuItem>Onboarding</DropdownMenuItem>
              <DropdownMenuItem>On Hold</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tag</DropdownMenuLabel>
              <DropdownMenuItem><Tag className="mr-2 h-3 w-3" /> Post-Op</DropdownMenuItem>
              <DropdownMenuItem><Tag className="mr-2 h-3 w-3" /> Sports</DropdownMenuItem>
              <DropdownMenuItem><Tag className="mr-2 h-3 w-3" /> Geriatric</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        onRowClick={(row) => navigate({ to: "/patients/$id", params: { id: row.id } })}
        pageSize={9}
      />
    </div>
  );
}
