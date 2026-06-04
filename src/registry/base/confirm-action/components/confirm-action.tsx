import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type ComponentProps, type ReactNode, useState } from "react";
import {
  type AsyncActionProps,
  type ButtonProps,
} from "../../async-button/components/async-button";
import { AsyncButton } from "../../async-button/components/async-button";

interface ConfirmActionProps<TData = unknown, TError = unknown> extends Omit<
  AsyncActionProps<TData, TError>,
  "title"
> {
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  cancelText?: ReactNode;
  confirmText?: ReactNode;
  confirmVariant?: ButtonProps["variant"];
  size?: ComponentProps<typeof AlertDialogContent>["size"];
  media?: ReactNode;
}

export function ConfirmAction<TData = unknown, TError = unknown>({
  trigger,
  action,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  cancelText = "Cancel",
  confirmText = "Continue",
  confirmVariant = "default",
  size,
  media,
  loadingText,
  onSuccess,
  onError,
  onSettled,
}: ConfirmActionProps<TData, TError>) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {media && <AlertDialogMedia>{media}</AlertDialogMedia>}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AsyncButton
            variant={confirmVariant}
            action={action}
            loadingText={loadingText ?? confirmText}
            onSuccess={async (data) => {
              await onSuccess?.(data);
              setOpen(false);
            }}
            onError={onError}
            onSettled={onSettled}
          >
            {confirmText}
          </AsyncButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
