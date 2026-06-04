import { AsyncButton } from "@/registry/base/async-button/components/async-button";
import { toast } from "sonner";

const asyncAction = async () => {
  await new Promise((_, reject) => {
    setTimeout(() => reject("Something wrong happened!"), 1000);
  });
};

export function AsyncButtonWithError() {
  return (
    <AsyncButton<unknown, string>
      action={asyncAction}
      variant={"destructive"}
      onError={(error) => {
        toast.error(`Rejected : ${error}`);
      }}
    >
      Should Failed
    </AsyncButton>
  );
}
