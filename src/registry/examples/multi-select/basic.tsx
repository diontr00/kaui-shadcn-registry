import { useState } from "react";
import { MultiSelect } from "@/registry/base/multi-select/components/multi-select";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";
import { Search } from "lucide-react";

type Skill =
  | "react"
  | "typescript"
  | "nodejs"
  | "python"
  | "docker"
  | "graphql"
  | "postgres"
  | "redis";

const skills: SelectionOption<Skill>[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "docker", label: "Docker" },
  { value: "graphql", label: "GraphQL" },
  { value: "postgres", label: "PostgreSQL" },
  { value: "redis", label: "Redis" },
];

const skillMap = new Map(skills.map((s) => [s.value, s]));

export function BasicMultiSelect() {
  const [selected, setSelected] = useState<Skill[]>(
    skills.slice(0, 3).map((s) => s.value),
  );

  return (
    <div className="flex w-72 flex-col gap-3">
      <MultiSelect
        items={skills}
        value={selected}
        onValueChange={setSelected}
        placeholder="Select skills..."
        startAddon={<Search />}
        endAddon={<span className="w-fit">{selected.length} selected</span>}
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
