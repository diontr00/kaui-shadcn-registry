import { useCallback, type ComponentProps, type ReactNode } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useControlledState } from "../../use-controlled-state/hooks/use-controlled-state";
import {
  useFilteredOptions,
  type SelectionOption,
} from "../../use-filtered-options/hooks/use-filtered-options";
import { useOptionMap } from "@/registry/base/combobox/hooks/use-option-map";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type ComboboxProps<T extends string> = {
  /** The currently selected option, or `null` when nothing is selected. */
  selected: SelectionOption<T> | null;
  /** Called when the selection changes. Receives `null` when the active item is deselected. */
  onSelectedChange: (value: SelectionOption<T> | null) => void;

  /** Full list of options to display. */
  items: SelectionOption<T>[];
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

  /**
   * Skip local filtering entirely.
   * Use when `items` are already filtered server-side for the current query.
   */
  disableLocalFilter?: boolean;
  /**
   * Custom filter predicate. Receives each option and the current query string.
   * Replaces the default case-insensitive label match when provided.
   */
  filterFn?: (item: SelectionOption<T>, query: string) => boolean;

  /** Placeholder shown in the search input when empty. @default "Search..." */
  placeholder?: string;
  /** Content shown when no options match the current query. @default "No results found." */
  emptyContent?: ReactNode;
  /**
   * Content shown in place of the option list while `isLoading` is `true`.
   * Defaults to a single skeleton bar.
   */
  loadingContent?: ReactNode;

  /** Render the loading skeleton in place of the option list. @default false */
  isLoading?: boolean;
  /** Close the dropdown immediately after an option is selected. @default false */
  closeAfterSelect?: boolean;

  /** Content rendered as a leading addon inside the input (e.g. a search icon or label). */
  startAddon?: ReactNode;
  /** Content rendered as a trailing addon inside the input (e.g. a clear button or badge). */
  endAddon?: ReactNode;
} & ComponentProps<typeof PopoverContent>;

/**
 * Single-select combobox with an inline search input and a dropdown option list.
 *
 * **Required:** `selected`, `onSelectedChange`, `items`
 *
 * Supports controlled `open` and `query` state, async loading, custom option rendering,
 * and custom filtering. Embed icons or actions inside the input via `startAddon` / `endAddon`.
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
  startAddon,
  endAddon,
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

  const optionMap = useOptionMap(items);
  const filteredItems = useFilteredOptions({
    items,
    query,
    filterFn,
    disableLocalFilter,
  });

  const handleSelect = useCallback(
    (selectedValue: string) => {
      const option = optionMap.get(selectedValue as T);

      if (!option) {
        return;
      }

      if (selected?.value === option.value) {
        onSelectedChange(null);
        setQuery("");
      } else {
        onSelectedChange(option);
        setQuery(option.label);

        if (closeAfterSelect) {
          setOpen(false);
        }
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget?.hasAttribute("cmdk-list")) {
      return;
    }
    if (selected) {
      setQuery(selected.label);
    }
  };

  return (
    <div data-slot="combobox-content" className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
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
                onMouseDown={() => setOpen(true)}
                onKeyDown={(e) => {
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
                  onFocus={() => setOpen(true)}
                />
              </CommandPrimitive.Input>

              {endAddon && (
                <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>
              )}
            </InputGroup>
          </PopoverAnchor>

          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            className="w-(--radix-popover-trigger-width) p-0"
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
              ) : filteredItems.length > 0 ? (
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
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
                              selected?.value === item.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {item.label}
                        </>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
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
