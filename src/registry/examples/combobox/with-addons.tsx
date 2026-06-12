import { useState } from "react";
import { Search, X } from "lucide-react";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type Framework =
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "solid"
  | "nextjs"
  | "nuxt"
  | "astro";

const frameworks: SelectionOption<Framework>[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "astro", label: "Astro" },
];

export function ComboboxWithAddons() {
  const [selected, setSelected] = useState<SelectionOption<Framework> | null>(
    null,
  );
  const [query, setQuery] = useState<string>("");

  return (
    <div className="w-72">
      <Combobox
        items={frameworks}
        selected={selected}
        onSelectedChange={setSelected}
        placeholder="Search framework..."
        closeAfterSelect
        query={query}
        onQueryChange={setQuery}
        startAddon={<Search className="size-3.5 text-muted-foreground" />}
        endAddon={
          selected && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                setSelected(null);
                setQuery("");
              }}
              className="flex items-center justify-center rounded p-0.5 hover:bg-muted"
            >
              <X className="size-3 text-muted-foreground" />
            </button>
          )
        }
      />
    </div>
  );
}
