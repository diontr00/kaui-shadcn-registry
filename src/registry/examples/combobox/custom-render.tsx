import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";

type LangId = "ts" | "py" | "go" | "rust" | "java" | "csharp" | "cpp" | "swift";

type LangOption = SelectionOption<LangId> & { icon: string; badge: string };

const languages: LangOption[] = [
  {
    value: "ts",
    label: "TypeScript",
    icon: "🟦",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    value: "py",
    label: "Python",
    icon: "🐍",
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  },
  {
    value: "go",
    label: "Go",
    icon: "🔵",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  {
    value: "rust",
    label: "Rust",
    icon: "🦀",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
  {
    value: "java",
    label: "Java",
    icon: "☕",
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  {
    value: "csharp",
    label: "C#",
    icon: "🟣",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    value: "cpp",
    label: "C++",
    icon: "⚙️",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    value: "swift",
    label: "Swift",
    icon: "🧡",
    badge:
      "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  },
];

const langMap = new Map(languages.map((l) => [l.value, l]));

export function CustomRenderCombobox() {
  const [selected, setSelected] = useState<SelectionOption<LangId> | null>(
    null,
  );

  const activeLang = selected ? langMap.get(selected.value) : null;

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={languages}
        selected={selected}
        onSelectedChange={setSelected}
        placeholder="Pick a language..."
        closeAfterSelect
        renderOption={(option, isSelected) => {
          const lang = langMap.get(option.value)!;
          return (
            <div className="flex w-full items-center gap-2">
              <span className="text-base leading-none">{lang.icon}</span>
              <span
                className={cn("flex-1 text-sm", isSelected && "font-medium")}
              >
                {lang.label}
              </span>
              {isSelected && <Check className="ml-auto size-3.5" />}
            </div>
          );
        }}
      />
      {activeLang && (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
            activeLang.badge,
          )}
        >
          {activeLang.icon} {activeLang.label}
        </span>
      )}
    </div>
  );
}
