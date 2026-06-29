import { useState } from "react";
import { Combobox } from "@/registry/base/combobox/components/combobox";
import { useDebounce } from "@/registry/base/use-debounce/hooks/use-debounce";
import type { SelectionOption } from "@/registry/base/use-filtered-options/hooks/use-filtered-options";
import { Loader2, SearchIcon } from "lucide-react";

type ProductId = string;

const allProducts: SelectionOption<ProductId>[] = [
  { value: "p1", label: "MacBook Pro 14" },
  { value: "p2", label: "MacBook Air M3" },
  { value: "p3", label: "iPad Pro 12.9" },
  { value: "p4", label: "iPhone 15 Pro" },
  { value: "p5", label: "Apple Watch Ultra" },
  { value: "p6", label: "AirPods Pro" },
  { value: "p7", label: "Mac Studio" },
  { value: "p8", label: "Mac Mini M4" },
];

function searchProducts(query: string): Promise<SelectionOption<ProductId>[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(allProducts.filter((p) => p.label.toLowerCase().includes(q)));
    }, 500),
  );
}

export function FooterItemCombobox() {
  const [selected, setSelected] = useState<SelectionOption<ProductId> | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(allProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedPhrase, setSearchedPhrase] = useState<string | null>(null);

  const { execute: onQueryChange } = useDebounce(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setItems(allProducts);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const results = await searchProducts(q);
    setItems(results);
    setIsLoading(false);
  }, 200);

  return (
    <div className="flex w-72 flex-col gap-3">
      <Combobox
        items={items}
        selected={selected}
        onSelectedChange={(option) => {
          setSelected(option);
          setSearchedPhrase(null);
        }}
        onQueryChange={onQueryChange}
        disableLocalFilter
        isLoading={isLoading}
        placeholder="Search products..."
        emptyContent="No products found."
        loadingContent={<Loader2 className="w-full animate-spin" />}
        closeAfterSelect
        footerItem={
          query.trim()
            ? {
                label: (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <SearchIcon className="size-3.5 shrink-0" />
                    Search for &ldquo;{query}&rdquo;
                  </span>
                ),
                onSelect: () => {
                  setSelected(null);
                  setSearchedPhrase(query);
                },
              }
            : undefined
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
        ) : searchedPhrase ? (
          <>
            Searching for:{" "}
            <span className="font-medium text-foreground">
              &ldquo;{searchedPhrase}&rdquo;
            </span>
          </>
        ) : (
          "Nothing selected"
        )}
      </p>
    </div>
  );
}
