import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Send } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/emr/templates")({
  head: () => ({ meta: [{ title: "Consent Templates · Max Rehab" }] }),
  component: TemplatesPage,
});

const templates = [
  { name: "General Treatment Consent", version: "v3.2", uses: 128, updated: "5 days ago" },
  { name: "Home Visit Authorization", version: "v2.1", uses: 41, updated: "2 weeks ago" },
  { name: "Photography & Media Release", version: "v1.4", uses: 22, updated: "1 month ago" },
  { name: "Telehealth Consent", version: "v2.0", uses: 76, updated: "3 days ago" },
  { name: "Data Sharing – Insurance", version: "v1.9", uses: 55, updated: "1 week ago" },
  { name: "Manual Therapy Consent", version: "v1.3", uses: 88, updated: "4 days ago" },
  { name: "Minor Treatment Consent", version: "v2.2", uses: 17, updated: "3 weeks ago" },
];

function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Consent Templates"
        description="Manage reusable consent forms sent to patients before appointments."
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> New template</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t, i) => (
          <SectionCard key={t.name} title={<span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {t.name}</span>} action={<Badge variant="outline">{t.version}</Badge>} index={i}>
            <p className="text-xs text-muted-foreground">Used {t.uses} times · Updated {t.updated}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline">Preview</Button>
              <Button size="sm" className="gap-1.5"><Send className="h-3.5 w-3.5" /> Assign</Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}