import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const deleteItem = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export function BasicConfirmAction() {
  return (
    <ConfirmAction
      trigger={<Button variant="destructive">Delete item</Button>}
      title="Delete item?"
      description="This will permanently delete the item. This action cannot be undone."
      confirmText="Delete"
      confirmVariant="destructive"
      action={deleteItem}
      onSuccess={() => toast.success("Item deleted.")}
    />
  );
}
