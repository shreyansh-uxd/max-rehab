import { createFileRoute } from "@tanstack/react-router";
import { FileText, FolderClosed, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { documents } from "@/lib/mock";
import { format, parseISO } from "date-fns";

type Doc = typeof documents[number];

export const Route = createFileRoute("/_app/documents")({
  head: () => ({
    meta: [
      { title: "Documents · Max Rehab" },
      { name: "description", content: "Patient documents, consents, reports and invoices." },
    ],
  }),
  component: DocsPage,
});

const folders = [
  { name: "Patient Documents", count: 124 },
  { name: "Consent Forms", count: 38 },
  { name: "Medical Reports", count: 56 },
  { name: "Invoices", count: 81 },
  { name: "Insurance", count: 44 },
];

function DocsPage() {
  const cols: Column<Doc>[] = [
    {
      key: "name", header: "Name", sort: (a, b) => a.name.localeCompare(b.name),
      cell: (d) => (
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{d.name}</p>
            <p className="truncate text-xs text-muted-foreground">{d.type}</p>
          </div>
        </div>
      ),
    },
    { key: "patient", header: "Patient", cell: (d) => <span className="text-sm">{d.patient}</span> },
    { key: "size", header: "Size", cell: (d) => <span className="text-xs text-muted-foreground">{d.size}</span> },
    { key: "uploaded", header: "Uploaded", sort: (a, b) => +new Date(a.uploaded) - +new Date(b.uploaded), cell: (d) => <span className="text-xs">{format(parseISO(d.uploaded), "MMM d, yyyy")}</span> },
    { key: "by", header: "Uploaded by", cell: (d) => <span className="text-xs text-muted-foreground">{d.uploadedBy}</span> },
    { key: "act", header: "", cell: () => <Button variant="ghost" size="sm">Open</Button> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Documents"
        description="343 files · 56 MB total"
        actions={<Button className="gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {folders.map((f, i) => (
          <SectionCard key={f.name} index={i} bodyClassName="p-4">
            <FolderClosed className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">{f.name}</p>
            <p className="text-xs text-muted-foreground">{f.count} files</p>
          </SectionCard>
        ))}
      </div>
      <StatCard label="Storage used" value="56 MB / 5 GB" hint="343 documents across all folders" icon={FileText} index={0} />
      <DataTable data={documents as unknown as Doc[]} columns={cols} searchKeys={["name","patient","type"] as (keyof Doc)[]} pageSize={10} />
    </div>
  );
}
