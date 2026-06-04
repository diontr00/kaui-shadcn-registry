import { AsyncButton } from "@/registry/base/async-button/components/async-button";
import { toast } from "sonner";

const asyncAction = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

export function BasicAsyncButton() {
  return (
    <AsyncButton
      action={asyncAction}
      loadingText="loading"
      onSuccess={() => toast.success("Action Complete")}
    >
      Do Action
    </AsyncButton>
  );
}
