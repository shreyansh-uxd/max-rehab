import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Plus,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AvatarInitials } from "@/components/shared/avatar-initials";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { appointments, patients, therapists, NOW } from "@/lib/mock";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Max Rehab Admin" },
      { name: "description", content: "Executive overview of clinic operations, appointments, recovery, and AI activity." },
    ],
  }),
  component: Dashboard,
});

const adherenceData = Array.from({ length: 14 }).map((_, i) => ({
  day: format(new Date(NOW.getTime() - (13 - i) * 86400000), "MMM d"),
  adherence: 60 + Math.round(Math.sin(i / 1.6) * 12 + i),
  pain: 7 - Math.round(Math.sin(i / 2) * 1.6 + i * 0.15),
}));

const heatmap = Array.from({ length: 7 }).map((_, day) =>
  Array.from({ length: 12 }).map((_, hour) => ({
    day,
    hour,
    value: Math.max(0, Math.round(Math.sin((day + 1) * (hour + 1) * 0.3) * 4 + 4 + (day % 3))),
  })),
);

function Dashboard() {
  const todayAppts = appointments.slice(0, 6);
  const recentPatients = patients.slice(0, 5);
  const topTherapists = [...therapists].sort((a, b) => b.workload - a.workload).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Welcome back, Alex"
        description="Tuesday, June 30 · Here's what's happening across Max Rehab today."
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><CalendarDays className="h-4 w-4" /> Today</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> New appointment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's Appointments" value={28} delta={12} hint="6 in progress · 4 home visits" icon={CalendarDays} accent="primary" index={0} />
        <StatCard label="Active Patients" value={patients.filter((p) => p.status === "Active").length} delta={4} hint="42 total · 7 onboarding" icon={Users} accent="success" index={1} />
        <StatCard label="Exercise Completion" value="81%" delta={6} hint="Across 38 programmes" icon={Activity} accent="info" index={2} />
        <StatCard label="Revenue (MTD)" value="$48,920" delta={9} hint="Projecting $62K by month end" icon={CircleDollarSign} accent="warning" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Recovery adherence vs reported pain"
          description="Rolling 14 days · all active programmes"
          action={<Button variant="ghost" size="sm">Last 14 days</Button>}
          index={0}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={adherenceData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(20, 90%, 60%)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(20, 90%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }}
                  cursor={{ stroke: "hsl(220, 15%, 80%)", strokeDasharray: "3 3" }}
                />
                <Area type="monotone" dataKey="adherence" stroke="#1F5FFF" strokeWidth={2.4} fill="url(#adherence)" />
                <Area type="monotone" dataKey="pain" stroke="#F26A3E" strokeWidth={2} fill="url(#pain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Therapist availability" description="Live now" index={1}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl bg-success/10 p-3 text-sm">
              <span className="font-medium text-success">Available</span>
              <span className="font-semibold">{therapists.filter((t) => t.availability === "Available").length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-warning/15 p-3 text-sm">
              <span className="font-medium text-warning-foreground">Busy</span>
              <span className="font-semibold">{therapists.filter((t) => t.availability === "Busy").length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
              <span className="font-medium text-muted-foreground">Off duty</span>
              <span className="font-semibold">{therapists.filter((t) => t.availability === "Off").length}</span>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highest workload</p>
              <div className="mt-2 flex flex-col gap-2">
                {topTherapists.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <AvatarInitials name={t.name} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <Progress value={t.workload} className="mt-1 h-1.5" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{t.workload}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title="Today's appointments"
          action={<Link to="/appointments" className="text-xs font-semibold text-primary hover:underline">View all →</Link>}
          index={0}
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {todayAppts.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="grid h-12 w-14 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                  <div className="text-center leading-tight">
                    <p className="text-xs font-medium">{format(parseISO(a.start), "MMM")}</p>
                    <p className="text-base font-bold">{format(parseISO(a.start), "d")}</p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{a.patient}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.service} · with {a.therapist} · {format(parseISO(a.start), "h:mm a")} · {a.duration}m
                  </p>
                </div>
                <ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
              </motion.li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Quick actions" index={1}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add patient", icon: Users, to: "/patients" },
              { label: "Book appt.", icon: CalendarDays, to: "/appointments" },
              { label: "Home visit", icon: Car, to: "/home-visits" },
              { label: "Assign plan", icon: Stethoscope, to: "/programmes" },
            ].map((q, i) => (
              <Link
                key={q.label}
                to={q.to}
                className="group flex flex-col gap-2 rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated"
              >
                <q.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{q.label}</span>
                <span className="text-[11px] text-muted-foreground">⌘+{i + 1}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border bg-gradient-to-br from-primary/10 to-transparent p-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="mt-1.5 text-sm">3 patients show declining adherence this week. Consider a check-in call.</p>
            <Link to="/ai" className="mt-2 inline-flex items-center text-xs font-semibold text-primary">Review with AI →</Link>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2" title="Appointment heatmap" description="Last 7 days · by hour" index={0}>
          <div className="overflow-x-auto">
            <div className="inline-grid min-w-full gap-1" style={{ gridTemplateColumns: "60px repeat(12, minmax(28px, 1fr))" }}>
              <div />
              {Array.from({ length: 12 }).map((_, h) => (
                <div key={h} className="text-center text-[10px] text-muted-foreground">{8 + h}:00</div>
              ))}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, di) => (
                <Fragment key={d}>
                  <div className="text-xs font-medium text-muted-foreground">{d}</div>
                  {heatmap[di].map((c) => {
                    const opacity = Math.min(0.92, 0.12 + c.value / 10);
                    return (
                      <motion.div
                        key={`${di}-${c.hour}`}
                        whileHover={{ scale: 1.08 }}
                        className="aspect-square rounded-md"
                        style={{ background: `rgba(31, 95, 255, ${opacity})` }}
                        title={`${c.value} appointments`}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent activity" index={1} bodyClassName="p-0">
          <ul className="divide-y">
            {[
              { icon: CheckCircle2, color: "text-success", text: "Sophia Patel completed Week 4 of ACL programme", time: "5m" },
              { icon: TrendingUp, color: "text-primary", text: "Pain score improved for Liam Garcia", time: "22m" },
              { icon: Users, color: "text-info", text: "New patient Maya Kenji onboarded", time: "1h" },
              { icon: Car, color: "text-warning-foreground", text: "Home visit completed for Ravi Singh", time: "2h" },
              { icon: Sparkles, color: "text-primary", text: "AI escalated 2 conversations", time: "3h" },
            ].map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 px-5 py-3"
              >
                <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time} ago</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionCard title="Patient recovery summary" description="Top 5 active" index={0} bodyClassName="p-0">
          <ul className="divide-y">
            {recentPatients.map((p, i) => (
              <li key={p.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
                <AvatarInitials name={p.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.condition} · {p.therapist}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-28 sm:block">
                    <Progress value={p.adherence} className="h-1.5" />
                    <p className="mt-1 text-right text-[10px] text-muted-foreground">{p.adherence}% adherence</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="AI conversations" description="Last 14 days" index={1}>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={adherenceData.map((d, i) => ({ day: d.day, c: 12 + ((i * 7) % 14) }))}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                <Bar dataKey="c" fill="#1F5FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
