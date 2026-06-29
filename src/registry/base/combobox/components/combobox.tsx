import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useControlledState } from "../../use-controlled-state/hooks/use-controlled-state";
import type { SelectionOption } from "../../use-filtered-options/hooks/use-filtered-options";
import { useOptionMap } from "@/registry/base/combobox/hooks/use-option-map";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export type ComboboxGroup<T extends string> = {
  /** Optional heading rendered above this group of options. */
  label?: string;
  items: SelectionOption<T>[];
};

const FOOTER_ITEM_VALUE = "__kaui_combobox_footer__";

function isGrouped<T extends string>(
  items: SelectionOption<T>[] | ComboboxGroup<T>[],
): items is ComboboxGroup<T>[] {
  return items.length > 0 && "items" in (items[0] as object);
}

type ComboboxProps<T extends string> = {
  /** Currently selected option, or `null` when nothing is selected. */
  selected: SelectionOption<T> | null;
  /** Called when the selection changes. Receives `null` on deselect. */
  onSelectedChange: (value: SelectionOption<T> | null) => void;

  /**
   * Options to display. Accepts a flat `SelectionOption<T>[]` or a
   * `ComboboxGroup<T>[]` to render items under labeled headings.
   */
  items: SelectionOption<T>[] | ComboboxGroup<T>[];
  /**
   * Custom renderer for each list item.
   * Receives the option and a boolean indicating whether it is currently selected.
   * When omitted a default label + checkmark layout is used.
   */
  renderOption?: (option: SelectionOption<T>, selected: boolean) => ReactNode;

  /** Controlled search query. Omit to let the component manage query state internally. */
  query?: string;
  /** Called whenever the search query changes. */
  onQueryChange?: (query: string) => void;

  /** Controlled open state of the dropdown. Omit to let the component manage it internally. */
  open?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;

  /** Skip client-side filtering. Use when items are already filtered server-side. */
  disableLocalFilter?: boolean;
  /** Custom filter predicate. Replaces the default case-insensitive label match. */
  filterFn?: (item: SelectionOption<T>, query: string) => boolean;

  /** Placeholder shown in the search input when empty. @default "Search..." */
  placeholder?: string;
  /** Content shown when no options match the current query. @default "No results found." */
  emptyContent?: ReactNode;
  /** Content shown in place of the option list while `isLoading` is `true`. Defaults to a skeleton bar. */
  loadingContent?: ReactNode;

  /** Show the loading state in place of the option list. @default false */
  isLoading?: boolean;
  /** Close the dropdown immediately after an option is selected. @default false */
  closeAfterSelect?: boolean;
  /** Disable the entire combobox. @default false */
  disabled?: boolean;
  /** Show a built-in clear button when an option is selected. @default false */
  clearable?: boolean;

  /** Content rendered as a leading addon inside the input (e.g. a search icon or label). */
  startAddon?: ReactNode;
  /** Content rendered as a trailing addon inside the input (e.g. a status indicator). */
  endAddon?: ReactNode;
  /**
   * A persistent CommandItem pinned to the bottom of the list.
   * Fully keyboard-navigable (arrow keys + Enter) unlike emptyContent.
   * Shown whenever the dropdown is open, regardless of whether items exist.
   */
  footerItem?: { label: ReactNode; onSelect: () => void };
} & ComponentProps<typeof PopoverContent>;

/**
 * Single-select combobox with an inline search input and a dropdown option list.
 *
 * **Required:** `selected`, `onSelectedChange`, `items`
 *
 * Supports controlled `open` and `query` state, async loading, grouped options,
 * custom option rendering, and custom filtering.
 */
export function Combobox<T extends string>({
  selected,
  onSelectedChange,
  items,
  renderOption,
  query: queryProp,
  onQueryChange,
  open: openProp,
  onOpenChange,
  disableLocalFilter,
  filterFn,
  placeholder = "Search...",
  emptyContent = "No results found.",
  loadingContent,
  isLoading = false,
  closeAfterSelect = false,
  disabled = false,
  clearable = false,
  startAddon,
  endAddon,
  footerItem,
  ...props
}: ComboboxProps<T>) {
  const [query, setQuery] = useControlledState({
    value: queryProp,
    defaultValue: "",
    onChange: onQueryChange,
  });

  const [open, setOpen] = useControlledState({
    value: openProp,
    defaultValue: false,
    onChange: onOpenChange,
  });

  // Controlled highlighted item — starts empty so the first item is not
  // auto-focused when the dropdown opens. Resets on close so the next open
  // is also clean.
  const [highlightedValue, setHighlightedValue] = useState("");
  useEffect(() => {
    if (!open) setHighlightedValue("");
  }, [open]);

  const groups = useMemo(
    (): ComboboxGroup<T>[] =>
      !items.length
        ? []
        : isGrouped(items)
          ? items
          : [{ items: items as SelectionOption<T>[] }],
    [items],
  );

  const allOptions = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const optionMap = useOptionMap(allOptions);

  const filteredGroups = useMemo((): ComboboxGroup<T>[] => {
    if (disableLocalFilter || !query.trim()) return groups;
    const pred =
      filterFn ??
      ((item: SelectionOption<T>, q: string) =>
        item.label.toLowerCase().includes(q.toLowerCase()));
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((item) => pred(item, query)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query, disableLocalFilter, filterFn]);

  const hasItems = filteredGroups.length > 0;

  const handleSelect = useCallback(
    (selectedValue: string) => {
      const option = optionMap.get(selectedValue as T);
      if (!option) return;

      if (selected?.value === option.value) {
        onSelectedChange(null);
        setQuery("");
      } else {
        onSelectedChange(option);
        setQuery(option.label);
        if (closeAfterSelect) setOpen(false);
      }
    },
    [
      optionMap,
      selected?.value,
      onSelectedChange,
      setQuery,
      closeAfterSelect,
      setOpen,
    ],
  );

  const handleClear = useCallback(() => {
    onSelectedChange(null);
    setQuery("");
  }, [onSelectedChange, setQuery]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget?.hasAttribute("cmdk-list")) return;
    if (selected) setQuery(selected.label);
  };

  const renderItem = (item: SelectionOption<T>) => (
    <CommandItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      onSelect={handleSelect}
      onMouseDown={(e) => e.preventDefault()}
    >
      {renderOption ? (
        renderOption(item, selected?.value === item.value)
      ) : (
        <>
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selected?.value === item.value ? "opacity-100" : "opacity-0",
            )}
          />
          {item.label}
        </>
      )}
    </CommandItem>
  );

  const footerCommandItem = footerItem ? (
    <CommandItem
      value={FOOTER_ITEM_VALUE}
      onSelect={footerItem.onSelect}
      onMouseDown={(e) => e.preventDefault()}
    >
      {footerItem.label}
    </CommandItem>
  ) : null;

  return (
    <div data-slot="combobox-content" className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <Command
          shouldFilter={false}
          value={highlightedValue}
          onValueChange={setHighlightedValue}
        >
          <PopoverAnchor asChild>
            <InputGroup>
              {startAddon && (
                <InputGroupAddon align="inline-start">
                  {startAddon}
                </InputGroupAddon>
              )}
              <CommandPrimitive.Input
                asChild
                value={query}
                onValueChange={setQuery}
                onMouseDown={() => !disabled && setOpen(true)}
                onKeyDown={(e) => {
                  if (disabled) return;
                  if (e.key === "Escape") {
                    if (open) {
                      setOpen(false);
                    } else {
                      setQuery("");
                    }
                    return;
                  }
                  setOpen(true);
                }}
                onBlur={handleBlur}
              >
                <InputGroupInput
                  placeholder={placeholder}
                  disabled={disabled}
                  onFocus={() => !disabled && setOpen(true)}
                />
              </CommandPrimitive.Input>

              {((clearable && !!selected) || !!endAddon) && (
                <InputGroupAddon align="inline-end">
                  {clearable && selected && (
                    <InputGroupButton
                      size="icon-xs"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleClear();
                      }}
                    >
                      <X className="size-3" />
                    </InputGroupButton>
                  )}
                  {endAddon}
                </InputGroupAddon>
              )}
            </InputGroup>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            className="w-(--radix-popover-trigger-width) p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            {...props}
          >
            <CommandList>
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-2">
                    {loadingContent ?? <Skeleton className="h-6 w-full" />}
                  </div>
                </CommandPrimitive.Loading>
              ) : hasItems ? (
                <>
                  {filteredGroups.map((group, index) => (
                    <CommandGroup key={index} heading={group.label}>
                      {group.items.map(renderItem)}
                    </CommandGroup>
                  ))}
                  {footerCommandItem && (
                    <CommandGroup>{footerCommandItem}</CommandGroup>
                  )}
                </>
              ) : footerItem ? (
                <>
                  <p className="py-6 text-center text-sm">{emptyContent}</p>
                  <CommandGroup>{footerCommandItem}</CommandGroup>
                </>
              ) : (
                <CommandEmpty>{emptyContent}</CommandEmpty>
              )}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
