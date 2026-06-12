import { useState } from "react";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import { useDebounce } from "@/registry/base/use-debounce/hooks/use-debounce";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";
import { Loader2 } from "lucide-react";

type UserId = string;

const allUsers: SelectionOption<UserId>[] = [
  { value: "u1", label: "Alice Johnson" },
  { value: "u2", label: "Bob Smith" },
  { value: "u3", label: "Carol White" },
  { value: "u4", label: "David Brown" },
  { value: "u5", label: "Eve Davis" },
  { value: "u6", label: "Frank Miller" },
  { value: "u7", label: "Grace Wilson" },
  { value: "u8", label: "Henry Moore" },
];

function searchUsers(query: string): Promise<SelectionOption<UserId>[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(allUsers.filter((u) => u.label.toLowerCase().includes(q)));
    }, 600),
  );
}

export function AsyncSearchCombobox() {
  const [selected, setSelected] = useState<SelectionOption<UserId> | null>(
    null,
  );
  const [items, setItems] = useState(allUsers);
  const [isLoading, setIsLoading] = useState(false);

  const { execute: onQueryChange } = useDebounce(async (query: string) => {
    if (!query.trim()) {
      setItems(allUsers);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const results = await searchUsers(query);
    setItems(results);
    setIsLoading(false);
  }, 200);

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={items}
        selected={selected}
        onSelectedChange={setSelected}
        onQueryChange={onQueryChange}
        disableLocalFilter
        isLoading={isLoading}
        placeholder="Assign to..."
        emptyContent="No users found."
        loadingContent={<Loader2 className="animate-spin w-full" />}
        closeAfterSelect
      />
      <p className="text-sm text-muted-foreground">
        {selected ? (
          <>
            Assigned to:{" "}
            <span className="font-medium text-foreground">
              {selected.label}
            </span>
          </>
        ) : (
          "Unassigned"
        )}
      </p>
    </div>
  );
}
