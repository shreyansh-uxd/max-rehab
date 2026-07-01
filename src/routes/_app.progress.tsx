import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Flag, LineChart as LineIcon, Target, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { Progress } from "@/components/ui/progress";
import { patients } from "@/lib/mock";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({
    meta: [
      { title: "Recovery Progress · Max Rehab" },
      { name: "description", content: "Track recovery timelines, pain trends, and milestones." },
    ],
  }),
  component: ProgressPage,
});

const series = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  pain: Math.max(0, 7 - i * 0.5),
  mobility: 25 + i * 6,
  strength: 18 + i * 6 + (i % 3) * 3,
}));

function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Recovery Progress" description="Cohort and individual patient outcomes" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Improving" value="34 patients" delta={8} icon={TrendingUp} accent="success" index={0} />
        <StatCard label="Avg pain reduction" value="3.2 pts" delta={11} icon={LineIcon} accent="info" index={1} />
        <StatCard label="Goals achieved" value={62} delta={4} icon={Target} accent="primary" index={2} />
        <StatCard label="Milestones (wk)" value={14} delta={2} icon={Flag} accent="warning" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Pain vs mobility (12-week cohort)" index={0}>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="mob2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1F5FFF" stopOpacity={0.35} /><stop offset="100%" stopColor="#1F5FFF" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                <Area dataKey="mobility" stroke="#1F5FFF" strokeWidth={2.4} fill="url(#mob2)" />
                <Area dataKey="pain" stroke="#F26A3E" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Strength gains" index={1}>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                <Bar dataKey="strength" fill="#1F5FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Patient milestones this week" bodyClassName="p-0" index={0}>
        <ul className="divide-y">
          {patients.slice(0, 8).map((p) => (
            <li key={p.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.condition} · {p.adherence}% adherence</p>
              </div>
              <Progress value={p.adherence} className="hidden h-1.5 w-32 sm:block" />
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
