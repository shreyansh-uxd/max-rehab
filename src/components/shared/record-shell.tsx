import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  header: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function RecordShell({ header, sidebar, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-20 -mx-4 border-b bg-background/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        {header}
      </motion.div>
      <div className={cn("grid gap-6", sidebar && "lg:grid-cols-[minmax(0,1fr)_320px]")}>
        <div className="min-w-0">{children}</div>
        {sidebar ? <aside className="flex flex-col gap-4">{sidebar}</aside> : null}
      </div>
    </div>
  );
}