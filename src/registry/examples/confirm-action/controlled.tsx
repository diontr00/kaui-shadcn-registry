import { useState } from "react";
import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ITEMS = [
  { id: 1, name: "Profile settings" },
  { id: 2, name: "API keys" },
  { id: 3, name: "Billing details" },
];

export function ControlledConfirmAction() {
  const [items, setItems] = useState(ITEMS);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const target = items.find((i) => i.id === pendingId);

  if (items.length === 0) {
    return (
      <Button variant="outline" onClick={() => setItems(ITEMS)}>
        Reset
      </Button>
    );
  }

  return (
    <>
      <div className="w-72 divide-y overflow-hidden rounded-xl border">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm font-medium">{item.name}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast.info(`Editing ${item.name}`)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setPendingId(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmAction
        open={pendingId !== null}
        onOpenChange={(open) => !open && setPendingId(null)}
        title="Delete item?"
        description={
          target ? `"${target.name}" will be permanently removed.` : undefined
        }
        confirmText="Delete"
        confirmVariant="destructive"
        action={async () => {
          await new Promise((r) => setTimeout(r, 800));
          setItems((prev) => prev.filter((i) => i.id !== pendingId));
        }}
        onSuccess={() => toast.success("Item deleted")}
      />
    </>
  );
}
