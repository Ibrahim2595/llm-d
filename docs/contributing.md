---
draft: true
---

# Contributing to the docs

The docs site builds itself straight from this `docs/` folder. Whatever lives here is what ships: add a page and it shows up, add a folder and it becomes a section in the sidebar. All your work happens right here — you never touch the website repo.

There are only two things to know.

## Folders → `_category_.json`

Any folder that holds more than one page needs a small `_category_.json` that tells the sidebar how the section should look:

```json
{
  "label": "Well-Lit Paths",
  "position": 2,
  "collapsed": false
}
```

- **`label`** (use this) — the name people see in the sidebar, so a folder named `well-lit-paths` can read as "Well-Lit Paths".
- **`position`** (use this) — where the section sits among its siblings. Lower numbers come first.
- **`collapsed`** (optional) — whether the section starts open (`false`) or closed (`true`). Leave it out and it starts collapsed.

One file per folder, no matter how many pages are inside.

**A folder with a single page** (just a `README.md`) doesn't need a `_category_.json` — it renders as one page, named after that file, instead of a section.

## Pages → frontmatter (optional)

Each `.md` page can set options in a block at the very top. All of these are optional — add them when you want to override the default:

```yaml
---
sidebar_position: 1
sidebar_label: Tiered Cache
title: Tiered Prefix Cache
draft: true
---
```

- **`sidebar_position`** — where the page sits within its section. Without it, pages sort alphabetically.
- **`sidebar_label`** — the name in the sidebar. Defaults to the page's title.
- **`title`** — the page title. Defaults to the first `#` heading.
- **`draft`** — `draft: true` keeps the page off the published site while it's still cooking. Delete the line when it's ready to ship.

That's it. Edit the Markdown here, and the sidebar and pages follow.
