import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Combobox } from "@/registry/base/combobox/components/combobox";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

const initialCities: SelectionOption<string>[] = [
  { value: "nyc", label: "New York" },
  { value: "london", label: "London" },
  { value: "tokyo", label: "Tokyo" },
  { value: "paris", label: "Paris" },
  { value: "sydney", label: "Sydney" },
];

export function CreatableCombobox() {
  const [cities, setCities] = useState(initialCities);
  const [selected, setSelected] = useState<SelectionOption<string> | null>(
    null,
  );
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const showAdd =
    trimmed.length > 0 &&
    !cities.some((c) => c.label.toLowerCase().includes(trimmed.toLowerCase()));

  const handleAdd = () => {
    const label = trimmed;
    const value = label.toLowerCase().replace(/\s+/g, "-");
    const newCity: SelectionOption<string> = { value, label };
    setCities((prev) => [...prev, newCity]);
    setSelected(newCity);
    setQuery(newCity.label);
  };

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={cities}
        selected={selected}
        onSelectedChange={setSelected}
        query={query}
        onQueryChange={setQuery}
        placeholder="Search or add a city..."
        closeAfterSelect
        emptyContent={
          showAdd ? (
            <button
              className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-foreground hover:underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleAdd}
            >
              <PlusCircle className="size-3.5" />
              {`Add "${trimmed}"`}
            </button>
          ) : undefined
        }
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
