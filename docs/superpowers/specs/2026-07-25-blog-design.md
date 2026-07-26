# Blog Sub-Project — Design

**Date:** 2026-07-25
**Sub-project:** 1 of 5 (blog → subscriptions → personal projects → hamburger fix → currently-studying section)
**Status:** Design approved by user; awaiting spec review before plan.

## Goal

Add a first-class blog to `ramnarayan3015.github.io` that Ram can author in Markdown, publish by `git push`, and that fits the existing portfolio's visual identity without touching the hand-crafted portfolio HTML.

## Constraints

- **Host:** GitHub Pages (static; no backend, no serverless).
- **Existing site:** Hand-crafted `index.html` + `page1.html`…`page7.html` (30–80 KB each). These MUST stay untouched except for a single nav link addition on `index.html`.
- **Existing CSS:** `css/` directory (14 stylesheets). The blog reuses these — no new design system.
- **No CI:** GitHub Pages' native Jekyll build handles publishing on push.

## Architecture

Additive Jekyll layout. Jekyll only owns `_posts/`, `_layouts/`, and the two new landing pages. All existing HTML files remain plain and are served as-is by GitHub Pages.

```
/                                       # repo root, GitHub Pages source
├── index.html                          # existing — one nav link + one teaser section added
├── page1.html … page7.html             # existing — untouched
├── portfolio_sample.html               # existing — untouched
├── css/                                # existing — reused by blog layouts
├── img/                                # existing — reused for post images
├── js/                                 # existing — reused
├── Components/                         # existing — untouched
├── _config.yml                         # NEW — site metadata, permalink pattern, plugins
├── _layouts/
│   ├── default.html                    # NEW — wraps <head>/<body>, links css/*
│   ├── blog-index.html                 # NEW — post listing (extends default)
│   └── post.html                       # NEW — single post (extends default)
├── _includes/
│   ├── blog-header.html                # NEW — top bar with logo + "← Portfolio"
│   └── post-card.html                  # NEW — listing card partial
├── _posts/
│   └── 2026-07-28-example.md           # NEW — Markdown posts, Jekyll-standard name
├── blog.html                           # NEW — /blog/ landing (2-line frontmatter: layout + permalink: /blog/)
├── feed.xml                            # NEW (auto via jekyll-feed plugin) — RSS
├── Gemfile                             # NEW — pins Jekyll + plugins for local dev parity
└── .gitignore                          # existing — add `_site/`, `.jekyll-cache/`
```

**`index.html` gets Jekyll frontmatter** (two lines added to top):
```yaml
---
layout: null
---
```
This lets Jekyll process the file at build time so the teaser (see Discovery) can render via a Liquid loop. Verified safe: `grep '{{\|{%' index.html` returns 0 matches, so no existing content will be misinterpreted as Liquid syntax.

**Build:** GitHub Pages runs `jekyll build` automatically on push to `main`. Local preview: `bundle exec jekyll serve`.

**Plugins** (all in the GitHub-Pages allowlist — no custom plugins, because GitHub Pages runs Jekyll in `--safe` mode and rejects them):
- `jekyll-feed` — RSS at `/feed.xml`
- `jekyll-seo-tag` — meta/OG tags per post
- `jekyll-sitemap` — `/sitemap.xml`
- `jekyll-paginate-v2` — optional, only if post count grows past ~20

## Post Shape

**Frontmatter** (required + optional):

```yaml
---
layout: post
title: "Post title"
date: 2026-07-28 09:00:00 -0500
tags: [mlops, genai]         # free-form list, no fixed taxonomy
excerpt: "One or two sentences shown on the blog index and homepage teaser."
image: /img/blog/post-slug/hero.png   # optional; used for OG card
---
```

- **Markdown:** GitHub Flavored Markdown (Kramdown, Jekyll default).
- **Syntax highlighting:** Rouge (Jekyll default). Dark theme selected in `_config.yml` to match the site's hero gradient (`#1e3a5f` → `#2c5170`).
- **Reading time:** computed in `post.html` layout from `content | number_of_words | divided_by: 200`.
- **RSS:** auto — `jekyll-feed` pulls from `_posts/`.
- **No comments** — personal blog; direct discussion via LinkedIn/GitHub links in footer.

## Discovery & Navigation

**Nav link on `index.html`:** insert one `<li>` in the existing `.main-nav-list`:

```html
<li><a href="/blog/" class="main-nav-link">Blog</a></li>
```

(Placed between "Portfolio" and "Work Experience" — natural discovery order.)

**"Recent Writing" homepage teaser:** a new section on `index.html` between "Portfolio" and "Work Experience", showing the 3 most recent posts as cards (title, date, excerpt, tags). Because `index.html` is served as plain HTML (not Jekyll-processed), and because GitHub Pages runs Jekyll in `--safe` mode (no custom plugins), the teaser is populated by a **local build script**:

- **Mechanism:** `scripts/build-recent-posts.js` — a small Node script that reads `_posts/*.md`, extracts frontmatter for the 3 newest, and patches a marked block in `index.html`:

  ```html
  <!-- RECENT_POSTS_START -->
  … cards rendered from post frontmatter …
  <!-- RECENT_POSTS_END -->
  ```

- **Author workflow:** run `npm run posts:refresh` (or configure it as a pre-commit hook) before `git push`. The patched `index.html` is committed to git.
- **Fallback:** if the author forgets to run the script, the teaser simply shows whatever was current at the last refresh — degrades gracefully, no breakage.
- **Data shape** written into each card: `{ title, url, date (ISO-8601), tags (string[]), excerpt }` extracted from `_posts/YYYY-MM-DD-slug.md` frontmatter.

**Post URL shape:** `/blog/:year/:month/:slug/` — set via `permalink: /blog/:year/:month/:slug/` in `_config.yml`. Good for SEO and archive readability.

**Blog top bar** (in `blog-header.html` include):
- Logo (same font/color as portfolio)
- "← Back to portfolio" link
- Tag filter chips (only rendered if there are posts with tags)

## Post Page Layout

- Constrained reading width (~65ch) centered.
- Typography inherited from `general.css` where possible; blog-specific overrides in a new `css/blog.css` (loaded only by blog layouts).
- Post meta row: date · reading time · tags.
- Bottom: prev/next post links + "← All posts".
- OG image auto-set from frontmatter `image` via `jekyll-seo-tag`.

## Deployment

- **Trigger:** push to `main`.
- **Builder:** GitHub Pages' Jekyll runner (no Actions workflow needed).
- **Local preview:** `bundle install && bundle exec jekyll serve` → `http://localhost:4000`.
- **Zero-config for the author** post-setup: write `.md`, run `npm run posts:refresh`, `git push`.

## Non-Goals

- No dark/light toggle for blog (site is already dark-themed).
- No search (fewer than ~30 posts doesn't warrant it; tag filter is sufficient).
- No comments, reactions, or view counters.
- No migration of existing portfolio pages to Jekyll (explicit non-goal — see Constraints).

## Open Questions

None. All decisions confirmed by user during brainstorming:
- Self-hosted on this site (not external platform)
- Jekyll + Markdown authoring
- Additive integration (no migration of existing HTML)
- Recent Writing teaser on homepage: yes

## Dependencies on Other Sub-Projects

- **Sub-project 2 (subscriptions)** depends on this being live — subscription form lives on the blog index and possibly at the bottom of each post. Form provider chosen in that sub-project's design.
- **Sub-project 3 (personal projects), 4 (hamburger fix), 5 (currently-studying)** are independent of this sub-project.
