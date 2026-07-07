# llmd-site — Go orchestrator for website/

Build, link-check, and image-verify the llm-d.ai Docusaurus site.

## Build

```bash
make llmd-site
# or
cd tools/llmd-site && go build -o ../../bin/llmd-site ./cmd/llmd-site
```

## Commands

| Command | Description |
|---------|-------------|
| `llmd-site build` | Run `landing:css` + `npm run build` |
| `llmd-site check links` | Crawl built site, validate links, write `broken-links-report.md` |
| `llmd-site check images` | Verify all images load via HTTP |
| `llmd-site ci` | Full CI pipeline: `build` + `check links` |

## Makefile shortcuts

```bash
make build
make check-links
make check-images
make ci
```
