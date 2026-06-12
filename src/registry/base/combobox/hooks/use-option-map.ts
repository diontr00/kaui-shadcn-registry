import { useMemo } from "react";
import type { SelectionOption } from "../../use-filtered-options/hooks/use-filtered-options";

/** Memoised `Map<value, SelectionOption>` for O(1) option lookup after a cmdk selection. */
export function useOptionMap<T extends string>(items: SelectionOption<T>[]) {
  return useMemo(
    () => new Map(items.map((item) => [item.value, item])),
    [items],
  );
}
