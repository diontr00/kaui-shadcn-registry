import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

const initialSkills: SelectionOption<string>[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "docker", label: "Docker" },
];

export function CreatableMultiSelect() {
  const [skills, setSkills] = useState(initialSkills);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const showAdd =
    trimmed.length > 0 &&
    !skills.some((s) => s.label.toLowerCase().includes(trimmed.toLowerCase()));

  const skillMap = new Map(skills.map((s) => [s.value, s]));

  const handleAdd = () => {
    const label = trimmed;
    const value = label.toLowerCase().replace(/\s+/g, "-");
    const newSkill: SelectionOption<string> = { value, label };
    setSkills((prev) => [...prev, newSkill]);
    setSelected((prev) => [...prev, value]);
    setQuery("");
  };

  return (
    <div className="flex w-72 flex-col gap-3">
      <MultiSelect
        items={skills}
        value={selected}
        onValueChange={setSelected}
        query={query}
        onQueryChange={setQuery}
        placeholder="Search or add a skill..."
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
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((v) => (
            <span
              key={v}
              className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {skillMap.get(v)?.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No skills selected.</p>
      )}
    </div>
  );
}
