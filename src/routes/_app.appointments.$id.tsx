import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { appointments, getPatient } from "@/lib/mock";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/_app/appointments/$id")({
  loader: ({ params }) => {
    const a = appointments.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { appt: a };
  },
  component: ApptDetail,
});

function ApptDetail() {
  const { appt } = Route.useLoaderData();
  const p = getPatient(appt.patientId);
  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" asChild className="w-fit gap-1">
        <Link to="/appointments"><ChevronLeft className="h-4 w-4" /> Appointments</Link>
      </Button>
      <PageHeader
        title={`${appt.service} · ${appt.patient}`}
        description={`${format(parseISO(appt.startAt), "EEE, MMM d · h:mm a")} · ${appt.therapist}`}
        actions={<StatusBadge status={appt.status} />}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Details" index={0}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Duration</dt><dd>{appt.duration} min</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Location</dt><dd>{appt.location}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Room</dt><dd>{appt.room}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{appt.type}</dd></div>
          </dl>
        </SectionCard>
        <SectionCard title="Patient" index={1}>
          {p && <Link to="/emr/$id" params={{ id: p.id }} className="text-sm text-primary hover:underline">→ Open EMR</Link>}
        </SectionCard>
        <SectionCard title="Consent" index={2}>
          <Link to="/emr/consent" className="text-sm text-primary hover:underline">→ View consent forms</Link>
        </SectionCard>
      </div>
    </div>
  );
}