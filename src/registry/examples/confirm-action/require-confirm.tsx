import { ConfirmAction } from "@/registry/base/confirm-action/components/confirm-action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const dangerousAction = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
};

export function RequireConfirmAction() {
  return (
    <ConfirmAction
      trigger={<Button variant="destructive">Delete account</Button>}
      title="Delete your account?"
      description="All your data will be permanently removed. This cannot be undone."
      confirmText="Yes, delete my account"
      cancelText="No, keep it"
      confirmVariant="destructive"
      action={dangerousAction}
      onSuccess={() => toast.success("Account deleted.")}
    />
  );
}
