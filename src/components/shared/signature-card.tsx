import { CheckCircle2, MapPin, Smartphone } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Props {
  patientName: string;
  signedAt: string;
  device: string;
  location: string;
  ipAddress: string;
  verified?: boolean;
}

export function SignatureCard({ patientName, signedAt, device, location, ipAddress, verified = true }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="border-b bg-card/60 px-5 py-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Digital signature</p>
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
            <CheckCircle2 className="h-3 w-3" /> Verified
          </span>
        )}
      </div>
      <div className="p-6">
        <svg viewBox="0 0 400 100" className="h-24 w-full">
          <path
            d="M10 70 C 40 20, 60 90, 90 50 S 140 30, 170 60 S 220 90, 250 40 S 310 60, 340 50 S 380 30, 395 55"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 80 Q 100 60, 140 82 T 220 80"
            stroke="hsl(var(--foreground))"
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
          />
        </svg>
        <p className="mt-2 text-lg font-semibold" style={{ fontFamily: '"Brush Script MT", cursive' }}>
          {patientName}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 border-t bg-muted/20 p-4 text-xs sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Signed</p>
          <p className="mt-0.5 font-semibold">{format(parseISO(signedAt), "MMM d, yyyy · h:mm a")}</p>
        </div>
        <div>
          <p className="text-muted-foreground flex items-center gap-1"><Smartphone className="h-3 w-3" /> Device</p>
          <p className="mt-0.5 font-semibold">{device}</p>
        </div>
        <div>
          <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</p>
          <p className="mt-0.5 font-semibold">{location}</p>
        </div>
        <div>
          <p className="text-muted-foreground">IP address</p>
          <p className="mt-0.5 font-semibold">{ipAddress}</p>
        </div>
      </div>
    </div>
  );
}