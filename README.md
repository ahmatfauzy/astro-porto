## Quick Start

### Environment Requirements

In addition to Bun and Git, the production build **heavily depends on Python 3, FontTools, and Brotli**. `bun run build` generates WOFF2 font subsets based on CJK characters used in the UI and content; without these tools the build will fail.

It is recommended to install Python dependencies in the project's virtual environment. You don't need to activate the virtual environment — the build script automatically prioritizes `.venv`:

macOS / Linux:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip fonttools brotli
```

Windows (PowerShell or Command Prompt):

```powershell
py -3 -m venv .venv
.venv\Scripts\python.exe -m pip install --upgrade pip fonttools brotli
```

Verify the font subsetting environment with:

```sh
bun run fonts:ui
```

Install dependencies:

```sh
bun install
```

Run the development server:

```sh
bun run dev
```

Build for production:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Replacing Content for the First Time

Most personal content can be updated without touching components; prioritize editing the following files:

```text
src/config/site.toml        site title, profile, navigation, home modules, comments, search, theme
src/content/about.mdx       about page
src/content/blog/           blog posts and guide modules
src/content/projects/       project entry and project documentation
src/content/vibe/           lightweight dynamics and life fragments
public/images/              logo, avatar, site preview, and static images
```

Content can be created using the built-in scripts:

```sh
bun run post:new my-first-post
bun run post:new my-interactive-post --mdx
bun run project:new my-project
bun run vibe:new today-cloud
bun run media:new my-favourite-book
bun run post:new private-draft src/content/drafts
```

All page content scripts follow the pattern
`bun run <page-shorthand>:new <file-name> [optional-output-directory]`. The file name is safely sanitized and used as both the output basename and the initial `title`; if no directory is specified, the default content directory for the related template is used.
`--md`, `--mdx`, or a file name extension can override the template's default extension. Default frontmatter and content live in `templates/default.md` released with each page package; the blog template lives at
`scripts/templates/post.md` and can be edited directly without touching TypeScript.

## Routes

```text
/                  personal dashboard home
/blog             writing archive and module guides
/blog/[slug]      blog article page
/projects         project documentation entry
/projects/[slug]  project detail page
/vibe             short notes timeline
/about            about page
/cv               CV viewer (embeds /cv.pdf)
/rss.xml          RSS feed
```

## Site Configuration

Site-level information is centralized in `src/config/site.toml`:

- `[config.site]`: site title, description, repository URL, and footer note.
- `[config.profile]`: author name, handle, role, avatar, website, GitHub, email, etc.
- `[[config.topNav.links]]`: top navigation links.
- `[config.theme]`: built-in palette selection.
- `[config.search]`: search entry, shortcut, placeholder text, and result count.
- `[config.comments]`: comment toggle and comment provider.
- `[config.vibe]`: Vibe timeline display behavior.
- `[config.home]`: home quote, intro, navigation cards, contacts, and current focus.

The configuration structure is validated by the Zod schema in `src/content.config.ts`. If a field is missing or has a wrong type, `bun run build` will immediately report an error so issues are detected quickly.

## Content Model

Blog posts, project docs, and the About page share the same article schema:

```yaml
title: "Article Title"
description: "Short summary for archive pages and metadata."
date: "2026-05-18"
draft: false
heroImage: "/src/assets/figure/example.png"
showHeroImage: true
tags:
  - Astro
comments: true
sidebar:
  enable: true
  toc: true
  relatedPosts: true
```

`sidebar` controls the article's supporting area:

- `enable`: whether to enable the sidebar block.
- `toc`: whether to show the table of contents navigation.
- `relatedPosts`: whether to show related articles.

Regular blog posts are suitable for showing reading tools by default; `/about` and some project pages can be configured without a sidebar, using a centered reading layout.

Projects extend the base schema with:

```yaml
icon: palette        # card icon (lucide)
iconColor: "#667d6d" # optional CSS color
authors:
  - name: "Ahmat Fauzi"
    url: "https://github.com/ahmatfauzy"
links:
  - label: "Google Play"
    href: "https://play.google.com/store/apps/details?id=id.ac.harkatnegeri.jagamata"
    kind: platform   # github | website | platform | docs | demo
tags: [Flutter, Flask]
```

`links` are rendered as preview cards below the title on `/projects/[slug]`.

## Search

This project uses Pagefind to generate a static full-text search index. The search button in the top navigation can be clicked to open, and it also supports the `Ctrl+K` / `Cmd+K` shortcut.

```toml
[config.search]
enabled = true
shortcut = "mod+k"
placeholder = "Search notes..."
maxResults = 6
```

`bun run build` will first run the Astro build, then generate the `dist/pagefind` index for `dist`. In development, if the production index does not exist yet, the search panel will show an index-unavailable warning; after running a single production build, you can use `bun run preview` to fully test the search experience.

## Comments

The project supports configurable comment systems:

- `giscus`
- `utterances`
- `waline`
- `none`

Centralized configuration in `src/config/site.toml`:

```toml
[config.comments]
enabled = true
provider = "giscus"
show_on_posts = true
```

Comments can also be disabled per article in frontmatter:

```yaml
comments: false
```

## Project Structure

```text
public/
  images/                 logo, preview image, and static images
  cv.pdf                  CV PDF served at /cv.pdf and embedded at /cv
src/
  assets/                 content images and local fonts
  components/
    article/              article header components
    blog/                 top nav, search, table of contents, and related posts
    cards/                home cards
    comments/             comment provider components
    layout/               home dashboard layout
    mdx/                  MDX content components
    widgets/              writing activity and tool components
    Icon.astro            unified icon adapter
  content/
    about.mdx             about page content
    blog/                 Markdown / MDX blog and module guides
    projects/             project entry and project documentation
    vibe/                 lightweight short notes
  config/site.toml        site configuration
  data/site.ts            TOML config reader helper
  layouts/                base layout and article layout
  pages/
    index.astro           dashboard home
    about.astro           about route
    cv.astro              CV viewer (Google Docs/local PDF)
    blog/                 blog routes
  styles/                 global theme, palettes, typography, and layout variables
```

## Tech Stack

- Astro 6
- Bun
- Tailwind CSS 4 via Vite
- Pagefind
- `@astrojs/mdx`
- `@astrojs/rss`
- `@astrojs/sitemap`
- `lucide-astro`
- `sharp`
