import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, Search, Activity, Hand, MessageSquare,
  Brain, Dumbbell, Car, Video, CalendarCheck2, PartyPopper,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { WizardStepper } from "@/components/shared/wizard-stepper";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { patients, therapists, clinics, bookableServices, slotsForDate, NOW } from "@/lib/mock";
import { addDays, format } from "date-fns";

export const Route = createFileRoute("/_app/appointments/new")({
  head: () => ({ meta: [{ title: "Book Appointment · Max Rehab" }] }),
  component: NewAppointment,
});

interface State {
  step: number;
  patientId?: string;
  serviceId?: string;
  therapistId?: string;
  clinicId?: string;
  room?: string;
  date?: string;
  time?: string;
  notes?: string;
  requireConsent: boolean;
}
const initial: State = { step: 0, requireConsent: true };
type Action = { type: "set"; patch: Partial<State> } | { type: "next" } | { type: "prev" } | { type: "goto"; step: number };
function reducer(s: State, a: Action): State {
  if (a.type === "set") return { ...s, ...a.patch };
  if (a.type === "next") return { ...s, step: Math.min(8, s.step + 1) };
  if (a.type === "prev") return { ...s, step: Math.max(0, s.step - 1) };
  return { ...s, step: a.step };
}

const steps = [
  { label: "Patient" }, { label: "Service" }, { label: "Therapist" },
  { label: "Clinic" }, { label: "Date" }, { label: "Time" },
  { label: "Details" }, { label: "Review" }, { label: "Done" },
];

const iconFor: Record<string, any> = { activity: Activity, hand: Hand, message: MessageSquare, brain: Brain, dumbbell: Dumbbell, car: Car, video: Video };

function NewAppointment() {
  const [s, dispatch] = useReducer(reducer, initial);
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === s.patientId);
  const service = bookableServices.find((x) => x.id === s.serviceId);
  const therapist = therapists.find((t) => t.id === s.therapistId);
  const clinic = clinics.find((c) => c.id === s.clinicId);

  const canNext =
    (s.step === 0 && !!s.patientId) ||
    (s.step === 1 && !!s.serviceId) ||
    (s.step === 2 && !!s.therapistId) ||
    (s.step === 3 && !!s.clinicId && !!s.room) ||
    (s.step === 4 && !!s.date) ||
    (s.step === 5 && !!s.time) ||
    (s.step === 6) ||
    (s.step === 7) ||
    (s.step === 8);

  const dates = Array.from({ length: 14 }).map((_, i) => addDays(NOW, i));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Book an appointment"
        description="Complete each step to schedule and notify the patient."
        breadcrumb={<Link to="/appointments" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ChevronLeft className="h-3 w-3" /> Appointments</Link>}
      />
      <SectionCard index={0}>
        <WizardStepper steps={steps} current={s.step} />
      </SectionCard>

      <AnimatePresence mode="wait">
        <motion.div key={s.step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {s.step === 0 && (
            <SectionCard title="Select patient" index={0}>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search patients…" className="pl-9" />
              </div>
              <ul className="max-h-80 divide-y overflow-auto rounded-xl border">
                {patients.slice(0, 12).map((p) => (
                  <li key={p.id} onClick={() => dispatch({ type: "set", patch: { patientId: p.id } })}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-muted/40 ${s.patientId === p.id ? "bg-primary/5" : ""}`}>
                    <AvatarInitials name={p.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.condition} · {p.therapist}</p>
                    </div>
                    {s.patientId === p.id && <Check className="h-4 w-4 text-primary" />}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
          {s.step === 1 && (
            <SectionCard title="Choose a service" index={0}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bookableServices.map((sv) => {
                  const Icon = iconFor[sv.icon] ?? Activity;
                  return (
                    <button key={sv.id} onClick={() => dispatch({ type: "set", patch: { serviceId: sv.id } })}
                      className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 ${s.serviceId === sv.id ? "border-primary/60 bg-primary/5" : ""}`}>
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="mt-2 text-sm font-semibold">{sv.name}</p>
                      <p className="text-xs text-muted-foreground">{sv.duration} min · ${sv.price}</p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          )}
          {s.step === 2 && (
            <SectionCard title="Choose therapist" index={0}>
              <div className="grid gap-3 md:grid-cols-2">
                {therapists.slice(0, 8).map((t) => (
                  <button key={t.id} onClick={() => dispatch({ type: "set", patch: { therapistId: t.id } })}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all hover:border-primary/40 ${s.therapistId === t.id ? "border-primary/60 bg-primary/5" : ""}`}>
                    <AvatarInitials name={t.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.specialty} · {t.experience}y · Workload {t.workload}%</p>
                    </div>
                    <span className="text-xs font-medium text-success">{t.availability}</span>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}
          {s.step === 3 && (
            <SectionCard title="Clinic & room" index={0}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Clinic</p>
                  <div className="space-y-2">
                    {clinics.map((c) => (
                      <button key={c.id} onClick={() => dispatch({ type: "set", patch: { clinicId: c.id, room: undefined } })}
                        className={`w-full rounded-xl border p-3 text-left ${s.clinicId === c.id ? "border-primary/60 bg-primary/5" : ""}`}>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.rooms.length} rooms</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Room</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(clinic?.rooms ?? []).map((r) => (
                      <button key={r} onClick={() => dispatch({ type: "set", patch: { room: r } })}
                        className={`rounded-lg border py-2 text-xs font-medium ${s.room === r ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/30"}`}>
                        {r}
                      </button>
                    ))}
                    {!clinic && <p className="col-span-3 text-xs text-muted-foreground">Choose a clinic first.</p>}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
          {s.step === 4 && (
            <SectionCard title="Select date" index={0}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
                {dates.map((d) => {
                  const iso = d.toISOString();
                  const active = s.date === iso;
                  return (
                    <button key={iso} onClick={() => dispatch({ type: "set", patch: { date: iso } })}
                      className={`rounded-xl border p-2 text-center ${active ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/30"}`}>
                      <p className="text-[10px] uppercase text-muted-foreground">{format(d, "EEE")}</p>
                      <p className="text-lg font-bold">{format(d, "d")}</p>
                      <p className="text-[10px] text-muted-foreground">{format(d, "MMM")}</p>
                    </button>
                  );
                })}
              </div>
            </SectionCard>
          )}
          {s.step === 5 && (
            <SectionCard title="Choose time" description={s.date && format(new Date(s.date), "EEEE, MMM d")} index={0}>
              {slotsForDate(s.date ?? NOW.toISOString()).map((g) => (
                <div key={g.period} className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{g.period}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.slots.map((t) => (
                      <button key={t} onClick={() => dispatch({ type: "set", patch: { time: t } })}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${s.time === t ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/30"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </SectionCard>
          )}
          {s.step === 6 && (
            <SectionCard title="Appointment details" index={0}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Duration (min)</p>
                  <Input defaultValue={service?.duration ?? 45} type="number" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Insurance</p>
                  <Input defaultValue={patient?.insurance ?? "Self-Pay"} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Notes / special requirements</p>
                <Textarea rows={4} placeholder="e.g. Patient uses walking aid, allergic to latex…" onChange={(e) => dispatch({ type: "set", patch: { notes: e.target.value } })} />
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={s.requireConsent} onChange={(e) => dispatch({ type: "set", patch: { requireConsent: e.target.checked } })} />
                Send consent form automatically
              </label>
            </SectionCard>
          )}
          {s.step === 7 && (
            <SectionCard title="Review" description="Confirm details before booking." index={0}>
              <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Patient</dt><dd className="font-semibold">{patient?.name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Service</dt><dd className="font-semibold">{service?.name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Therapist</dt><dd className="font-semibold">{therapist?.name}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Clinic</dt><dd className="font-semibold">{clinic?.name} · {s.room}</dd></div>
                <div><dt className="text-xs text-muted-foreground">When</dt><dd className="font-semibold">{s.date && format(new Date(s.date), "EEE, MMM d")} · {s.time}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Consent</dt><dd className="font-semibold">{s.requireConsent ? "Auto-send" : "Not required"}</dd></div>
              </dl>
            </SectionCard>
          )}
          {s.step === 8 && (
            <SectionCard index={0}>
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                  <CalendarCheck2 className="h-8 w-8" />
                </motion.div>
                <h2 className="text-xl font-semibold">Appointment booked</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  {patient?.name} has been notified. {s.requireConsent && "Consent form automatically sent."}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" onClick={() => navigate({ to: "/appointments" })}>Back to schedule</Button>
                  <Button className="gap-1.5" onClick={() => window.location.reload()}><PartyPopper className="h-4 w-4" /> Book another</Button>
                </div>
              </div>
            </SectionCard>
          )}
        </motion.div>
      </AnimatePresence>

      {s.step < 8 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button variant="ghost" onClick={() => dispatch({ type: "prev" })} disabled={s.step === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button onClick={() => dispatch({ type: "next" })} disabled={!canNext}>
            {s.step === 7 ? "Confirm booking" : "Continue"} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}