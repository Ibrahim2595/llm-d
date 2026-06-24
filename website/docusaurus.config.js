// @ts-check
// See https://docusaurus.io/docs/api/docusaurus-config
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes as prismThemes } from 'prism-react-renderer';
import { makeDocsPreprocessor } from './scripts/lib/preprocess.mjs';

const GITHUB_REPO = 'https://github.com/llm-d/llm-d';
const LATEST_VERSION = '0.7.0';

// Self-adjusting versioning: only wire up the version map once the snapshot
// exists. This lets `npm run version:cut` recreate versioned_docs/ without the
// config referencing a version that is momentarily absent.
const siteDir = path.dirname(fileURLToPath(import.meta.url));
const versionsFile = path.join(siteDir, 'versions.json');
const releasedVersions = fs.existsSync(versionsFile)
  ? JSON.parse(fs.readFileSync(versionsFile, 'utf8'))
  : [];
const docsVersions = releasedVersions.includes(LATEST_VERSION)
  ? {
      lastVersion: LATEST_VERSION,
      versions: {
        current: { label: 'dev', path: 'dev', banner: 'unreleased' },
        [LATEST_VERSION]: { label: `v${LATEST_VERSION}`, path: '', badge: true },
      },
    }
  : {};

/** Docs live in ../docs and ../guides; sync-docs.mjs vendors them into docs/.
 *  Map a synced doc back to its source file for the "Edit this page" link. */
function docsEditUrl({ versionDocsDirPath, docPath }) {
  // Only the current ("next") version maps cleanly back to the live source tree.
  if (versionDocsDirPath !== 'docs') return undefined;
  return docPath.startsWith('guides/')
    ? `${GITHUB_REPO}/edit/main/${docPath}`
    : `${GITHUB_REPO}/edit/main/docs/${docPath}`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'llm-d',
  tagline: 'Kubernetes-native, high-performance distributed LLM inference',
  favicon: 'img/llm-d-favicon.png',

  url: 'https://llm-d.ai',
  baseUrl: '/',

  organizationName: 'llm-d',
  projectName: 'llm-d',

  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    // .md -> CommonMark (forgiving of the raw HTML in the vendored GitHub docs),
    // .mdx -> MDX (blog posts, community index/events, getting-started).
    format: 'detect',
    mermaid: true,
    // Render-time fixes for the pristine docs copy (links/braces/intro slug).
    preprocessor: makeDocsPreprocessor({
      repoRoot: path.resolve(siteDir, '..'),
      docsDir: path.join(siteDir, 'docs'),
    }),
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.js',
          editUrl: docsEditUrl,
          // Native versioning: the synced docs/ are the unreleased "dev" version;
          // released versions are frozen snapshots under versioned_docs/.
          includeCurrentVersion: true,
          ...docsVersions,
        },
        blog: {
          path: 'blog',
          routeBasePath: 'blog',
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          editUrl: `${GITHUB_REPO}/edit/main/website/`,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
        },
      }),
    ],
  ],

  plugins: [
    // Community section as its own docs instance (mirrors docusaurus.io/community).
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: './sidebarsCommunity.js',
      },
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    // Offline full-text search (docs + blog + community).
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: ['/docs', '/community'],
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/llm-d-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'llm-d-0-7-0',
        content:
          '🎉 <b>llm-d 0.7.0 is now available!</b> <a href="/docs">Browse the docs →</a>',
        textColor: '#ffffff',
        isCloseable: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        logo: {
          alt: 'llm-d',
          src: 'img/llm-d-logotype-and-icon.svg',
          srcDark: 'img/llm-d-logotype-and-icon.svg',
          href: '/',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'docSidebar',
            sidebarId: 'communitySidebar',
            docsPluginId: 'community',
            position: 'left',
            label: 'Community',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          {
            href: GITHUB_REPO,
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
          {
            href: 'https://llm-d.ai/slack',
            position: 'right',
            className: 'header-slack-link',
            'aria-label': 'llm-d Slack',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/docs' },
              { label: 'Architecture', to: '/docs/architecture' },
              { label: 'Guides', to: '/docs/guides' },
              { label: 'API Reference', to: '/docs/api-reference' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Welcome', to: '/community' },
              { label: 'Contributing', to: '/community/contribute' },
              { label: 'Events', to: '/community/events' },
              { label: 'Code of Conduct', to: '/community/code-of-conduct' },
            ],
          },
          {
            title: 'More',
            items: [
              { label: 'Blog', to: '/blog' },
              { label: 'GitHub', href: GITHUB_REPO },
              { label: 'Slack', href: 'https://llm-d.slack.com' },
              { label: 'X / Twitter', href: 'https://x.com/_llm_d_' },
            ],
          },
        ],
        logo: {
          alt: 'Cloud Native Computing Foundation',
          src: 'img/cncf-white.png',
          href: 'https://cncf.io',
          width: 130,
        },
        copyright: `Copyright © ${new Date().getFullYear()} llm-d Authors. Apache 2.0 License.<br/>llm-d is a Cloud Native Computing Foundation Sandbox project.`,
      },
      prism: {
        theme: prismThemes.oneLight,
        darkTheme: prismThemes.oneDark,
        additionalLanguages: ['bash', 'yaml', 'json', 'toml', 'promql'],
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'dark' },
      },
    }),
};

export default config;
