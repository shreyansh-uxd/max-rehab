import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, MessageSquare, Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/ai/config")({
  head: () => ({
    meta: [
      { title: "AI Configuration · Max Rehab" },
      { name: "description", content: "Tune your AI assistant prompts, escalation rules, and tone." },
    ],
  }),
  component: AiConfig,
});

function AiConfig() {
  const [name, setName] = useState("Max Care Copilot");
  const [welcome, setWelcome] = useState("Hi! I'm Max — your recovery assistant. How can I help today?");
  const [tone, setTone] = useState("supportive");
  const [length, setLength] = useState([3]);
  const [emergencyOn, setEmergencyOn] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Configuration"
        description="Behaviour, persona, and safety rules for Max Care Copilot"
        actions={<Button onClick={() => toast.success("Configuration saved")}>Save changes</Button>}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-4">
          <SectionCard title="Identity" description="How patients see your assistant" index={0}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Assistant name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Avatar style</Label>
                <Select defaultValue="medical">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="medical">Medical professional</SelectItem><SelectItem value="friendly">Friendly assistant</SelectItem><SelectItem value="minimal">Minimal icon</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Welcome message</Label><Textarea value={welcome} onChange={(e) => setWelcome(e.target.value)} rows={3} /></div>
            </div>
          </SectionCard>
          <SectionCard title="Conversation behaviour" index={1}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="supportive">Warm & supportive</SelectItem><SelectItem value="clinical">Clinical & precise</SelectItem><SelectItem value="friendly">Casual & friendly</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Response length: {length[0]} sentences</Label><Slider value={length} onValueChange={setLength} min={1} max={6} step={1} /></div>
              <div className="md:col-span-2 space-y-2"><Label>Conversation starters</Label>
                <div className="flex flex-wrap gap-2">
                  {["Track my pain today","Help with an exercise","Reschedule my appointment","Explain my plan"].map((s) => (
                    <span key={s} className="rounded-full border bg-muted px-3 py-1 text-xs">{s} ×</span>
                  ))}
                  <button className="rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground hover:bg-muted">+ Add</button>
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Safety & escalation" index={2}>
            <div className="space-y-4">
              <Row label="Emergency escalation" desc="Detect crisis language and immediately notify on-call staff" checked={emergencyOn} onChange={setEmergencyOn} />
              <Row label="Escalate low-confidence answers" desc="Hand off to a therapist when AI confidence falls below 65%" checked />
              <Row label="Require human review for medication questions" desc="Always route medication-related queries to a clinician" checked />
              <Row label="Block diagnostic claims" desc="Prevent the AI from offering definitive diagnoses" checked />
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Live preview" description="Try your assistant" index={0}>
          <div className="rounded-2xl border bg-muted/30 p-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></div>
              <div><p className="text-sm font-semibold">{name}</p><p className="text-[10px] text-muted-foreground">Online · {tone}</p></div>
            </div>
            <div className="space-y-2 py-3">
              <div className="max-w-[80%] rounded-2xl bg-card px-3 py-2 text-sm shadow-soft">{welcome}</div>
              <div className="ml-auto max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">My knee is still painful at night.</div>
              <div className="max-w-[80%] rounded-2xl bg-card px-3 py-2 text-sm shadow-soft">
                I hear you. Pain at night after recovery can be normal. Let's check your latest pain log and adjust your routine if needed.
                <Sparkles className="ml-1 inline h-3 w-3 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-2 border-t pt-2">
              <Input placeholder="Ask Max…" />
              <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
          <Button variant="outline" className="mt-3 w-full gap-1.5" onClick={() => toast.success("Opened sandbox")}><MessageSquare className="h-4 w-4" /> Open testing sandbox</Button>
        </SectionCard>
      </div>
    </div>
  );
}

function Row({ label, desc, checked, onChange }: { label: string; desc: string; checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
