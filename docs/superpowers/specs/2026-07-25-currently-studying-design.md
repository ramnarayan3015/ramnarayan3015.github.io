# Currently Studying Sub-Project — Design

**Date:** 2026-07-25
**Sub-project:** 5 of 5
**Status:** Design decided autonomously per user mandate. A few certification names still need Ram's confirmation (parked earlier in conversation).
**Depends on:** Sub-project 1 (Jekyll setup) for data-file support.

## Goal

Add a **"Currently Studying"** section that signals professional growth in progress — certifications and learning tracks Ram is actively pursuing. Distinct from the existing **Certifications** section (which shows completed credentials). Communicates: "here's what I'm investing in right now."

## Constraints

- Must not muddy the existing "Certifications" section (that's for shipped credentials).
- Should degrade gracefully as items complete (moved to Certifications) and new ones are added.
- Must be easy for Ram to maintain — one YAML file, no HTML edits.

## Placement

New section on `index.html`, placed **immediately after** the existing `#certifications` section (natural flow: what I have → what I'm working toward). Anchor `#currently-studying`. Add a corresponding nav link between "Certifications" and "Awards" in the main nav.

## Data source

`_data/learning.yml` — Ram-authored, one entry per credential or track:

```yaml
- name: "AWS Certified Generative AI Developer – Professional"
  issuer: AWS
  status: in-progress            # in-progress | planned | completed
  started_date: 2026-07-01       # ISO-8601, optional
  expected_completion: 2026-10-15
  url: https://aws.amazon.com/certification/certified-generative-ai-developer/
  notes: "Prereq: AI Practitioner (done) + ML Engineer Associate (in-progress)."

- name: "NVIDIA-Certified Associate: Generative AI and LLMs (NCA-GENL)"
  issuer: NVIDIA
  status: in-progress
  expected_completion: 2026-09-01
  url: https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/

- name: "Microsoft Certified: Azure AI App and Agent Developer Associate (AI-103)"
  issuer: Microsoft
  status: planned
  notes: "Successor to retired AI-102 (June 2026)."

- name: "Databricks Certified Generative AI Engineer Associate"
  issuer: Databricks
  status: planned

- name: "AI Fluency: Framework & Foundations"
  issuer: Anthropic
  status: in-progress
  url: https://anthropic.com/learn
  notes: "Free Anthropic Academy course."

- name: "System Design (ByteByteGo)"
  issuer: ByteByteGo
  status: in-progress
  notes: "Ongoing subscription — Alex Xu's course + newsletter."
```

Names above use the official 2026 forms researched earlier. Three items (Udemy AI Engineer course, specific NVIDIA cert scope, specific Anthropic credential) are parked — Ram will confirm before this section ships.

## Card / list shape

Compact — this section is a signal, not a portfolio. Vertical list, one line per entry:

```
┌───────────────────────────────────────────────────────────────────┐
│  🚀  AWS Certified Generative AI Developer – Professional         │
│      AWS · started Jul 2026 · target Oct 2026                     │
│      Prereq: AI Practitioner (done) + ML Engineer Associate…      │
│                                            [ In progress ]        │
├───────────────────────────────────────────────────────────────────┤
│  📚  NVIDIA-Certified Associate: Generative AI and LLMs           │
│      NVIDIA · target Sep 2026                    [ In progress ]  │
├───────────────────────────────────────────────────────────────────┤
│  🎯  Microsoft Certified: Azure AI App and Agent Developer        │
│      Microsoft                                    [ Planned ]     │
└───────────────────────────────────────────────────────────────────┘
```

- **Status pill** on the right: `in-progress` (accent color, warm) / `planned` (neutral gray) / `completed` (green).
- **Icon** on the left per status: 🚀 in-progress / 📚 planned / ✅ completed.
- **Second line**: issuer · started · target (compact e.g. "Oct 2026").
- **Third line** (optional): notes, subtler weight.
- Title links to `url` if present.

## Workflow: when Ram completes a cert

1. Update the entry's `status` from `in-progress` to `completed` in `_data/learning.yml`.
2. Add a corresponding entry to the existing Certifications section (however that section is currently populated — likely hardcoded HTML today; check during implementation).
3. Optionally keep the completed entry in `learning.yml` for 30 days with `status: completed` so it briefly shows in a "recently completed" tail, then delete.

Alternative to consider at implementation-plan time: **unify** Certifications + Currently Studying under one data file if Certifications isn't yet data-driven, so completed items just change status. Deferred.

## Layout / styling

- New file: `css/learning.css` — vertical list, compact rows, status pills.
- Matches the visual weight of the adjacent Certifications section.
- Icons are Unicode emoji (no icon library dependency).

## Nav

Add `<li><a href="#currently-studying" class="main-nav-link">Currently Studying</a></li>` in `index.html`, between Certifications and Awards.

## Non-Goals

- **No integration with credential platforms** (Credly, Accredible) — those belong in Certifications.
- **No progress tracking** beyond in-progress / planned / completed — % complete is noisy.
- **No general study log / reading list** — this is about credentials. Blog posts (sub-project 1) are the vehicle for reflection.

## Open Questions

Three items parked earlier, awaiting Ram's confirmation:

1. **Udemy AI Engineer track** — which course? Candidates: Ed Donner's *"LLM Engineering: Master AI, LLMs & Agents"* or a full-stack AI Engineer Bootcamp.
2. **NVIDIA certs** — NCA-GENL only, or also NCP-AIO / NCP-LLM (Professional)?
3. **Anthropic credential** — free *AI Fluency: Framework & Foundations* course, or *Claude Certified Architect* exam?

None blocks design; Ram fills in `_data/learning.yml` during implementation.
