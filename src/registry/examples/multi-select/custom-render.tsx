import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type Status =
  | "backlog"
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "cancelled";

type StatusOption = SelectionOption<Status> & { dot: string; pill: string };

const statuses: StatusOption[] = [
  {
    value: "backlog",
    label: "Backlog",
    dot: "bg-muted-foreground",
    pill: "bg-muted text-muted-foreground",
  },
  {
    value: "todo",
    label: "To Do",
    dot: "bg-blue-500",
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "in-progress",
    label: "In Progress",
    dot: "bg-yellow-500",
    pill: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "in-review",
    label: "In Review",
    dot: "bg-purple-500",
    pill: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    value: "done",
    label: "Done",
    dot: "bg-green-500",
    pill: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    dot: "bg-red-400",
    pill: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300",
  },
];

const statusMap = new Map(statuses.map((s) => [s.value, s]));

export function CustomRenderMultiSelect() {
  const [selected, setSelected] = useState<Status[]>(
    statuses.slice(0, 3).map((status) => status.value),
  );

  return (
    <div className="flex w-80 flex-col gap-3">
      <MultiSelect
        items={statuses}
        value={selected}
        onValueChange={setSelected}
        placeholder="Filter by status..."
        renderOption={(option, isSelected) => {
          const s = statusMap.get(option.value)!;
          return (
            <div className="flex w-full items-center gap-2">
              <span className={cn("size-2 shrink-0 rounded-full", s.dot)} />
              <span className="flex-1 text-sm">{s.label}</span>
              {isSelected && <Check className="ml-auto size-3.5" />}
            </div>
          );
        }}
      />
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((v) => {
            const s = statusMap.get(v)!;
            return (
              <span
                key={v}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  s.pill,
                )}
              >
                <span className={cn("size-1.5 rounded-full", s.dot)} />
                {s.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
