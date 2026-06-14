# KaUI

A personal registry of the components I actually ship — pulled from real projects and held to one bar. Copy them, own them, ship them.

**Docs:** <https://kaui-shadcn-registry.vercel.app>

---

## What this is

KaUI is the set of components and hooks I reuse across my own projects, packaged as a [shadcn/ui](https://ui.shadcn.com) registry so they drop into any shadcn app. It's growing — more land as I extract and harden them from production work.

The scope is broad and will keep widening. What stays constant is the bar every piece has to clear:

- **Typed for safety** — state is modeled with discriminated unions where it helps, so `data`/`error` are only reachable in the states they exist, and impossible states don't compile.
- **Controlled _and_ uncontrolled** — anything stateful works both ways, like the primitives in `@/components/ui` do.
- **No layout shift** — interactive states swap content without resizing.
- **Race-safe async** — anything that fires a request drops stale responses and never commits state after unmount.

If a component can't clear that bar, it doesn't ship here.

## The async core

The async primitives are the part that's furthest along, and they set the standard for everything else. The hard part of async UI isn't the spinner — it's the lifecycle underneath: dropping a stale response when a request fires twice, never committing after unmount, exposing `loading`/`success`/`error` as a union you can narrow, and keeping callbacks fresh without identity churn.

`useAsync` owns that lifecycle, and `async-button` / `async-scope` / `confirm-action` are built on top of it. Need the lifecycle without the UI? Use the hook directly:

```tsx
import { useAsync } from "@/hooks/use-async";

const { execute, isLoading, isSuccess, data, error } = useAsync({
  action: (id: string) => fetchUser(id),
});

// Calling execute again while in-flight drops the earlier response.
```

## Install a component

```bash
pnpm dlx shadcn@latest add https://kaui-shadcn-registry.vercel.app/r/<name>.json
```

Or register the namespace once and use the short form:

```bash
pnpm dlx shadcn@latest registry add @kaui "https://kaui-shadcn-registry.vercel.app/r/{name}.json"
pnpm dlx shadcn@latest add @kaui/async-button
```

## Components

| Name             | Type      | Description                                                         |
| ---------------- | --------- | ------------------------------------------------------------------- |
| `async-button`   | component | Button with built-in loading/success/error and no layout shift      |
| `async-scope`    | component | Coordination layer — decouple what fires an action from what reacts |
| `confirm-action` | component | Wrap any trigger to require confirmation before an async action     |
| `combobox`       | component | Single-select with inline search and async loading support          |
| `multi-select`   | component | Multi-pick combobox with toggle-based selection                     |

## Hooks

| Name                   | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| `use-async`            | Owns the async lifecycle — race-safe, typed, fresh callbacks           |
| `use-debounce`         | Stable `{ execute, cancel }` — no stale-closure risk, no `useCallback` |
| `use-controlled-state` | Controlled/uncontrolled state bridge for building two-way components   |

More components and hooks are added as I pull them out of real projects.

## Development

```bash
pnpm install
pnpm dev        # dev server + regenerates registry JSON on change
pnpm build      # type-check + build site + registry JSON
```

The registry is defined in [`registry.json`](./registry.json); source lives under `src/registry/base/`. Running `pnpm build` regenerates the served `r/*.json` files.

## Status

KaUI is under active development. Found a bug? [Open an issue](https://github.com/diontr00/kaui-shadcn-registry/issues).

## License

MIT
