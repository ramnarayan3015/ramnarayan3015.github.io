# Subscriptions Sub-Project — Design

**Date:** 2026-07-25
**Sub-project:** 2 of 5
**Status:** Design decided via council (Skeptic + Pragmatist + Critic + Architect). See rationale below.
**Depends on:** Sub-project 1 (Blog) being live.

## Goal

Let visitors subscribe to be notified of new blog posts, and notify Ram whenever someone subscribes. Solve for zero ongoing operational burden (Ram's day job is already MLOps).

## Constraints

- Static site on GitHub Pages (no backend, no serverless).
- Free-tier preferred at expected volume (0–100 subscribers).
- GDPR-compliant by default (Ram has EU-adjacent readers likely).
- No DIY code to maintain long-term — a personal blog should not be a production system.

## Decision

**Buttondown** (managed newsletter service) with three specific configurations that defuse the risks the Critic council voice raised:

1. **Double opt-in enabled** — GDPR-compliant subscription flow. Buttondown supports this natively in settings.
2. **RSS-to-email automation enabled** — Buttondown polls the blog's `/feed.xml` (built by sub-project 1) and auto-emails subscribers when new posts appear. Zero manual "write and send a newsletter" step, which removes the abandoned-list risk.
3. **RSS is first-class** on the blog — a "Subscribe via RSS" link sits next to the email form so technically-inclined readers can bypass email entirely (satisfies Skeptic's "tech readers use feed readers" objection).

### Why not the alternatives

- **RSS + Formspree** (Skeptic's pick): Formspree captures emails but has no path to actually email subscribers when new posts land. Ram would have to manually compose and send updates. Realistic outcome for a busy engineer: subscribers never get notified, subscription becomes a broken promise. RSS is kept as a first-class option regardless — but not as the only option.
- **Cloudflare Worker + Resend** (Critic's DIY pick): Real infra to maintain. Pragmatist's warning holds — ~20 hrs/yr of maintenance cost on a hobby project is worse than a $9/mo bill you don't have to pay yet.
- **Substack / Beehiiv**: Overlap with the blog. Substack in particular is a publishing platform; using it just for subscription capture is awkward.

### Notification-to-Ram channel

Buttondown offers built-in notification options; use **email** in phase 1:
- **Email**: Buttondown emails Ram at `srnath96@gmail.com` on every new subscriber (default). Immediate, human-readable.
- **Webhook** (deferred to phase 2): POST to a Zapier webhook piping to Slack/SMS if Ram wants a second channel later.

## Implementation Shape

### On the blog side (owned by sub-project 1's Jekyll setup)

**Include** at `_includes/subscribe.html`:
```html
<div class="subscribe">
  <h3>Get new posts by email</h3>
  <p>Double opt-in. Unsubscribe any time. No spam.</p>
  <form
    action="https://buttondown.email/api/emails/embed-subscribe/RAM_USERNAME"
    method="post"
    target="popupwindow"
    onsubmit="window.open('https://buttondown.email/RAM_USERNAME', 'popupwindow')"
    class="embeddable-buttondown-form">
    <label for="bd-email" class="sr-only">Email</label>
    <input type="email" name="email" id="bd-email" placeholder="you@example.com" required />
    <input type="submit" value="Subscribe" />
    <p class="rss-fallback">
      Prefer RSS? <a href="/feed.xml">Subscribe via RSS</a>.
    </p>
  </form>
</div>
```

**Placement** (referenced by `_layouts/post.html` and `_layouts/blog-index.html`):
- Bottom of every post (highest-intent moment).
- Bottom of `/blog/` index page.
- NOT on the portfolio homepage (would clutter; visitors go to `/blog/` to opt in).

**Styling**: `css/blog.css` (created in sub-project 1) adds a small block matching the dark-hero palette. `.sr-only` for the label (accessibility — no visible label, but screen readers read it).

### On the Buttondown side (one-time setup, ~15 min)

1. Create account, verify sender email.
2. Enable double opt-in in Settings → General.
3. Add feed URL `https://ramnarayan3015.github.io/feed.xml` in Settings → RSS-to-Email, set to "send new posts as email" on match.
4. Confirm email notifications on new subscribers are on (Settings → Notifications).
5. Replace `RAM_USERNAME` placeholder in `subscribe.html` with actual Buttondown username.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| GDPR non-compliance | Double opt-in enabled (#1 above); Buttondown handles unsubscribe links + preferences center |
| Abandoned-list (Ram never sends) | RSS-to-email automation (#2) — posts auto-send, no manual composing |
| Pricing cliff at 101 subs | Documented exit: export subscribers, migrate to Cloudflare Worker + Resend (still $0). Or pay $9/mo. Good-problem-to-have |
| Shared-IP deliverability | Accept for personal blog volume; if it becomes a problem, upgrade to paid tier (dedicated IP available) |
| Vendor shutdown / terms change | Subscriber list is exportable; migration path documented above |
| Bot signups | Double opt-in already filters most; Buttondown has honeypot fields on their form |
| Embed form style conflict with existing CSS | Scoped to `.embeddable-buttondown-form` class; blog CSS resets input styles in-scope only |

## Non-Goals

- **No custom subscription backend** — the whole point of choosing a managed service.
- **No signup form on the portfolio homepage** — subscription is a blog-specific action, not a portfolio-wide CTA.
- **No paid tier commitment** upfront — free tier is sufficient at expected volume.
- **No webhook/Slack notification** in phase 1 — email is enough; add webhook later if Ram wants it.

## Open Questions

None. Council resolved. Placeholder to fill in during implementation: `RAM_USERNAME` = Ram's chosen Buttondown handle.
