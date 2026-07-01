import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Clock, MapPin, Phone, Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { locations_list } from "@/lib/mock";

export const Route = createFileRoute("/_app/locations")({
  head: () => ({
    meta: [
      { title: "Clinic Locations · Max Rehab" },
      { name: "description", content: "Manage clinic locations, rooms, and operating hours." },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Clinic Locations" description={`${locations_list.length} branches across the Bay Area`} actions={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Add location</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total locations" value={locations_list.length} icon={Building2} index={0} />
        <StatCard label="Total rooms" value={locations_list.reduce((s, l) => s + l.rooms, 0)} accent="info" index={1} icon={Building2} />
        <StatCard label="Total staff" value={locations_list.reduce((s, l) => s + l.staff, 0)} accent="success" index={2} icon={Users} />
        <StatCard label="Hours/week" value="312 h" accent="warning" index={3} icon={Clock} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations_list.map((l, i) => (
          <motion.article key={l.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }} className="overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-elevated">
            <div className="relative h-28 bg-gradient-to-br from-primary/15 to-info/10">
              <div className="absolute inset-0 grid place-items-center text-primary/60"><Building2 className="h-10 w-10" /></div>
              <span className="absolute right-3 top-3"><StatusBadge status={l.status} /></span>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold">{l.name}</p>
              <p className="mt-1 inline-flex items-center text-xs text-muted-foreground"><MapPin className="mr-1 h-3 w-3" /> {l.address}</p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> {l.phone}</li>
                <li className="flex items-center gap-2"><Clock className="h-3 w-3" /> {l.hours}</li>
                <li className="flex items-center gap-2"><Users className="h-3 w-3" /> {l.staff} staff · {l.rooms} rooms</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full">Manage location</Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
