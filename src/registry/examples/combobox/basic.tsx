import { useState } from "react";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";
import { Search, ThumbsUpIcon } from "lucide-react";

type City =
  | "nyc"
  | "london"
  | "tokyo"
  | "paris"
  | "sydney"
  | "dubai"
  | "berlin"
  | "singapore";

const cities: SelectionOption<City>[] = [
  { value: "nyc", label: "New York" },
  { value: "london", label: "London" },
  { value: "tokyo", label: "Tokyo" },
  { value: "paris", label: "Paris" },
  { value: "sydney", label: "Sydney" },
  { value: "dubai", label: "Dubai" },
  { value: "berlin", label: "Berlin" },
  { value: "singapore", label: "Singapore" },
];

export function BasicCombobox() {
  const [selected, setSelected] = useState<SelectionOption<City> | null>(
    cities[3] || null,
  );

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={cities}
        selected={selected}
        onSelectedChange={setSelected}
        placeholder="Select a city..."
        startAddon={<Search />}
        endAddon={selected && <ThumbsUpIcon />}
        closeAfterSelect
      />
      <p className="text-sm text-muted-foreground">
        {selected ? (
          <>
            Selected:{" "}
            <span className="font-medium text-foreground">
              {selected.label}
            </span>
          </>
        ) : (
          "No city selected."
        )}
      </p>
    </div>
  );
}
