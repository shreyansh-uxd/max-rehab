import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, FileText, FolderTree, Plus, Tag, Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/ai/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Base · Max Rehab AI" },
      { name: "description", content: "AI knowledge base, protocols, FAQs, and articles." },
    ],
  }),
  component: Knowledge,
});

const categories = [
  { name: "Protocols", count: 24, icon: FolderTree },
  { name: "FAQs", count: 86, icon: BookOpen },
  { name: "Exercise references", count: 142, icon: Tag },
  { name: "Policies", count: 11, icon: FileText },
];

const articles = [
  { title: "Post-ACL rehabilitation protocol (weeks 1–12)", tag: "Protocol", updated: "2 days ago", status: "Published" },
  { title: "Patient FAQ: when to ice vs heat", tag: "FAQ", updated: "1 week ago", status: "Published" },
  { title: "Insurance pre-authorisation requirements", tag: "Policy", updated: "3 days ago", status: "Draft" },
  { title: "Pediatric coordination exercises (ages 6–12)", tag: "Protocol", updated: "5 days ago", status: "Published" },
  { title: "Home exercise compliance scripts", tag: "FAQ", updated: "Yesterday", status: "Published" },
  { title: "Discharge criteria for rotator cuff repair", tag: "Protocol", updated: "12 days ago", status: "Review" },
];

function Knowledge() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Knowledge Base"
        description="Source-of-truth content powering the AI assistant"
        actions={
          <>
            <Button variant="outline" className="gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>
            <Button className="gap-1.5"><Plus className="h-4 w-4" /> New article</Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} className="rounded-2xl border bg-card p-4 shadow-soft">
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.count} items</p>
          </motion.div>
        ))}
      </div>
      <SectionCard title="Articles" description="Recently updated" bodyClassName="p-0" index={0}>
        <ul className="divide-y">
          {articles.map((a) => (
            <li key={a.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-4 px-5 py-3 hover:bg-muted/40">
              <FileText className="h-5 w-5 text-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.tag} · updated {a.updated}</p>
              </div>
              <span className="hidden rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">{a.tag}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                a.status === "Published" ? "bg-success/10 text-success" :
                a.status === "Draft" ? "bg-warning/15 text-warning-foreground" : "bg-info/10 text-info"
              }`}>{a.status}</span>
              <Button variant="ghost" size="sm">Open</Button>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
