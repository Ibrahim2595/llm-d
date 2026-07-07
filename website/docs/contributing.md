---
title: Contributing to the Docs
description: How to add and edit llm-d documentation pages.
---

# Contributing to the Docs

The docs are plain Markdown files under `website/docs/`. Add a file, and it shows up on the site — the sidebar builds itself from the folder structure. To change section labels, order, or collapse state, edit `website/menu-config.json` (not frontmatter or per-folder config files).

This page covers everything you need to write or change a doc.

## Add a page

1. Create a Markdown file anywhere under `website/docs/`, for example `docs/architecture/scheduling.md`.
2. Start it with a single H1. That heading becomes the page title and the sidebar label:

   ```md
   # Request scheduling

   How llm-d places requests across replicas.
   ```
3. Write the rest in normal Markdown. Save. The page appears in the sidebar under its folder.

Run `npm start` to preview at `http://localhost:3000`; the page reloads as you type.

## Frontmatter

Most pages need none — the H1 is the title and the folder decides placement. Add a frontmatter block (between `---` fences, at the very top) only when you want to override a default:

| Field | Use it to… |
| --- | --- |
| `title` | Set the browser/tab title if it should differ from the H1. |
| `description` | Write the meta description used for search and link previews. |
| `slug` | Change the page's URL path. |

Do **not** use `sidebar_position` or `sidebar_label` in doc frontmatter — sidebar order and labels for pages are configured in `menu-config.json` (see below).

```md
---
description: Deploy an optimized baseline on any accelerator.
---

# Optimized baseline
```

## Sidebar layout (`menu-config.json`)

All sidebar section labels, order, collapse state, and per-page ordering live in one file: [`website/menu-config.json`](../menu-config.json).

```json
{
  "categories": {
    "getting-started": {
      "label": "Getting Started",
      "position": 1,
      "collapsed": false
    },
    "well-lit-paths/foundations": {
      "label": "Foundations",
      "position": 1
    }
  },
  "pages": {
    "getting-started/quickstart": { "position": 1 },
    "contributing": { "position": 99, "label": "Contributing" }
  }
}
```

- **`categories`** — keyed by folder path under `docs/` (use slashes for nested folders, e.g. `infrastructure/providers/aks`). Controls section headings and order among siblings.
- **`pages`** — keyed by doc id (path without extension). Controls order and optional sidebar label within a folder.

New docs appear automatically without a `pages` entry; they sort alphabetically among siblings with no position. Add a `pages` entry when you need explicit order or a custom sidebar label.

For a section landing page (what opens when someone clicks the section itself), add an `index.md` or `index.mdx` to the folder.

## Order

Sections are ordered by `categories.<path>.position`; pages within a section by `pages.<id>.position`. Anything without a position falls back to alphabetical order.

## Images

Put image files under `static/img/docs/` and reference them with an absolute path — `static/` is served from the site root:

```md
![Scheduler flow](/img/docs/architecture/scheduler-flow.svg)
```

## Links

- **To another doc** — a relative path with the extension. These are validated at build time.
- **To a section** — link by its URL.
- **External** — a normal URL.

```md
[Quickstart](./quickstart.md)
[EPP config](../architecture/core/router/epp/configuration.md)
[Well-Lit Paths](/docs/well-lit-paths)
[vLLM](https://docs.vllm.ai)
```

## Check your work

Before opening a PR:

```bash
npm run build
```

The build prints a warning for every broken link or missing anchor. Fix them — a clean build is the bar for merging.

## Versions

`website/docs/` is the **current (dev)** version — this is what you edit. The `versioned_docs/` folder holds **frozen snapshots** of past releases (`0.7`, `0.8`); never edit those by hand. A maintainer cuts a new frozen version at release time:

```bash
npm run version:cut -- 0.9
```
