---
title: Contributing to the Docs
description: How to add and edit llm-d documentation pages.
sidebar_position: 99
---

# Contributing to the Docs

The docs are plain Markdown files under `website/docs/`. Add a file, and it shows up on the site — the sidebar builds itself from the folder structure, so there's no config to edit and no list to register your page in.

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
| `sidebar_position` | Order this page within its folder (lower = higher up). |
| `sidebar_label` | Show a shorter label in the sidebar than the H1. |
| `title` | Set the browser/tab title if it should differ from the H1. |
| `description` | Write the meta description used for search and link previews. |
| `slug` | Change the page's URL path. |

```md
---
sidebar_position: 2
description: Deploy an optimized baseline on any accelerator.
---

# Optimized baseline
```

## Group pages into a section

A folder is a sidebar section. Drop a `_category_.json` in it to control how that section looks:

```json
{ "label": "Getting Started", "position": 1, "collapsed": false }
```

- `label` — the section heading in the sidebar.
- `position` — where the section sits among its siblings.
- `collapsed` — `false` to show the section expanded by default, `true` to keep it closed.

For a section landing page (what opens when someone clicks the section itself), add an `index.md` to the folder.

## Order

Sections are ordered by their `_category_.json` `position`; pages within a section by their `sidebar_position`. Anything without a number falls back to alphabetical, so set positions when order matters.

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
