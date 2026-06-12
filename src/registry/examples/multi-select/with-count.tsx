import { useState } from "react";
import { X } from "lucide-react";
import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type Dept =
  | "design"
  | "engineering"
  | "product"
  | "marketing"
  | "sales"
  | "support"
  | "finance"
  | "legal";

const departments: SelectionOption<Dept>[] = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
];

export function MultiSelectWithCount() {
  const [selected, setSelected] = useState<Dept[]>([]);

  return (
    <div className="w-72">
      <MultiSelect
        items={departments}
        value={selected}
        onValueChange={setSelected}
        placeholder="Filter by department..."
        endAddon={
          selected.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground">
                {selected.length}
              </span>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSelected([]);
                }}
                className="flex items-center justify-center rounded p-0.5 hover:bg-muted"
              >
                <X className="size-3 text-muted-foreground" />
              </button>
            </div>
          )
        }
      />
    </div>
  );
}
