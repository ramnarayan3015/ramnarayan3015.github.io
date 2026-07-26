# Personal Projects Sub-Project — Design

**Date:** 2026-07-25
**Sub-project:** 3 of 5
**Status:** Design decided autonomously per user mandate. Inspired by https://alidarbehani.com/projects/.
**Depends on:** Sub-project 1 (Jekyll setup) for data-file support. Otherwise independent.

## Goal

Add a dedicated space for **personal experiments, side projects, and open-source work** — distinct from the existing "Portfolio" section (which showcases professional/employer work). Each project has an optional "Live" button that links to a deployed demo (Vercel / HuggingFace Spaces / Netlify / whatever fits the project), plus a GitHub button. Space also has a matching presence on GitHub itself.

## Constraints

- Portfolio side: additive to the existing Jekyll setup from sub-project 1.
- GitHub side: no new org (yet) — use profile-level pinning + a curated README + topic tags.
- Content is Ram-curated, not auto-scraped (quality > coverage).

## Portfolio-side design

### Page

- **URL:** `/projects/` (permalink set in the file's frontmatter).
- **Layout:** Vertical list per Ali Darbehani's `alidarbehani.com/projects/` style — each project full-width with a hero image, description, stack line, and action buttons. Denser than a card grid, better for showing architecture diagrams / screenshots.
- **File:** `projects.html` (Jekyll-processed, iterates over `site.data.projects`).

### Data source

`_data/projects.yml` — one entry per project, Ram-authored:

```yaml
- title: "Switchboard.ai"
  slug: switchboard
  description: >
    Multi-tenant AI orchestration platform. Routes user prompts across
    Claude / GPT / open models with per-company policy, cost tracking, and
    observability.
  stack: [Next.js, FastAPI, PostgreSQL, LangChain, Docker]
  image: /img/projects/switchboard.png       # optional
  live_url: https://switchboard.ai            # optional — presence triggers "Live" button
  github_url: https://github.com/ramnarayan3015/switchboard
  docs_url: https://docs.switchboard.ai       # optional

- title: "Portfolio Site"
  slug: portfolio
  description: This site. Static HTML + Jekyll blog on GitHub Pages.
  stack: [HTML, CSS, Jekyll, JavaScript]
  image: /img/projects/portfolio.png
  live_url: https://ramnarayan3015.github.io
  github_url: https://github.com/ramnarayan3015/ramnarayan3015.github.io
```

### Card shape (per entry)

```
┌───────────────────────────────────────────────────────────────────┐
│  [ hero image / architecture diagram — full-width ]               │
│                                                                   │
│  Title (h2)                                                       │
│  Description paragraph.                                           │
│                                                                   │
│  Stack: Next.js · FastAPI · PostgreSQL · LangChain · Docker       │
│                                                                   │
│  [ Live ↗ ]  [ GitHub ]  [ Docs ]      ← "Live" only if live_url  │
└───────────────────────────────────────────────────────────────────┘
                          ─── divider ───
```

- **Live button** rendered only when `live_url` is present. Green-ish accent for visual prominence (a project that ships > a project that doesn't).
- **GitHub button** always present (required field).
- **Docs button** only when `docs_url` is present.
- Buttons use the existing `.nav-cta` style pattern for consistency.

### Navigation & discovery

- **Add nav link** on `index.html`: `<a href="/projects/" class="main-nav-link">Projects</a>`, placed between "Portfolio" and "Blog".
- **Distinction from existing "Portfolio" section**: "Portfolio" = professional/employer work (anchor `#section-portfolio`). "Projects" = personal experiments. Both live on the site, but they answer different questions ("what have you shipped at work?" vs. "what do you build for fun / on the side?").
- **Cross-link**: bottom of `/projects/` has a "See professional work →" link back to `index.html#section-portfolio`.

### Deployment targets for "Live" demos

Not enforced — Ram picks per project. Common free-tier options documented so future-Ram doesn't re-research:

| Project type | Recommended free host |
|---|---|
| Next.js / React SPA | Vercel |
| Static site | GitHub Pages (subdomain of `ramnarayan3015.github.io`) or Cloudflare Pages |
| Python API / FastAPI | Render / Railway / HuggingFace Spaces (for ML) |
| Streamlit / Gradio / ML demo | HuggingFace Spaces |
| Docker container | Fly.io / Railway |

## GitHub-side design

Three additive changes to Ram's GitHub presence — no new org:

### 1. Repository topic tags

Every personal project repo gets the topic `personal-project`. Searchable via `github.com/ramnarayan3015?tab=repositories&topic=personal-project` and via the global topic page. One-line change per repo (Settings → Topics).

### 2. Pinned repos on profile

Pin up to 6 personal projects on `github.com/ramnarayan3015`. Visual anchor for anyone landing on the GitHub profile. Pick projects that also appear on the portfolio's `/projects/` page for consistency.

### 3. Curated profile README

Create/update `github.com/ramnarayan3015/ramnarayan3015` (the "special" profile README repo) to include a **Projects** section that mirrors `_data/projects.yml`:

```markdown
## 🛠️ Personal Projects

- **[Switchboard.ai](https://switchboard.ai)** — Multi-tenant AI orchestration. [`repo`](https://github.com/ramnarayan3015/switchboard) · [`docs`](https://docs.switchboard.ai)
- **[Portfolio Site](https://ramnarayan3015.github.io)** — This site. [`repo`](https://github.com/ramnarayan3015/ramnarayan3015.github.io)

Full list with more detail: **[ramnarayan3015.github.io/projects/](https://ramnarayan3015.github.io/projects/)**
```

Manually maintained for now (list is short). Automation via GitHub Actions (regenerate README from `projects.yml`) is a documented later phase — not worth building until list grows past ~10 items.

## Layout / styling

- New file: `css/projects.css` — vertical stack layout, image + text alternating rhythm, buttons styled to match `.nav-cta`.
- Reuses site-wide typography from `general.css`.
- Same dark hero-gradient palette; project cards use a subtle lighter panel to sit on top.

## Non-Goals

- **No dedicated GitHub org** — profile pinning is sufficient at this stage; revisit if project count exceeds ~15.
- **No auto-sync between GitHub and portfolio** — manual curation catches broken links early and keeps signal high.
- **No project categorization/tags in phase 1** — vertical list is short enough; add tags/filter only when list exceeds ~10.
- **No visitor comments / stars display** — pure showcase, not social.
- **No case-study long-form per project** — descriptions stay compact; if a project needs deep writeup, that's a blog post (sub-project 1) linked from the card.

## Open Questions

None. Ram will populate `_data/projects.yml` with real projects during implementation.
