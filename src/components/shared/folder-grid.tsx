import { Link } from "@tanstack/react-router";
import { Folder, ScanText } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  folders: { name: string; count: number; ocr?: number; to?: string }[];
  onSelect?: (name: string) => void;
  activeName?: string;
}

export function FolderGrid({ folders, onSelect, activeName }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {folders.map((f, i) => {
        const active = activeName === f.name;
        const content = (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className={`group flex h-full flex-col justify-between rounded-2xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated ${active ? "border-primary/60 bg-primary/5" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Folder className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{f.count}</span>
            </div>
            <div className="mt-3">
              <p className="truncate text-sm font-semibold">{f.name}</p>
              {f.ocr !== undefined && (
                <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ScanText className="h-3 w-3" /> {f.ocr} OCR indexed
                </p>
              )}
            </div>
          </motion.div>
        );
        return f.to ? (
          <Link key={f.name} to={f.to}>{content}</Link>
        ) : (
          <button key={f.name} type="button" onClick={() => onSelect?.(f.name)} className="text-left">
            {content}
          </button>
        );
      })}
    </div>
  );
}