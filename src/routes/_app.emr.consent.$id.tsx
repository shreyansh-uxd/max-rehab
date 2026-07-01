import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Download, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { SignatureCard } from "@/components/shared/signature-card";
import { TimelineList } from "@/components/shared/timeline-list";
import { Button } from "@/components/ui/button";
import { consentForms, getPatient } from "@/lib/mock";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Send, FileSignature, Eye } from "lucide-react";

export const Route = createFileRoute("/_app/emr/consent/$id")({
  loader: ({ params }) => {
    const c = consentForms.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return { consent: c };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.consent.template} · Consent` }] }),
  component: ConsentDetail,
});

function ConsentDetail() {
  const { consent } = Route.useLoaderData();
  const p = getPatient(consent.patientId)!;

  const audit = [
    { id: "1", icon: Send, title: "Consent sent to patient", at: consent.sentAt, actor: consent.representative, tone: "info" as const },
    { id: "2", icon: Eye, title: "Opened in patient app", at: consent.sentAt, actor: p.name, tone: "primary" as const },
    ...(consent.signedAt ? [{ id: "3", icon: FileSignature, title: "Signed digitally", at: consent.signedAt, actor: p.name, tone: "success" as const }] : []),
    ...(consent.signedAt ? [{ id: "4", icon: CheckCircle2, title: "Stored & linked to appointment", at: consent.signedAt, actor: "System", tone: "success" as const }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="w-fit gap-1">
        <Link to="/emr/consent"><ChevronLeft className="h-4 w-4" /> Consent hub</Link>
      </Button>
      <PageHeader
        title={consent.template}
        description={`${consent.version} · Patient: ${consent.patient}`}
        actions={
          <>
            <StatusBadge status={consent.status} />
            <Button variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Download PDF</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Document preview" index={0}>
          <div className="aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-xl border bg-gradient-to-br from-muted/40 to-background p-8">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Max Rehab · Confidential</p>
            <h2 className="mt-2 text-lg font-bold">{consent.template}</h2>
            <p className="mt-3 text-xs text-muted-foreground">
              I, {consent.patient}, hereby consent to the treatment described herein.
              I acknowledge that the risks and benefits have been explained to me…
            </p>
            <div className="mt-6 space-y-2 text-xs">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-1.5 rounded bg-muted" style={{ width: `${65 + ((i * 7) % 30)}%` }} />
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-col gap-4">
          {consent.signedAt ? (
            <SignatureCard
              patientName={consent.patient}
              signedAt={consent.signedAt}
              device={consent.device}
              location={consent.location}
              ipAddress={consent.ipAddress}
            />
          ) : (
            <SectionCard title="Awaiting signature" index={0}>
              <p className="text-sm text-muted-foreground">Sent {format(parseISO(consent.sentAt), "MMM d, yyyy")}. Reminder scheduled in 24h.</p>
              <Button size="sm" className="mt-3 gap-1.5"><ShieldCheck className="h-4 w-4" /> Resend</Button>
            </SectionCard>
          )}
          <SectionCard title="Details" index={1}>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">Witness</dt><dd className="font-medium">{consent.witness}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Clinic rep</dt><dd className="font-medium">{consent.representative}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Version</dt><dd className="font-medium">{consent.version}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Expires</dt><dd className="font-medium">{format(parseISO(consent.expiresAt), "MMM d, yyyy")}</dd></div>
            </dl>
          </SectionCard>
          <SectionCard title="Linked" index={2}>
            <Link to="/emr/$id" params={{ id: consent.patientId }} className="block text-sm text-primary hover:underline">→ Patient EMR</Link>
            {consent.appointmentId && <Link to="/appointments/$id" params={{ id: consent.appointmentId }} className="block text-sm text-primary hover:underline">→ Linked appointment</Link>}
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Audit trail" index={0}>
        <TimelineList items={audit} />
      </SectionCard>
    </div>
  );
}