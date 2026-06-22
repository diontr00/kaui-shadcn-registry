# KaUI

A personal shadcn/ui registry. Components and hooks I develop , use, packaged so they drop into any shadcn app.

**Docs:** <https://kaui-shadcn-registry.vercel.app>

---

This started as a place to stop copy-pasting the same async button between projects. It's grown from there. Every piece comes from real work: problems I kept solving the same way, patterns I wanted to own rather than depend on a library for.

Because this is personal, the coverage is uneven. The async core has been through a lot. The newer stuff hasn't. If you use something and it breaks on a case I haven't hit, [open an issue](https://github.com/diontr00/kaui-shadcn-registry/issues) , that's would be very appreciate and how the collection will be improves.

## Components

| Name             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `async-button`   | Button with loading/success/error states and no layout shift               |
| `async-scope`    | Decouple what fires an action from what reacts to it                       |
| `confirm-action` | Require confirmation before an async action fires                          |
| `combobox`       | Single-select with inline search and async loading                         |
| `multi-select`   | Multi-pick combobox with toggle-based selection                            |
| `password-input` | Password field with show/hide, zxcvbn strength scoring, and rule checklist |
| `input-group`    | Prefix, suffix, and icon slots for text inputs                             |

## Hooks

| Name                   | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `use-async`            | Async lifecycle : race-safe, typed, fresh callbacks                     |
| `use-debounce`         | Stable `{ execute, cancel }` without stale-closure risk                 |
| `use-controlled-state` | Controlled/uncontrolled bridge for building composable inputs           |
| `use-filtered-options` | Client-side filtering with async override for combobox-style components |

More get added when I pull something reusable out of a project.

## Development

```bash
pnpm install
pnpm dev    # starts the docs site at localhost:4321
pnpm build  # type-check + build + regenerates r/*.json from registry.json
```

Registry source lives under `src/registry/base/`. The `r/*.json` files served by the shadcn CLI are generated at build time — don't edit them by hand.

## License

MIT
