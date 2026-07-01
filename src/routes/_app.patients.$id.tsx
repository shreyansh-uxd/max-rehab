import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Activity, ArrowLeft, CalendarDays, FileText, MessageSquare, Phone, Pill, Stethoscope, TrendingDown, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { patients, appointments, invoices, documents } from "@/lib/mock";
import { format, parseISO } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_app/patients/$id")({
  loader: ({ params }) => {
    const patient = patients.find((p) => p.id === params.id);
    if (!patient) throw notFound();
    return { patient };
  },
  component: PatientDetail,
  notFoundComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Patient not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm text-destructive">{error.message}</div>,
});

const painSeries = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  pain: Math.max(1, 8 - Math.round(i * 0.5 + Math.sin(i) * 0.6)),
  mobility: Math.min(100, 30 + i * 5 + Math.round(Math.sin(i) * 4)),
}));

function PatientDetail() {
  const { patient } = Route.useLoaderData();
  const apps = appointments.filter((a) => a.patientId === patient.id).concat(appointments.slice(0, 3));
  const inv = invoices.filter((i) => i.patientId === patient.id).concat(invoices.slice(0, 2));
  const docs = documents.filter((d) => d.patientId === patient.id).concat(documents.slice(0, 3));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={patient.name}
        description={`${patient.condition} · ${patient.age} yrs · ${patient.gender}`}
        breadcrumb={
          <Link to="/patients" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> All patients
          </Link>
        }
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><MessageSquare className="h-4 w-4" /> Message</Button>
            <Button variant="outline" className="gap-1.5"><Phone className="h-4 w-4" /> Call</Button>
            <Button className="gap-1.5"><CalendarDays className="h-4 w-4" /> Book</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <SectionCard bodyClassName="p-5" index={0}>
            <div className="flex items-center gap-4">
              <AvatarInitials name={patient.name} size={64} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{patient.name}</p>
                <p className="text-xs text-muted-foreground">Patient ID · {patient.id}</p>
                <div className="mt-2"><StatusBadge status={patient.status} /></div>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Field label="Email" value={patient.email} full />
              <Field label="Phone" value={patient.phone} full />
              <Field label="Age" value={`${patient.age}`} />
              <Field label="Gender" value={patient.gender} />
              <Field label="Insurance" value={patient.insurance} full />
              <Field label="Address" value={patient.address} full />
              <Field label="Joined" value={format(parseISO(patient.joined), "MMM d, yyyy")} full />
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {patient.tags.map((t: string) => (
                <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{t}</span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recovery snapshot" index={1}>
            <div className="space-y-3">
              <Snapshot icon={Activity} label="Adherence" value={`${patient.adherence}%`} bar={patient.adherence} />
              <Snapshot icon={TrendingDown} label="Pain (0–10)" value={`${patient.pain}`} bar={patient.pain * 10} />
              <Snapshot icon={Stethoscope} label="Assigned therapist" value={patient.therapist} />
              <Snapshot icon={CalendarDays} label="Next visit" value={format(parseISO(patient.nextVisit), "MMM d, h:mm a")} />
            </div>
          </SectionCard>
        </div>

        <SectionCard className="lg:col-span-1" bodyClassName="p-0" index={2}>
          <Tabs defaultValue="overview" className="w-full">
            <div className="scrollbar-thin overflow-x-auto">
              <TabsList className="m-3 w-fit">
                {["overview","medical","plan","appointments","exercises","progress","messages","documents","billing"].map((t) => (
                  <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="px-5 pb-5">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Treatment goal</p>
                    <p className="mt-2 text-sm">Full return to recreational running within 12 weeks with sustained pain &lt; 2/10.</p>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Programme</p>
                    <p className="mt-2 text-sm font-medium">Post-ACL Recovery (8 wk)</p>
                    <Progress value={62} className="mt-2 h-1.5" />
                    <p className="mt-1 text-xs text-muted-foreground">Week 5 of 8 · 62% complete</p>
                  </div>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm font-semibold">Recovery trend</p>
                  <div className="mt-2 h-56">
                    <ResponsiveContainer>
                      <AreaChart data={painSeries} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                        <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                        <defs>
                          <linearGradient id="mob" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1F5FFF" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#1F5FFF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area dataKey="mobility" stroke="#1F5FFF" strokeWidth={2.4} fill="url(#mob)" />
                        <Area dataKey="pain" stroke="#F26A3E" strokeWidth={2} fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-3 text-sm">
                <Item icon={Pill} title="Allergies" body="None reported" />
                <Item icon={Stethoscope} title="Previous surgeries" body="Right ACL reconstruction · Jan 2024" />
                <Item icon={FileText} title="Medical history" body="No cardiac history. Mild hypertension controlled with diet. Past injury: 2019 left ankle sprain." />
                <Item icon={Pill} title="Current medications" body="Ibuprofen 200mg as needed · Vitamin D" />
              </TabsContent>

              <TabsContent value="plan" className="space-y-3 text-sm">
                <Item icon={Stethoscope} title="Diagnosis" body="Post-operative ACL reconstruction · phase III rehabilitation." />
                <Item icon={Activity} title="Plan" body="Strength + neuromuscular training 3x/week, hydrotherapy weekly, gradual return-to-sport protocol from week 7." />
              </TabsContent>

              <TabsContent value="appointments" className="space-y-2">
                {apps.slice(0, 6).map((a) => (
                  <div key={a.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border p-3">
                    <div className="grid h-10 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                      <div className="text-center text-[10px] leading-tight">
                        <p>{format(parseISO(a.start), "MMM")}</p>
                        <p className="text-sm font-bold">{format(parseISO(a.start), "d")}</p>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.service}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.therapist} · {format(parseISO(a.start), "h:mm a")} · {a.duration}m</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="exercises" className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {["Hamstring Curls","Single-Leg Squats","Glute Bridges","Step-Ups","Calf Raises","Plank Holds"].map((e) => (
                  <div key={e} className="rounded-xl border p-3">
                    <p className="text-sm font-semibold">{e}</p>
                    <p className="text-xs text-muted-foreground">3 sets · 12 reps · video included</p>
                    <Progress value={50 + Math.round(Math.random() * 50)} className="mt-2 h-1.5" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="progress" className="rounded-2xl border p-4">
                <p className="text-sm font-semibold">Weekly milestones</p>
                <ol className="mt-3 space-y-3 text-sm">
                  {["Full knee extension achieved","Pain &lt; 4/10 sustained","Light jogging cleared","Single-leg hop test passed"].map((m, i) => (
                    <li key={m} className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${i < 2 ? "bg-success" : "bg-muted"}`} />
                      <span className={i < 2 ? "" : "text-muted-foreground"} dangerouslySetInnerHTML={{ __html: m }} />
                    </li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="messages" className="space-y-3">
                {[
                  { who: "Dr. Khan", msg: "How is the knee feeling after yesterday's session?", time: "10:24 AM", mine: false },
                  { who: "You", msg: "Bit sore but mobility is improving. Did the icing protocol.", time: "10:31 AM", mine: true },
                  { who: "Dr. Khan", msg: "Good. Continue strength block this week, hydrotherapy Friday.", time: "10:32 AM", mine: false },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${m.mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p>{m.msg}</p>
                      <p className={`mt-1 text-[10px] ${m.mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="documents" className="space-y-2">
                {docs.slice(0, 6).map((d) => (
                  <div key={d.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.type} · {d.size} · {format(parseISO(d.uploaded), "MMM d, yyyy")}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="billing" className="space-y-2">
                {inv.slice(0, 6).map((i) => (
                  <div key={i.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-4 rounded-xl border p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-success/10 text-success"><Wallet className="h-4 w-4" /></div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{i.id}</p>
                      <p className="truncate text-xs text-muted-foreground">Issued {format(parseISO(i.issued), "MMM d")} · {i.method}</p>
                    </div>
                    <p className="text-sm font-semibold">${i.amount}</p>
                    <StatusBadge status={i.status} />
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

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm">{value}</dd>
    </div>
  );
}

function Snapshot({ icon: Icon, label, value, bar }: { icon: any; label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      {typeof bar === "number" ? <Progress value={bar} className="mt-2 h-1.5" /> : null}
    </div>
  );
}

function Item({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border p-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
