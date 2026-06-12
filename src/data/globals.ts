import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { AvailableDemo } from "./types";

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

export const demos = {
  "async-button/basic": lazyNamed(
    () => import("@/registry/examples/async-button/basic"),
    "BasicAsyncButton",
  ),
  "async-button/with-error": lazyNamed(
    () => import("@/registry/examples/async-button/with-error"),
    "AsyncButtonWithError",
  ),
  "async-scope/basic": lazyNamed(
    () => import("@/registry/examples/async-scope/basic"),
    "BasicAsyncScope",
  ),
  "async-scope/multi-content": lazyNamed(
    () => import("@/registry/examples/async-scope/multi-content"),
    "MultiContentAsyncScope",
  ),
  "async-scope/error-retry": lazyNamed(
    () => import("@/registry/examples/async-scope/error-retry"),
    "ErrorRetryAsyncScope",
  ),
  "async-scope/with-status": lazyNamed(
    () => import("@/registry/examples/async-scope/with-status"),
    "WithStatusAsyncScope",
  ),
  "confirm-action/basic": lazyNamed(
    () => import("@/registry/examples/confirm-action/basic"),
    "BasicConfirmAction",
  ),
  "confirm-action/on-success": lazyNamed(
    () => import("@/registry/examples/confirm-action/on-success"),
    "WithFollowUpConfirmAction",
  ),
  "confirm-action/on-error": lazyNamed(
    () => import("@/registry/examples/confirm-action/on-error"),
    "ErrorConfirmAction",
  ),

  "confirm-action/custom-trigger": lazyNamed(
    () => import("@/registry/examples/confirm-action/custom-trigger"),
    "CustomTriggerConfirmAction",
  ),
  "confirm-action/with-media": lazyNamed(
    () => import("@/registry/examples/confirm-action/with-media"),
    "WithMediaConfirmAction",
  ),
  "combobox/basic": lazyNamed(
    () => import("@/registry/examples/combobox/basic"),
    "BasicCombobox",
  ),
  "combobox/with-addons": lazyNamed(
    () => import("@/registry/examples/combobox/with-addons"),
    "ComboboxWithAddons",
  ),
  "combobox/async-search": lazyNamed(
    () => import("@/registry/examples/combobox/async-search"),
    "AsyncSearchCombobox",
  ),
  "combobox/custom-render": lazyNamed(
    () => import("@/registry/examples/combobox/custom-render"),
    "CustomRenderCombobox",
  ),
  "combobox/create-option": lazyNamed(
    () => import("@/registry/examples/combobox/create-option"),
    "CreatableCombobox",
  ),
  "multi-select/basic": lazyNamed(
    () => import("@/registry/examples/multi-select/basic"),
    "BasicMultiSelect",
  ),
  "multi-select/with-count": lazyNamed(
    () => import("@/registry/examples/multi-select/with-count"),
    "MultiSelectWithCount",
  ),
  "multi-select/async-search": lazyNamed(
    () => import("@/registry/examples/multi-select/async-search"),
    "AsyncSearchMultiSelect",
  ),
  "multi-select/custom-render": lazyNamed(
    () => import("@/registry/examples/multi-select/custom-render"),
    "CustomRenderMultiSelect",
  ),
  "multi-select/create-option": lazyNamed(
    () => import("@/registry/examples/multi-select/create-option"),
    "CreatableMultiSelect",
  ),
} satisfies Record<AvailableDemo, LazyExoticComponent<ComponentType<any>>>;
