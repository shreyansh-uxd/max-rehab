import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign, FileText, Plus, Receipt } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { invoices } from "@/lib/mock";
import { format, parseISO } from "date-fns";

type Inv = typeof invoices[number];

export const Route = createFileRoute("/_app/billing")({
  head: () => ({
    meta: [
      { title: "Billing · Max Rehab" },
      { name: "description", content: "Invoices, payments, and insurance claims." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const cols: Column<Inv>[] = [
    { key: "id", header: "Invoice", cell: (i) => <span className="font-mono text-sm font-semibold">{i.id}</span> },
    { key: "patient", header: "Patient", cell: (i) => <span className="text-sm">{i.patient}</span> },
    { key: "amount", header: "Amount", sort: (a, b) => a.amount - b.amount, cell: (i) => <span className="text-sm font-semibold">${i.amount}</span> },
    { key: "method", header: "Method", cell: (i) => <span className="text-xs text-muted-foreground">{i.method}</span> },
    { key: "issued", header: "Issued", sort: (a, b) => +new Date(a.issued) - +new Date(b.issued), cell: (i) => <span className="text-xs">{format(parseISO(i.issued), "MMM d, yyyy")}</span> },
    { key: "due", header: "Due", cell: (i) => <span className="text-xs">{format(parseISO(i.due), "MMM d, yyyy")}</span> },
    { key: "status", header: "Status", cell: (i) => <StatusBadge status={i.status} /> },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Billing"
        description="Invoices, payments, and insurance claims"
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Create invoice</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total billed (MTD)" value={`$${total.toLocaleString()}`} delta={12} icon={CircleDollarSign} accent="primary" index={0} />
        <StatCard label="Paid" value={`$${(total - outstanding).toLocaleString()}`} accent="success" index={1} icon={Receipt} />
        <StatCard label="Outstanding" value={`$${outstanding.toLocaleString()}`} delta={-5} accent="warning" index={2} icon={FileText} />
        <StatCard label="Insurance claims" value={invoices.filter((i) => i.status === "Insurance").length} accent="info" index={3} icon={FileText} />
      </div>
      <DataTable data={invoices as unknown as Inv[]} columns={cols} searchKeys={["id","patient","method"] as (keyof Inv)[]} pageSize={10} />
    </div>
  );
}
