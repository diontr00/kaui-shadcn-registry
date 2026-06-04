import { Button } from "@/components/ui/button";
import { type ComponentProps, type ReactNode, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonProps = ComponentProps<typeof Button>;

export type AsyncActionProps<TData = unknown, TError = unknown> = Omit<
  ButtonProps,
  "onClick"
> & {
  action: () => Promise<TData> | TData;
  loadingText?: ReactNode;
  onSuccess?: (data?: TData) => void | Promise<void> | unknown;
  onError?: (error?: TError) => void | Promise<void> | unknown;
  onSettled?: () => void | Promise<void>;
};

export function AsyncButton<TData = unknown, TError = unknown>({
  action,
  loadingText,
  onSuccess,
  onError,
  onSettled,
  children,
  disabled,
  className,
  ...props
}: AsyncActionProps<TData, TError>) {
  const [isLoading, setIsLoading] = useState(false);

  const resolvedLoadingText = loadingText ?? children;

  const handleExecute = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.type !== "submit") event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const data = await action();
      await onSuccess?.(data);
    } catch (error) {
      await onError?.(error as TError);
    } finally {
      setIsLoading(false);
      await onSettled?.();
    }
  };

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={handleExecute}
      className={cn("grid grid-cols-1 place-items-center", className)}
    >
      <div
        className={cn(
          "col-start-1 row-start-1 flex items-center justify-center gap-2 transition-all",
          isLoading ? "invisible opacity-0" : "visible opacity-100",
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "col-start-1 row-start-1 flex items-center justify-center gap-2",
          isLoading ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        {resolvedLoadingText && <span>{resolvedLoadingText}</span>}
      </div>
    </Button>
  );
}
