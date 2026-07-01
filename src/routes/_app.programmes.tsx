import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Dumbbell, Library, Play, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { programmes } from "@/lib/mock";

export const Route = createFileRoute("/_app/programmes")({
  head: () => ({
    meta: [
      { title: "Recovery Programmes · Max Rehab" },
      { name: "description", content: "Programme library, builder, and assignments." },
    ],
  }),
  component: ProgrammesPage,
});

function ProgrammesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Recovery Programmes"
        description={`${programmes.length} active templates · 131 patient assignments`}
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><Library className="h-4 w-4" /> Exercise library</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> New programme</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Templates" value={programmes.length} icon={Dumbbell} index={0} />
        <StatCard label="Assigned plans" value={programmes.reduce((s, p) => s + p.assigned, 0)} accent="info" index={1} icon={Users} />
        <StatCard label="Avg completion" value={`${Math.round(programmes.reduce((s, p) => s + p.completion, 0) / programmes.length)}%`} accent="success" index={2} icon={Play} />
        <StatCard label="Video assets" value={86} accent="warning" index={3} icon={Library} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programmes.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            className="overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-elevated"
          >
            <div className="relative h-28 bg-gradient-to-br from-primary/15 via-info/10 to-primary-glow/10">
              <div className="absolute inset-0 grid place-items-center text-primary"><Dumbbell className="h-10 w-10 opacity-50" /></div>
              <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur">{p.category}</span>
            </div>
            <div className="p-4">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.exercises} exercises · {p.duration} · {p.difficulty}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-semibold">{p.completion}%</span>
              </div>
              <Progress value={p.completion} className="mt-1 h-1.5" />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{p.assigned} patients assigned</span>
                <Button size="sm" variant="outline">Assign</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <SectionCard title="Exercise library" description="Top exercises across programmes" index={0}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {["Hamstring Curls","Single-Leg Squat","Glute Bridge","Step-Ups","Calf Raises","Plank Hold","Bird Dog","Wall Sit","Heel Slides","Side Plank","Clamshells","Lunges"].map((e) => (
            <div key={e} className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/40">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Play className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{e}</p>
                <p className="text-[11px] text-muted-foreground">Video · Easy</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
