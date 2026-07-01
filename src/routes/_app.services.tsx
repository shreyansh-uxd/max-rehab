import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hospital, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { services_list } from "@/lib/mock";

export const Route = createFileRoute("/_app/services")({
  head: () => ({
    meta: [
      { title: "Services · Max Rehab" },
      { name: "description", content: "Clinic services, pricing, and assignment." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Services"
        description={`${services_list.length} services across 5 categories`}
        actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> New service</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active services" value={services_list.filter((s) => s.status === "Active").length} icon={Hospital} index={0} />
        <StatCard label="Avg price" value={`$${Math.round(services_list.reduce((s, x) => s + x.price, 0) / services_list.length)}`} accent="success" index={1} icon={Hospital} />
        <StatCard label="Categories" value={new Set(services_list.map((s) => s.category)).size} accent="info" index={2} icon={Hospital} />
        <StatCard label="Most booked" value="Manual Therapy" accent="warning" index={3} icon={Hospital} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services_list.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}
            className="overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.category}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold">${s.price}</span>
              <span className="text-xs text-muted-foreground">/ {s.duration} min</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{s.therapists} therapists</span>
              <Button variant="ghost" size="sm">Manage</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
