import {
  createContext,
  useContext,
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  useAsync,
  type UseAsyncOptions,
  type UseAsyncReturn,
} from "@/registry/base/use-async/hooks/use-async";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AsyncScopeContext = createContext<UseAsyncReturn<
  unknown,
  unknown,
  []
> | null>(null);

/**
 * Read the async state from the nearest `AsyncScope`.
 *
 * ⚠️ The `TData` / `TError` generics are an **assertion, not a guarantee**.
 * Context can't infer them across the provider boundary, so you must pass the
 * same types the enclosing `<AsyncScope action={...}>` actually produces.
 * Mismatched generics compile cleanly but are wrong at runtime.
 */
export function useAsyncScope<
  TData = unknown,
  TError = unknown,
>(): UseAsyncReturn<TData, TError, []> {
  const ctx = useContext(AsyncScopeContext);
  if (!ctx) throw new Error("useAsyncScope must be used within AsyncScope");
  return ctx as UseAsyncReturn<TData, TError, []>;
}

export type AsyncScopeProps<
  TData = unknown,
  TError = unknown,
> = PropsWithChildren & UseAsyncOptions<TData, TError, []>;

/**
 * A coordination layer of async UI , decouples what fires an action from what reacts to it
 *
 * required : `action`
 */
export function AsyncScope<TData = unknown, TError = unknown>({
  children,
  action,
  onSuccess,
  onError,
  onSettled,
}: AsyncScopeProps<TData, TError>) {
  const state = useAsync<TData, TError, []>({
    action,
    onSuccess,
    onError,
    onSettled,
  });

  return (
    <AsyncScopeContext.Provider
      value={state as UseAsyncReturn<unknown, unknown, []>}
    >
      {children}
    </AsyncScopeContext.Provider>
  );
}

export type AsyncTriggerProps = Omit<ComponentProps<typeof Button>, "onClick">;

export function AsyncTrigger({
  children,
  disabled,
  ...props
}: AsyncTriggerProps) {
  const { isLoading, execute } = useAsyncScope();

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={() => execute()}
    >
      {children}
    </Button>
  );
}

export type AsyncContentProps = PropsWithChildren & {
  loadingFallback?: ReactNode;
  className?: string;
};

export function AsyncContent({
  children,
  loadingFallback,
  className,
}: AsyncContentProps) {
  const { isLoading } = useAsyncScope();

  return (
    <div className="grid grid-cols-1 items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 w-full",
          isLoading ? "invisible" : "visible",
          className,
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "visible" : "invisible",
        )}
      >
        {loadingFallback ?? <Loader2 className="size-6 animate-spin" />}
      </div>
    </div>
  );
}
