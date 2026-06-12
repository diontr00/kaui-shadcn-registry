# KaUI

A personal collection of components that extend [shadcn/ui](https://ui.shadcn.com). Copy them, own them, ship them.

**Docs:** https://kaui-shadcn.vercel.app

## Install a component

```bash
pnpm dlx shadcn@latest add https://kaui-shadcn.vercel.app/r/<name>.json
```

Or add the namespace once and use the short form:

```bash
pnpm dlx shadcn@latest registry add @kaui "https://kaui-shadcn.vercel.app/r/{name}.json"
pnpm dlx shadcn@latest add @kaui/combobox
```

## Components

| Name                   | Type      | Description                                                |
| ---------------------- | --------- | ---------------------------------------------------------- |
| `async-button`         | component | Button with built-in loading, success, and error state     |
| `async-scope`          | component | Scope async state across a component tree                  |
| `confirm-action`       | component | Wrap any trigger to require confirmation before executing  |
| `combobox`             | component | Single-select with inline search and async loading support |
| `multi-select`         | component | Multi-pick combobox with toggle-based selection            |
| `use-async`            | hook      | Manage async lifecycle — loading, success, error, settled  |
| `use-debounce`         | hook      | Stable debounce with no stale-closure risk                 |
| `use-controlled-state` | hook      | Controlled/uncontrolled state bridge                       |

## Development

```bash
pnpm install
pnpm dev        # starts dev server + regenerates registry JSON
pnpm build      # type-check + build site + registry JSON
```

## License

MIT
