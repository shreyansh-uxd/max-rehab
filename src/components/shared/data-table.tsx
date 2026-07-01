import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sort?: (a: T, b: T) => number;
  width?: string;
  className?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  filters?: ReactNode;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyLabel?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys,
  filters,
  toolbar,
  onRowClick,
  pageSize = 10,
  emptyLabel = "No results",
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let out = data;
    if (query && searchKeys?.length) {
      const q = query.toLowerCase();
      out = out.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q)),
      );
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sort) {
        out = [...out].sort((a, b) => (sort.dir === "asc" ? col.sort!(a, b) : col.sort!(b, a)));
      }
    }
    return out;
  }, [data, query, sort, searchKeys, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-wrap">
        {searchKeys ? (
          <div className="relative min-w-0 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search…"
              className="pl-9"
            />
          </div>
        ) : (
          <div />
        )}
        <div className="flex shrink-0 items-center gap-2">
          {filters}
          {toolbar}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className={cn("px-4 py-3 font-medium", c.className)}
                    style={c.width ? { width: c.width } : undefined}
                  >
                    {c.sort ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSort((s) => ({
                            key: c.key,
                            dir: s?.key === c.key && s.dir === "asc" ? "desc" : "asc",
                          }))
                        }
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        {c.header}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {view.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.015 }}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border/60 transition-colors last:border-b-0 hover:bg-muted/40",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4 py-3 align-middle", c.className)}>
                        {c.cell(row)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {view.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">{emptyLabel}</div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground">{view.length}</span> of{" "}
            <span className="font-medium text-foreground">{filtered.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {page + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
