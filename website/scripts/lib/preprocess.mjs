/**
 * preprocess.mjs — build-time Markdown preprocessor (markdown.preprocessor).
 *
 * website/docs is the committed docs home. Two kinds of pages need link fixups,
 * applied here so the source files stay clean:
 *
 *  - DOC pages (copied from llm-d/docs): in-tree links are left for Docusaurus;
 *    links into the folded guides go to the in-site How-to Guides page (same
 *    version); HTML <img> srcs point at the static copy (/img/docs/…); other
 *    out-of-tree links go to GitHub.
 *  - GUIDE pages (how-to-guides/<name>.md, copied from llm-d/guides/<name>/README.md):
 *    their relative links resolve against guides/<name>/, so links back into the
 *    docs become in-site links and everything else (manifests, helpers, images)
 *    goes to GitHub.
 */
import fs from 'node:fs';
import path from 'node:path';

const GH = 'https://github.com/llm-d/llm-d';
const GH_BLOB = `${GH}/blob/main`;
const GH_TREE = `${GH}/tree/main`;
const GH_RAW = `${GH}/raw/main`;
const IMAGE_EXT = new Set(['.png', '.svg', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.avif']);
const LINK_RE = /(!?)\[([^\]]*)\]\(\s*(<[^>]*>|[^)\s]+)([^)]*)\)/g;
const SECTIONS = ['getting-started', 'guides', 'architecture', 'api-reference', 'accelerators', 'well-lit-paths', 'operations', 'infrastructure'];

export function makeDocsPreprocessor({ repoRoot, docsDir }) {
  const foldedGuide = (name) => !!name && fs.existsSync(path.join(docsDir, 'how-to-guides', `${name}.md`));
  const isImg = (p) => IMAGE_EXT.has(path.posix.extname(p).toLowerCase());
  const relLink = (fromDir, to) => {
    const r = path.posix.relative(fromDir === '.' ? '' : fromDir, to);
    return r.startsWith('.') ? r : `./${r}`;
  };
  const githubFile = (repoRel) => {
    if (isImg(repoRel)) return `${GH_RAW}/${repoRel}`;
    let dir = false;
    try {
      dir = fs.existsSync(path.join(repoRoot, repoRel)) && fs.statSync(path.join(repoRoot, repoRel)).isDirectory();
    } catch {}
    return dir ? `${GH_BLOB}/${repoRel}/README.md` : `${GH_BLOB}/${repoRel}`;
  };

  // ctx = { base (repo dir the link resolves against), dir (file's dir under docs/), isGuide }
  const rewriteUrl = (url, ctx) => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('#') || url.startsWith('/')) return null;
    const m = url.match(/^([^#?]*)([#?].*)?$/);
    const p = m[1];
    const suffix = m[2] || '';
    if (!p) return null;
    const repoRel = path.posix.normalize(path.posix.join(ctx.base, p));

    if (repoRel.startsWith('docs/')) {
      const target = repoRel.slice('docs/'.length);
      if (!ctx.isGuide) {
        // doc -> doc: leave the original relative link (Docusaurus resolves it),
        // fixing only README.md -> README.mdx (the intro).
        if (/\.md$/i.test(p) && !fs.existsSync(path.join(docsDir, target)) && fs.existsSync(path.join(docsDir, target) + 'x')) {
          return `${p}x${suffix}`;
        }
        return null;
      }
      // guide -> doc: in-site only if the doc exists here (guide READMEs use the
      // upstream's remapped doc layout, which may differ); otherwise GitHub.
      const stem = target.replace(/\.mdx?$/, '').replace(/\/$/, '');
      const exists =
        ['', '.md', '.mdx'].some((e) => fs.existsSync(path.join(docsDir, stem + e))) ||
        ['README.md', 'README.mdx', 'index.md', 'index.mdx'].some((i) => fs.existsSync(path.join(docsDir, stem, i)));
      return exists ? relLink(ctx.dir, target) + suffix : githubFile(repoRel) + suffix;
    }

    const gm = repoRel.match(/^guides\/([^/]+)(?:\/README\.mdx?)?$/i);
    if (gm && foldedGuide(gm[1])) return `${relLink(ctx.dir, `how-to-guides/${gm[1]}`)}.md${suffix}`;

    if (repoRel.startsWith('..')) return `${GH_TREE}/${repoRel.replace(/^(\.\.\/)+/, '')}${suffix}`;
    return githubFile(repoRel) + suffix;
  };

  const rewriteImg = (src, ctx) => {
    if (/^([a-z]+:)?\/\//i.test(src) || src.startsWith('/') || src.startsWith('#') || src.startsWith('data:')) return null;
    const repoRel = path.posix.normalize(path.posix.join(ctx.base, src));
    if (repoRel.startsWith('docs/')) return `/img/docs/${repoRel.slice('docs/'.length)}`;
    return `${GH_RAW}/${repoRel.replace(/^(\.\.\/)+/, '')}`;
  };

  const escapeBraces = (line) =>
    line
      .split(/(`+[^`]*`+)/g)
      .map((s) => (s.startsWith('`') ? s : s.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')))
      .join('');

  return ({ filePath, fileContent }) => {
    if (!filePath.startsWith(docsDir + path.sep)) return fileContent;
    const isMdx = filePath.endsWith('.mdx');
    const dir = path.relative(docsDir, path.dirname(filePath)).split(path.sep).join('/') || '.';
    const isGuide = dir === 'how-to-guides';
    const guideName = isGuide ? path.basename(filePath).replace(/\.mdx?$/, '') : null;
    const base = isGuide
      ? guideName === 'index' ? 'guides' : `guides/${guideName}`
      : dir === '.' ? 'docs' : `docs/${dir}`;
    const ctx = { base, dir, isGuide };

    let content = fileContent.replace(/https?:\/\/llm-d\.ai\/img\//g, '/img/');
    content = content.replace(
      /((?:to|href)=")\/([a-z-]+)(?=["#/])/g,
      (full, pre, sec) => {
        // The docs renamed the "guides" section to "well-lit-paths"; map the
        // legacy upstream link so it resolves (the content now lives there).
        if (sec === 'guides') return `${pre}/docs/well-lit-paths`;
        return SECTIONS.includes(sec) ? `${pre}/docs/${sec}` : full;
      },
    );

    let inFence = false;
    return content
      .split('\n')
      .map((line) => {
        const fence = line.match(/^\s*(```+|~~~+)/);
        if (fence) inFence = !inFence;
        if (inFence || fence) return line;
        let out = line.replace(LINK_RE, (full, bang, text, raw, tail) => {
          const next = rewriteUrl(raw.replace(/^<|>$/g, ''), ctx);
          return next === null ? full : `${bang}[${text}](${next}${tail})`;
        });
        out = out.replace(/(<img\b[^>]*?\bsrc\s*=\s*")([^"]+)(")/gi, (full, pre, src, post) => {
          const next = rewriteImg(src, ctx);
          return next === null ? full : `${pre}${next}${post}`;
        });
        if (!isMdx) out = escapeBraces(out);
        return out;
      })
      .join('\n');
  };
}
