import { createFileRoute } from "@tanstack/react-router";
import { Bot, Flag, FileDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { aiConversations } from "@/lib/mock";
import { format, parseISO } from "date-fns";

type Row = typeof aiConversations[number];

export const Route = createFileRoute("/_app/ai/logs")({
  head: () => ({
    meta: [
      { title: "AI Logs · Max Rehab" },
      { name: "description", content: "Enterprise conversation log with confidence and escalation tracking." },
    ],
  }),
  component: AiLogs,
});

function AiLogs() {
  const cols: Column<Row>[] = [
    {
      key: "patient", header: "Patient",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <AvatarInitials name={c.patient} />
          <div>
            <p className="text-sm font-semibold">{c.patient}</p>
            <p className="text-xs text-muted-foreground">{c.id}</p>
          </div>
        </div>
      ),
    },
    { key: "topic", header: "Topic", cell: (c) => <span className="text-sm">{c.topic}</span> },
    { key: "messages", header: "Messages", sort: (a, b) => a.messages - b.messages, cell: (c) => <span className="text-sm">{c.messages}</span> },
    {
      key: "confidence", header: "Confidence", sort: (a, b) => a.confidence - b.confidence,
      cell: (c) => {
        const pct = Math.round(c.confidence * 100);
        const tone = pct > 85 ? "bg-success" : pct > 70 ? "bg-info" : "bg-warning";
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><div className={`h-full ${tone}`} style={{ width: `${pct}%` }} /></div>
            <span className="text-xs font-medium">{pct}%</span>
          </div>
        );
      },
    },
    { key: "satisfaction", header: "CSAT", cell: (c) => <span className="text-sm">{c.satisfaction ? `${c.satisfaction}/5` : "—"}</span> },
    { key: "status", header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
    { key: "startedAt", header: "Started", sort: (a, b) => +new Date(a.startedAt) - +new Date(b.startedAt), cell: (c) => <span className="text-xs text-muted-foreground">{format(parseISO(c.startedAt), "MMM d, h:mm a")}</span> },
    { key: "actions", header: "", cell: () => <Button variant="ghost" size="sm"><Flag className="h-3.5 w-3.5" /></Button> },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Logs"
        description="Review conversations, confidence scores, and escalations"
        actions={<Button variant="outline" className="gap-1.5"><FileDown className="h-4 w-4" /> Export logs</Button>}
      />
      <DataTable
        data={aiConversations as unknown as Row[]}
        columns={cols}
        searchKeys={["patient","topic","status"] as (keyof Row)[]}
        toolbar={<Button variant="outline" size="sm" className="gap-1.5"><Bot className="h-4 w-4" /> Review queue</Button>}
        pageSize={10}
      />
    </div>
  );
}
