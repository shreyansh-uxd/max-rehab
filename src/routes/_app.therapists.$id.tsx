import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Mail, Phone, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { therapists, patients, appointments } from "@/lib/mock";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/_app/therapists/$id")({
  loader: ({ params }) => {
    const t = therapists.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return { therapist: t };
  },
  component: Detail,
  notFoundComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Therapist not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-destructive">{error.message}</div>,
});

function Detail() {
  const { therapist } = Route.useLoaderData();
  const assigned = patients.filter((p) => p.therapistId === therapist.id).slice(0, 8);
  const apps = appointments.filter((a) => a.therapistId === therapist.id).slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={therapist.name}
        description={`${therapist.title} · ${therapist.specialty}`}
        breadcrumb={
          <Link to="/therapists" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> All therapists
          </Link>
        }
        actions={<Button>Assign patients</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard index={0}>
          <div className="flex items-center gap-4">
            <AvatarInitials name={therapist.name} size={64} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{therapist.name}</p>
              <p className="text-xs text-muted-foreground">{therapist.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge status={therapist.availability} />
                <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star className="h-3 w-3 fill-warning text-warning" /> {therapist.rating.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {therapist.email}</li>
            <li className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {therapist.phone}</li>
            <li className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {therapist.location}</li>
          </ul>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-sm font-semibold">{therapist.patients}</p><p className="text-[10px] text-muted-foreground">Patients</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-sm font-semibold">{therapist.experience}</p><p className="text-[10px] text-muted-foreground">Years</p></div>
            <div className="rounded-lg bg-muted/50 p-2"><p className="text-sm font-semibold">{therapist.workload}%</p><p className="text-[10px] text-muted-foreground">Load</p></div>
          </div>
        </SectionCard>

        <SectionCard bodyClassName="p-0" index={1}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="m-3">
              {["overview","qualifications","availability","calendar","patients","visits","performance"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
            </TabsList>
            <div className="px-5 pb-5">
              <TabsContent value="overview" className="text-sm text-muted-foreground">
                {therapist.name} is a {therapist.experience}-year veteran specialising in {therapist.specialty.toLowerCase()}. Currently managing {therapist.patients} active patients across {therapist.location}, with a 5-star satisfaction rate from {Math.round(therapist.patients * 0.7)} reviews.
              </TabsContent>
              <TabsContent value="qualifications" className="space-y-2 text-sm">
                {["BSc Physiotherapy (Hons)","MSc Sports Rehabilitation","APTA Orthopaedic Certified","Dry Needling Certification"].map((q) => (
                  <div key={q} className="rounded-xl border p-3">{q}</div>
                ))}
              </TabsContent>
              <TabsContent value="availability" className="grid grid-cols-7 gap-2 text-center text-xs">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                  <div key={d} className="rounded-xl border p-3"><p className="font-semibold">{d}</p><p className="text-muted-foreground">{i < 5 ? "08:00 – 18:00" : i === 5 ? "09:00 – 14:00" : "Off"}</p></div>
                ))}
              </TabsContent>
              <TabsContent value="calendar" className="rounded-xl border p-6 text-center text-sm text-muted-foreground">Calendar view — synced with Google & Outlook</TabsContent>
              <TabsContent value="patients" className="space-y-2">
                {assigned.map((p) => (
                  <Link key={p.id} to="/patients/$id" params={{ id: p.id }} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 hover:bg-muted/40">
                    <AvatarInitials name={p.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.condition}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </TabsContent>
              <TabsContent value="visits" className="space-y-2">
                {apps.map((a) => (
                  <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{a.patient}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.service} · {format(parseISO(a.start), "MMM d, h:mm a")}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{a.type}</span>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="performance" className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  { l: "Patient outcomes", v: 92 },
                  { l: "Punctuality", v: 97 },
                  { l: "Note completion", v: 88 },
                ].map((m) => (
                  <div key={m.l} className="rounded-xl border p-4">
                    <p className="text-xs text-muted-foreground">{m.l}</p>
                    <p className="mt-1 text-2xl font-semibold">{m.v}%</p>
                    <Progress value={m.v} className="mt-2 h-1.5" />
                  </div>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </SectionCard>
      </div>
    </div>
  );
}
