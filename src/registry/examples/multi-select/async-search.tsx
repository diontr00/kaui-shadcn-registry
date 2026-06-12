import { useState } from "react";
import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import { useDebounce } from "@/registry/base/use-debounce/hooks/use-debounce";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type MemberId = string;

const allMembers: SelectionOption<MemberId>[] = [
  { value: "m1", label: "Alice Johnson" },
  { value: "m2", label: "Bob Smith" },
  { value: "m3", label: "Carol White" },
  { value: "m4", label: "David Brown" },
  { value: "m5", label: "Eve Davis" },
  { value: "m6", label: "Frank Miller" },
  { value: "m7", label: "Grace Wilson" },
  { value: "m8", label: "Henry Moore" },
];

function searchMembers(query: string): Promise<SelectionOption<MemberId>[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(allMembers.filter((m) => m.label.toLowerCase().includes(q)));
    }, 500),
  );
}

export function AsyncSearchMultiSelect() {
  const [selected, setSelected] = useState<MemberId[]>([]);
  const [items, setItems] = useState(allMembers);
  const [isLoading, setIsLoading] = useState(false);

  const { execute: onQueryChange } = useDebounce(async (query: string) => {
    if (!query.trim()) {
      setItems(allMembers);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const results = await searchMembers(query);
    setItems(results);
    setIsLoading(false);
  }, 400);

  return (
    <div className="flex w-72 flex-col gap-3">
      <MultiSelect
        items={items}
        value={selected}
        onValueChange={setSelected}
        onQueryChange={onQueryChange}
        disableLocalFilter
        isLoading={isLoading}
        placeholder="Add team members..."
        emptyContent="No members found."
      />
      <p className="text-sm text-muted-foreground">
        {selected.length > 0
          ? `${selected.length} member${selected.length > 1 ? "s" : ""} added`
          : "No members added yet."}
      </p>
    </div>
  );
}
