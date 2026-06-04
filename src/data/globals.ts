import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { AvailableComponent, AvailableDemo } from "./types";

function lazyNamed<
  TModule extends Record<string, unknown>,
  TKey extends keyof TModule,
>(
  loader: () => Promise<TModule>,
  name: TKey,
): LazyExoticComponent<ComponentType<any>> {
  return lazy(async () => {
    const module = await loader();
    const component = module[name];

    if (!component) {
      throw new Error(`lazyNamed: export "${String(name)}" was not found.`);
    }

    return {
      default: component as ComponentType<any>,
    };
  });
}

export const demos: Record<
  AvailableDemo,
  LazyExoticComponent<ComponentType<any>>
> = {
  "async-button/basic": lazyNamed(
    () => import("@/registry/examples/async-button/basic"),
    "BasicAsyncButton",
  ),
  "confirm-action/basic": lazyNamed(
    () => import("@/registry/examples/confirm-action/basic"),
    "BasicConfirmAction",
  ),
  "confirm-action/with-follow-up": lazyNamed(
    () => import("@/registry/examples/confirm-action/with-follow-up"),
    "WithFollowUpConfirmAction",
  ),
  "confirm-action/error": lazyNamed(
    () => import("@/registry/examples/confirm-action/error"),
    "ErrorConfirmAction",
  ),
  "confirm-action/require-confirm": lazyNamed(
    () => import("@/registry/examples/confirm-action/require-confirm"),
    "RequireConfirmAction",
  ),
} as const;

export type { AvailableComponent, AvailableDemo };
