import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { ArrowUpRight, Bot, MessageCircle, ShieldAlert, Smile, Timer } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { aiConversations } from "@/lib/mock";

export const Route = createFileRoute("/_app/ai/")({
  head: () => ({
    meta: [
      { title: "AI Dashboard · Max Rehab" },
      { name: "description", content: "Overview of AI Care Copilot activity, escalations, and satisfaction." },
    ],
  }),
  component: AiDashboard,
});

const trend = Array.from({ length: 14 }).map((_, i) => ({
  d: `D${i + 1}`,
  c: 8 + Math.round(Math.sin(i / 2) * 5 + i * 0.8),
  e: Math.max(0, Math.round(Math.sin(i) * 2 + 1)),
}));
const topics = [
  { t: "Pain management", c: 38 },
  { t: "Exercise help", c: 31 },
  { t: "Appointment", c: 22 },
  { t: "Medication", c: 16 },
  { t: "Insurance", c: 11 },
  { t: "Recovery tips", c: 9 },
];

function AiDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="AI Care Copilot" description="Real-time view of conversations, automation, and outcomes" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conversations (total)" value="2,418" delta={14} icon={MessageCircle} accent="primary" index={0} />
        <StatCard label="Today" value={aiConversations.length} delta={6} icon={Bot} accent="info" index={1} />
        <StatCard label="Avg response time" value="1.2s" delta={-8} icon={Timer} accent="success" index={2} />
        <StatCard label="Escalations" value={11} delta={3} icon={ShieldAlert} accent="warning" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Conversation volume" description="Last 14 days" index={0}>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                <Bar dataKey="c" fill="#1F5FFF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="e" fill="#F26A3E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Satisfaction" description="Rolling avg 4.6 / 5" index={1}>
          <div className="grid h-64 place-items-center">
            <div className="text-center">
              <div className="relative mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-primary/5">
                <div className="absolute inset-0 grid place-items-center">
                  <div>
                    <p className="text-3xl font-bold">4.6</p>
                    <p className="text-xs text-muted-foreground">avg rating</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 inline-flex items-center text-xs text-success"><Smile className="mr-1 h-3 w-3" /> +0.3 this month</p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Popular topics" index={0}>
          <ul className="space-y-3">
            {topics.map((t) => (
              <li key={t.t}>
                <div className="flex items-center justify-between text-sm"><span>{t.t}</span><span className="font-semibold">{t.c}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(t.c / 40) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Resolution rate" description="14-day rolling" index={1}>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={trend.map((d, i) => ({ d: d.d, r: 80 + Math.round(Math.sin(i) * 6 + i * 0.4) }))}>
                <CartesianGrid strokeDasharray="3 6" stroke="hsl(220, 15%, 90%)" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 60%)" tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220, 15%, 90%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="r" stroke="#1F5FFF" strokeWidth={2.4} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 inline-flex items-center text-xs text-success"><ArrowUpRight className="mr-1 h-3 w-3" /> +6% vs last period</p>
        </SectionCard>
      </div>
    </div>
  );
}
