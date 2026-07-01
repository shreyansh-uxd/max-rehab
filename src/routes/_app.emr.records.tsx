import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Filter, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { patients, medicalRecords, appointmentsFor } from "@/lib/mock";
import { format, parseISO } from "date-fns";

interface Row {
  id: string;
  name: string;
  mrn: string;
  dob: string;
  therapist: string;
  diagnosis: string;
  lastVisit: string;
  nextAppt: string;
  status: string;
  age: number;
}

export const Route = createFileRoute("/_app/emr/records")({
  head: () => ({
    meta: [
      { title: "EMR Records · Max Rehab" },
      { name: "description", content: "Search and manage every patient's medical record." },
    ],
  }),
  component: RecordsPage,
});

function RecordsPage() {
  const nav = useNavigate();
  const rows: Row[] = patients.map((p) => {
    const r = medicalRecords[p.id];
    const upcoming = appointmentsFor(p.id).find((a) => a.status === "Scheduled");
    return {
      id: p.id,
      name: p.name,
      mrn: r.mrn,
      dob: r.dob,
      therapist: p.therapist,
      diagnosis: p.condition,
      lastVisit: p.lastVisit,
      nextAppt: upcoming?.start ?? p.nextVisit,
      status: p.status,
      age: p.age,
    };
  });

  const cols: Column<Row>[] = [
    {
      key: "name",
      header: "Patient",
      sort: (a, b) => a.name.localeCompare(b.name),
      cell: (r) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={r.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.mrn} · {r.age}y</p>
          </div>
        </div>
      ),
    },
    { key: "id", header: "Patient ID", cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "dob", header: "DOB", cell: (r) => <span className="text-xs">{format(parseISO(r.dob), "MMM d, yyyy")}</span> },
    { key: "therapist", header: "Therapist", cell: (r) => <span className="text-sm text-muted-foreground">{r.therapist}</span> },
    { key: "diagnosis", header: "Diagnosis", cell: (r) => <span className="text-sm">{r.diagnosis}</span> },
    { key: "last", header: "Last visit", sort: (a, b) => +new Date(a.lastVisit) - +new Date(b.lastVisit),
      cell: (r) => <span className="text-xs text-muted-foreground">{format(parseISO(r.lastVisit), "MMM d")}</span> },
    { key: "next", header: "Next appt", cell: (r) => <span className="text-xs text-muted-foreground">{format(parseISO(r.nextAppt), "MMM d, h:mm a")}</span> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patient Medical Records"
        description={`${rows.length} records · Searchable EMR directory`}
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> New record</Button>
          </>
        }
      />
      <DataTable
        data={rows}
        columns={cols}
        searchKeys={["name", "mrn", "therapist", "diagnosis"]}
        onRowClick={(r) => nav({ to: "/emr/$id", params: { id: r.id } })}
        pageSize={10}
        filters={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" /> Filters</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Therapist</DropdownMenuLabel>
              <DropdownMenuItem>All therapists</DropdownMenuItem>
              <DropdownMenuLabel>Diagnosis</DropdownMenuLabel>
              <DropdownMenuItem>All diagnoses</DropdownMenuItem>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
    </div>
  );
}