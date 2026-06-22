export type AvailableComponent =
  | "use-async"
  | "async-button"
  | "async-scope"
  | "confirm-action"
  | "use-debounce"
  | "use-controlled-state"
  | "use-filtered-options"
  | "combobox"
  | "multi-select"
  | "password-input";

export type AvailableDemo =
  | "async-button/basic"
  | "async-button/with-error"
  | "async-scope/basic"
  | "async-scope/multi-content"
  | "async-scope/error-retry"
  | "async-scope/with-status"
  | "confirm-action/basic"
  | "confirm-action/on-success"
  | "confirm-action/on-error"
  | "confirm-action/custom-trigger"
  | "confirm-action/with-media"
  | "combobox/basic"
  | "combobox/with-addons"
  | "combobox/async-search"
  | "combobox/custom-render"
  | "combobox/create-option"
  | "multi-select/basic"
  | "multi-select/with-count"
  | "multi-select/async-search"
  | "multi-select/custom-render"
  | "multi-select/create-option"
  | "password-input/basic"
  | "password-input/with-rules"
  | "password-input/with-form"
  | "password-input/with-custom-options"
  | "password-input/advanced";

export type RegistryFileType =
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:page"
  | "registry:file"
  | "registry:style";

export type RegistryFile = {
  path: string;
  content?: string;
  type: RegistryFileType;
  target?: string;
};

export type TailwindConfig = {
  content?: string[];
  theme?: Record<string, unknown>;
  plugins?: string[];
};

export type Tailwind = {
  config?: TailwindConfig;
};

export type CssVars = {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

export type CssValue =
  | string
  | {
      [property: string]: CssValue;
    };

export type RegistryItemSchema = {
  name: string;
  type: RegistryFileType;
  description?: string;
  title?: string;
  author?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  tailwind?: Tailwind;
  cssVars?: CssVars;
  css?: Record<string, CssValue>;
  meta?: Record<string, unknown>;
  docs?: string;
  categories?: string[];
  extends?: string;
};
