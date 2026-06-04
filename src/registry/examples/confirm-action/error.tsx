import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const failingAction = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw new Error("Server error");
};

export function ErrorConfirmAction() {
  return (
    <ConfirmAction
      trigger={<Button variant="destructive">Trigger error</Button>}
      title="This will fail"
      description="This example demonstrates how ConfirmAction handles errors gracefully."
      confirmText="Proceed anyway"
      confirmVariant="destructive"
      action={failingAction}
      onSuccess={() => toast.success("Done.")}
      onError={() => toast.error("Action failed. Please try again.")}
    />
  );
}
