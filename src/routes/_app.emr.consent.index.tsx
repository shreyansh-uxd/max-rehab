import { createFileRoute, Link } from "@tanstack/react-router";
import { Send, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared/section-card";
import { consentForms, type ConsentStatus } from "@/lib/mock";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, XCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/emr/consent/")({
  head: () => ({ meta: [{ title: "Consent Forms · EMR · Max Rehab" }] }),
  component: ConsentHub,
});

function ConsentHub() {
  const groups: { key: ConsentStatus; label: string }[] = [
    { key: "Signed", label: "Signed" },
    { key: "Pending", label: "Pending" },
    { key: "Expired", label: "Expired" },
    { key: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Consent Management"
        description="Digital consent forms across every patient and appointment."
        actions={
          <>
            <Button variant="outline" asChild className="gap-1.5"><Link to="/emr/templates"><Plus className="h-4 w-4" /> Templates</Link></Button>
            <Button className="gap-1.5"><Send className="h-4 w-4" /> Send consent</Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Signed" value={consentForms.filter((c) => c.status === "Signed").length} icon={CheckCircle2} accent="success" index={0} />
        <StatCard label="Pending" value={consentForms.filter((c) => c.status === "Pending").length} icon={Clock} accent="info" index={1} />
        <StatCard label="Expired" value={consentForms.filter((c) => c.status === "Expired").length} icon={AlertTriangle} accent="warning" index={2} />
        <StatCard label="Rejected" value={consentForms.filter((c) => c.status === "Rejected").length} icon={XCircle} accent="warning" index={3} />
      </div>
      <Tabs defaultValue="Signed">
        <TabsList>
          {groups.map((g) => <TabsTrigger key={g.key} value={g.key}>{g.label}</TabsTrigger>)}
        </TabsList>
        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key} className="mt-4">
            <SectionCard title={`${g.label} consents`} description={`${consentForms.filter((c) => c.status === g.key).length} forms`} index={0} bodyClassName="p-0">
              <ul className="divide-y">
                {consentForms.filter((c) => c.status === g.key).slice(0, 10).map((c) => (
                  <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.template}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.patient} · {c.version} · Sent {format(parseISO(c.sentAt), "MMM d, yyyy")}
                        {c.signedAt && <> · Signed {format(parseISO(c.signedAt), "MMM d")}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} />
                      <Button size="sm" variant="outline" asChild><Link to="/emr/consent/$id" params={{ id: c.id }}>Open</Link></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}