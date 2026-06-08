import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const archiveItem = async (): Promise<{ archivedAt: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { archivedAt: new Date().toISOString() };
};

export function WithFollowUpConfirmAction() {
  return (
    <ConfirmAction
      title="Archive this item?"
      description="Archived items can be restored later from your archive."
      confirmText="Archive"
      action={archiveItem}
      onSuccess={(data: { archivedAt: string }) =>
        toast.success("Archived", {
          description: `Archived at ${new Date(data.archivedAt).toLocaleTimeString()}`,
        })
      }
    >
      <Button variant="outline">Archive item</Button>
    </ConfirmAction>
  );
}
