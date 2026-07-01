import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  CalendarPlus, Upload, FileSignature, Activity, Printer, Share2,
  ChevronLeft, ClipboardList, HeartPulse, Pill, Stethoscope, ShieldCheck,
  FileText, MessageSquare, Sparkles, TrendingUp, Target, Home, Dumbbell,
  CreditCard, ScrollText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { SectionCard } from "@/components/shared/section-card";
import { TimelineList } from "@/components/shared/timeline-list";
import { FolderGrid } from "@/components/shared/folder-grid";
import { RecordShell } from "@/components/shared/record-shell";
import {
  getPatient, getMedicalRecord, getTreatmentPlan, notesFor, assessmentsFor,
  documentsFor, consentsFor, appointmentsFor, homeVisitsFor, activityFor,
  invoicesFor, documentFolders,
} from "@/lib/mock";
import { format, parseISO } from "date-fns";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_app/emr/$id")({
  loader: ({ params }) => {
    const p = getPatient(params.id);
    if (!p) throw notFound();
    return { patient: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.patient.name} · EMR` },
      { name: "description", content: `Electronic medical record for ${loaderData?.patient.name}.` },
    ],
  }),
  component: EMRDetail,
});

function EMRDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const p = getPatient(id)!;
  const r = getMedicalRecord(id);
  const plan = getTreatmentPlan(id);
  const notes = notesFor(id);
  const assessData = assessmentsFor(id);
  const docs = documentsFor(id);
  const consents = consentsFor(id);
  const appts = appointmentsFor(id);
  const visits = homeVisitsFor(id);
  const feed = activityFor(id);
  const bills = invoicesFor(id);
  const [folder, setFolder] = useState<string | undefined>();

  const chart = assessData.map((a) => ({
    date: format(parseISO(a.date), "MMM d"),
    pain: a.pain,
    rom: a.romShoulder,
    strength: a.strength * 20,
    outcome: a.outcomeScore,
  }));

  const folders = documentFolders.map((name) => {
    const list = docs.filter((d) => d.folder === name);
    return { name, count: list.length, ocr: list.filter((d) => d.ocr).length };
  });

  const activityItems = feed.map((e) => ({
    id: e.id,
    icon: e.kind === "appointment" ? Stethoscope
        : e.kind === "message" ? MessageSquare
        : e.kind === "document" ? FileText
        : e.kind === "assessment" ? Activity
        : e.kind === "consent" ? ShieldCheck
        : e.kind === "ai" ? Sparkles
        : ScrollText,
    title: e.title,
    description: e.description,
    at: e.at,
    actor: e.actor,
    tone: "primary" as const,
  }));

  const header = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/emr/records"><ChevronLeft className="h-4 w-4" /> Records</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => navigate({ to: "/appointments/new" })} className="gap-1.5">
            <CalendarPlus className="h-4 w-4" /> Book appointment
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><FileSignature className="h-4 w-4" /> Add note</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Activity className="h-4 w-4" /> Assessment</Button>
          <Button size="sm" variant="ghost" className="gap-1.5"><Printer className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" className="gap-1.5"><Share2 className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <AvatarInitials name={p.name} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{p.name}</h1>
            <StatusBadge status={p.status} />
            <Badge variant="outline">{r.mrn}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.age}y · {p.gender} · <span className="text-foreground font-medium">{r.primaryDiagnosis}</span> · Assigned to {p.therapist} · Stage <span className="text-primary font-semibold">{r.recoveryStage}</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6 rounded-2xl border bg-card px-5 py-3 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Recovery</p>
            <p className="mt-0.5 text-lg font-bold text-primary">{r.recoveryScore}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Adherence</p>
            <p className="mt-0.5 text-lg font-bold">{p.adherence}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pain</p>
            <p className="mt-0.5 text-lg font-bold">{p.pain}/10</p>
          </div>
        </div>
      </div>
    </div>
  );

  const sidebar = (
    <>
      <SectionCard title="Vitals & profile" index={0}>
        <dl className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["DOB", format(parseISO(r.dob), "MMM d, yyyy")],
            ["Blood", r.bloodType],
            ["Height", r.height],
            ["Weight", r.weight],
            ["BMI", r.bmi],
            ["Insurance", p.insurance],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-lg bg-muted/40 p-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">{v as string}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
      <SectionCard title="Emergency contact" index={1}>
        <p className="text-sm font-semibold">{r.emergency.name}</p>
        <p className="text-xs text-muted-foreground">{r.emergency.relation} · {r.emergency.phone}</p>
      </SectionCard>
      <SectionCard title="Quick links" index={2}>
        <div className="flex flex-col gap-2 text-sm">
          <Link className="text-primary hover:underline" to="/patients/$id" params={{ id }}>→ Patient profile</Link>
          <Link className="text-primary hover:underline" to="/appointments">→ Appointments</Link>
          <Link className="text-primary hover:underline" to="/emr/consent">→ Consent hub</Link>
          <Link className="text-primary hover:underline" to="/billing">→ Billing</Link>
        </div>
      </SectionCard>
    </>
  );

  return (
    <RecordShell header={header} sidebar={sidebar}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {[
            ["overview","Overview"],["history","Medical History"],["notes","Clinical Notes"],
            ["assessments","Assessments"],["plan","Treatment Plan"],["appointments","Appointments"],
            ["home","Home Visits"],["exercises","Exercise Plans"],["documents","Documents"],
            ["consent","Consent"],["billing","Billing"],["activity","Activity"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard className="lg:col-span-2" title="Recovery trend" description="Pain, ROM, strength, outcome" index={0}>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={chart}>
                    <defs>
                      <linearGradient id="rec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="outcome" stroke="#1F5FFF" fill="url(#rec)" strokeWidth={2.4} />
                    <Area type="monotone" dataKey="rom" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                    <Area type="monotone" dataKey="strength" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
            <SectionCard title="Upcoming" index={1}>
              <div className="space-y-3">
                {appts.slice(0, 3).map((a) => (
                  <Link key={a.id} to="/appointments/$id" params={{ id: a.id }} className="block rounded-xl border p-3 hover:border-primary/40">
                    <p className="text-xs text-muted-foreground">{format(parseISO(a.start), "EEE, MMM d · h:mm a")}</p>
                    <p className="text-sm font-semibold">{a.service}</p>
                    <p className="text-xs text-muted-foreground">{a.therapist} · {a.type}</p>
                  </Link>
                ))}
              </div>
            </SectionCard>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Latest therapist note" index={0}>
              <p className="text-xs font-semibold text-primary">{notes[0]?.type} · {notes[0]?.author}</p>
              <p className="mt-1 text-sm">{notes[0]?.plan ?? notes[0]?.body}</p>
            </SectionCard>
            <SectionCard title="Outstanding tasks" index={1}>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-warning-foreground" /> Consent for Home Visit expires soon</li>
                <li className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-info" /> 4-week re-assessment due</li>
                <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> MRI report awaiting review</li>
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Diagnoses" index={0}>
              <p className="text-sm"><span className="font-semibold text-primary">Primary:</span> {r.primaryDiagnosis}</p>
              {r.secondaryDiagnoses.map((d) => <p key={d} className="text-sm">Secondary: {d}</p>)}
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Chronic conditions</p>
                <div className="mt-1 flex flex-wrap gap-1">{r.chronicConditions.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
              </div>
            </SectionCard>
            <SectionCard title="Allergies & meds" index={1}>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Allergies</p>
              <div className="mt-1 flex flex-wrap gap-1">{r.allergies.map((a) => <Badge key={a} variant="destructive">{a}</Badge>)}</div>
              <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Medications</p>
              <ul className="mt-1 space-y-1.5 text-sm">
                {r.medications.map((m) => (
                  <li key={m.name} className="flex items-center gap-2"><Pill className="h-3.5 w-3.5 text-primary" /> {m.name} — {m.dose}, {m.freq}</li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title="Surgical history" index={2}>
              {r.surgeries.length ? r.surgeries.map((s) => (
                <div key={s.name} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{format(parseISO(s.date), "MMM d, yyyy")} · {s.surgeon} · {s.hospital}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground">No surgical history recorded.</p>}
            </SectionCard>
            <SectionCard title="Family & lifestyle" index={3}>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Family history</p>
              <p className="text-sm">{r.familyHistory.join(" · ")}</p>
              <p className="mt-3 text-xs font-semibold uppercase text-muted-foreground">Lifestyle</p>
              <dl className="mt-1 grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Smoking</dt><dd>{r.lifestyle.smoking}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Alcohol</dt><dd>{r.lifestyle.alcohol}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Activity</dt><dd>{r.lifestyle.activity}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Occupation</dt><dd>{r.lifestyle.occupation}</dd></div>
              </dl>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4 space-y-3">
          {notes.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <SectionCard
                title={<span className="flex items-center gap-2">{n.type} · {n.title} <Badge variant="outline">v{n.version}</Badge></span>}
                description={`${n.author} · ${format(parseISO(n.date), "MMM d, yyyy")}`}
                action={<Button variant="ghost" size="sm">History</Button>}
                index={i}
              >
                {n.type === "SOAP" ? (
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    <div><p className="text-xs font-semibold text-primary">Subjective</p><p>{n.subjective}</p></div>
                    <div><p className="text-xs font-semibold text-primary">Objective</p><p>{n.objective}</p></div>
                    <div><p className="text-xs font-semibold text-primary">Assessment</p><p>{n.assessment}</p></div>
                    <div><p className="text-xs font-semibold text-primary">Plan</p><p>{n.plan}</p></div>
                  </div>
                ) : <p className="text-sm">{n.body}</p>}
              </SectionCard>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="assessments" className="mt-4">
          <SectionCard title="Functional trend" description="Pain / ROM / Strength / Outcome" index={0}>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={chart}>
                  <CartesianGrid strokeDasharray="3 6" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="pain" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="rom" stroke="#22c55e" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="strength" stroke="#f59e0b" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="outcome" stroke="#1F5FFF" fill="transparent" strokeWidth={2.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
          <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>{["Date","Pain","ROM Sh","ROM Kn","Strength","Mobility","Outcome"].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {assessData.slice().reverse().map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="px-3 py-2">{format(parseISO(a.date), "MMM d, yyyy")}</td>
                    <td className="px-3 py-2">{a.pain}/10</td>
                    <td className="px-3 py-2">{a.romShoulder}°</td>
                    <td className="px-3 py-2">{a.romKnee}°</td>
                    <td className="px-3 py-2">{a.strength}/5</td>
                    <td className="px-3 py-2">{a.mobility}</td>
                    <td className="px-3 py-2 font-semibold">{a.outcomeScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title={<span className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Goals</span>} index={0}>
              <ul className="space-y-3">
                {plan.goals.map((g, i) => (
                  <li key={i}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{g.text}</span>
                      <span className="text-xs text-muted-foreground">Target: {g.target}</span>
                    </div>
                    <Progress value={g.progress} className="mt-1.5 h-1.5" />
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title={<span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Milestones</span>} description={`Programme: ${plan.programme}`} index={1}>
              <ol className="relative space-y-3 border-l-2 border-border pl-4">
                {plan.milestones.map((m, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 ${m.done ? "border-primary bg-primary" : "border-border bg-background"}`} />
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-muted-foreground">Due {format(parseISO(m.due), "MMM d, yyyy")} {m.done && "· Completed"}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>{["Date","Service","Therapist","Type","Status",""].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {appts.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-3 py-2">{format(parseISO(a.start), "MMM d, yyyy · h:mm a")}</td>
                    <td className="px-3 py-2">{a.service}</td>
                    <td className="px-3 py-2 text-muted-foreground">{a.therapist}</td>
                    <td className="px-3 py-2">{a.type}</td>
                    <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="ghost" asChild><Link to="/appointments/$id" params={{ id: a.id }}>Open</Link></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="home" className="mt-4 space-y-3">
          {visits.length === 0 && <p className="text-sm text-muted-foreground">No home visits scheduled.</p>}
          {visits.map((v, i) => (
            <SectionCard key={v.id} title={<span className="flex items-center gap-2"><Home className="h-4 w-4 text-primary" /> {v.treatment}</span>} description={`${format(parseISO(v.date), "MMM d · h:mm a")} · ${v.duration}m`} action={<StatusBadge status={v.status} />} index={i}>
              <p className="text-sm">{v.notes}</p>
              <p className="mt-2 text-xs text-muted-foreground">Therapist: {v.therapist} · Address: {v.address}</p>
            </SectionCard>
          ))}
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          <SectionCard title={<span className="flex items-center gap-2"><Dumbbell className="h-4 w-4 text-primary" /> {plan.programme}</span>} description="Assigned recovery programme" index={0}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Wall Slides","Banded Rows","Terminal Knee Ext","Bird Dog","Glute Bridge","Single-Leg Balance"].map((e, i) => (
                <div key={e} className="rounded-xl border p-3">
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-muted grid place-items-center text-xs text-muted-foreground">Exercise video</div>
                  <p className="mt-2 text-sm font-semibold">{e}</p>
                  <p className="text-xs text-muted-foreground">3 × 12 · {["Easy","Moderate","Hard"][i % 3]}</p>
                  <Progress value={60 + i * 6} className="mt-2 h-1.5" />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="documents" className="mt-4 space-y-4">
          <FolderGrid folders={folders} activeName={folder} onSelect={(n) => setFolder(n === folder ? undefined : n)} />
          <SectionCard title={folder ? `${folder} — ${docs.filter((d) => d.folder === folder).length} files` : "All documents"} index={0} bodyClassName="p-0">
            <ul className="divide-y">
              {(folder ? docs.filter((d) => d.folder === folder) : docs).slice(0, 12).map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/30">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">v{d.version} · {d.size} · {d.uploadedBy} · {format(parseISO(d.uploaded), "MMM d")}</p>
                  </div>
                  {d.ocr && <Badge variant="secondary" className="text-[10px]">OCR</Badge>}
                  <Button size="sm" variant="ghost" asChild><span>Open</span></Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="consent" className="mt-4 space-y-3">
          {consents.map((c, i) => (
            <SectionCard
              key={c.id}
              title={<span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> {c.template}</span>}
              description={`${c.version} · Sent ${format(parseISO(c.sentAt), "MMM d, yyyy")}`}
              action={<StatusBadge status={c.status} />}
              index={i}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Witness: {c.witness} · Rep: {c.representative}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/emr/consent/$id" params={{ id: c.id }}>Open consent</Link>
                </Button>
              </div>
            </SectionCard>
          ))}
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <SectionCard title={<span className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Invoices</span>} index={0} bodyClassName="p-0">
            <ul className="divide-y">
              {bills.map((b) => (
                <li key={b.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{b.id}</p>
                    <p className="text-xs text-muted-foreground">Issued {format(parseISO(b.issued), "MMM d")} · {b.method}</p>
                  </div>
                  <span className="font-semibold">${b.amount}</span>
                  <StatusBadge status={b.status} />
                  <Button variant="ghost" size="sm" asChild><span>Open</span></Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <TimelineList items={activityItems} />
        </TabsContent>
      </Tabs>

      {/* silence unused */}
      <span className="hidden"><HeartPulse /></span>
    </RecordShell>
  );
}