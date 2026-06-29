import { useState } from "react";
import {
  Combobox,
  type ComboboxGroup,
} from "@/registry/base/combobox/components/combobox";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type MemberId = string;

const groups: ComboboxGroup<MemberId>[] = [
  {
    label: "My Team",
    items: [
      { value: "alice", label: "Alice Johnson" },
      { value: "bob", label: "Bob Smith" },
      { value: "carol", label: "Carol White" },
    ],
  },
  {
    label: "Other Teams",
    items: [
      { value: "david", label: "David Brown" },
      { value: "eve", label: "Eve Davis" },
      { value: "frank", label: "Frank Miller" },
      { value: "grace", label: "Grace Wilson" },
    ],
  },
];

export function GroupedCombobox() {
  const [selected, setSelected] = useState<SelectionOption<MemberId> | null>(
    null,
  );

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={groups}
        selected={selected}
        onSelectedChange={setSelected}
        placeholder="Assign to..."
        clearable
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
