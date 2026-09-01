---
name: gfuel-brand
description: Use when building, restyling, or reviewing ANY G FUEL landing page, Shopify section/template, marketing page, or visual asset — enforces the exact G FUEL brand identity (colors, Blunt/Acumin typography, spacing, radius, shadows, button + section recipes) so output matches gfuel.com instead of drifting to generic defaults. Also use when cloning a competitor/reference page (e.g. Javvy) and reskinning it to G FUEL.
license: Proprietary — G FUEL internal use.
---

# G FUEL Brand System

This skill is the single source of truth for making anything look like **G FUEL** (gfuel.com). It was built by reconciling three ground-truth sources: a live computed-style extraction of gfuel.com (designlang), the production Shopify theme CSS (`gfuel-theme/assets/*.css`), and the theme settings (`config/settings_data.json`). When they disagreed, the **production theme + live site** won over older docs.

## When to use this skill

Activate for: building a new G FUEL landing page or Shopify template, editing an existing section, generating on-brand imagery/SVGs, cloning a reference layout and reskinning it to G FUEL, or reviewing whether something is "on brand."

**Exception — licensed IP collab PDPs:** bespoke collab pages (Black Clover, Pragmata, Mighty Nein) *intentionally* leave this brand system — IP-native fonts and palettes instead of Blunt/Acumin/purple. Do not "correct" them back to brand; they're governed by `creating-gfuel-collab-pdp`. This skill still rules any shared component on those pages and everything G FUEL-owned.

## The #1 rule: never guess a value

Every brand decision below is a fixed value, not a vibe. When you need a color, font, radius, spacing, or shadow, **read it from `design-tokens.json` or run `scripts/apply_brand.py`** — do not approximate. Approximation is exactly why AI pages look "off."

For exact color application, run the deterministic helper rather than eyeballing hex:
```bash
python3 scripts/apply_brand.py color primary      # -> #461aa2
python3 scripts/apply_brand.py css-vars            # -> paste-ready :root block
python3 scripts/apply_brand.py button primary      # -> full button CSS
```

## Brand at a glance

**Voice:** energetic, gamer/esports, punchy. Headings are usually **UPPERCASE**, Title Case, tight. CTA verbs: SHOP NOW, FIND YOUR FLAVOR, ADD TO CART.

### Colors (canonical)
G FUEL runs a **two-purple system** — do not collapse them:

| Token | Hex | Role |
|---|---|---|
| `primary` | `#461aa2` | Brand purple — primary text, headings, brand fills. THE G FUEL purple. |
| `deep` | `#240164` | Deep indigo — dominant CTA/button background, dark interactive surfaces (most-used color on live site). |
| `accent` | `#3bbfef` | Electric cyan — accents, highlights, secondary CTAs, energy/hydration cue. |
| `violet` | `#5907C4` | Bright violet — Bundle-Builder / promo emphasis. |
| `stars` | `#f3e008` | Review-star yellow. |
| `error` | `#fc0000` | Errors / urgency. |
| `success` | `#22c55e` | Success / in-stock. |
| `bg` | `#ffffff` | Page background. |
| `text` | `#1a1a1a` | Body text on white. |
| `text-muted` | `#666666` | Secondary text. |
| `border` | `#e6e6e6` | Default borders. |
| `border-light` | `#f0f0f0` | Subtle dividers. |

Backdrops/overlays use the brand purple at low alpha: `rgba(70,26,162,0.40)`. Hero image overlays: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.5))`.

### Typography (canonical)
- **Display / headings:** `Blunt Regular` (also `Blunt Semicondensed` for tight contexts, `Blunt Wide` for wide display). Headings are typically **UPPERCASE**.
- **Body / UI:** `Acumin VF` (a.k.a. "Acumin Variable Concept"), `sans-serif` fallback.
- Never substitute Inter/Roboto/system fonts for headings — that instantly kills the brand.

Heading scale (from live site):

| Level | Size | Weight | Line-height | Font |
|---|---|---|---|---|
| h1 | 56px | 400 | 50.4px (0.9) | Blunt Regular, uppercase |
| h2 | 44px | 400 | 39.6px (0.9) | Blunt Regular, uppercase |
| h3 | 38px | 500 | 37.6px | Blunt Regular/Semicon |
| h4 | 38px | 400 | 34.2px | Blunt Regular |
| body | 16px | 400 | 24px (1.5) | Acumin VF |

Mobile: scale h1 down to ~36–40px. Headings keep `line-height` tight (~0.9–1.0).

### Spacing
- **Section padding:** 80px top/bottom desktop → 56px at ≤1024px → 40px at ≤768px.
- **Container gutter:** 36px desktop, 20px mobile.
- **Grid gap:** 16px (cards), 24px, 32px.
- **Spacing scale (px):** 8, 16, 20, 24, 32, 36, 40, 48, 56, 60, 64, 74, 80, 96, 121.
- **Product grid:** 4 cols desktop → 3 at ≤1200px → 2 at ≤768px.

### Border radius
| Token | Value | Use |
|---|---|---|
| `sm` | 8px | Inputs, small chips |
| `md` | 12px | Cards, containers |
| `lg` | 16px | Large cards, modals |
| `cta` | 40px (desktop) / 25px (mobile) | Primary buttons, gating CTAs |
| `pill` | 9999px | Pills, badges, qty steppers |

### Shadows
- `sm` — `0 2px 8px rgba(0,0,0,0.04)`
- `lg` — `0 4px 20px rgba(0,0,0,0.08)`
- `glow` (hover/energy accent) — `0 16px 34px -12px rgb(236,28,125)` (magenta glow) — use sparingly on featured CTAs.

### Buttons
- `button-primary` — filled. Background `#240164` (or `#461aa2`), white text, radius 40px, Acumin VF (semibold) or Blunt for shouty CTAs, generous horizontal padding (~24–32px), uppercase optional.
- `button-secondary-outline` — transparent bg, 1–2px brand-purple border, brand-purple text, same radius, fills on hover.
- `plain-link` — underlined text link in brand purple.

## Reference files (load as needed)
- `design-tokens.json` — the full W3C DTCG token set. Read this to get any exact value, or to emit a Tailwind/CSS-var theme.
- `scripts/apply_brand.py` — deterministic CLI for exact hex, CSS vars, and component CSS. Prefer this over hardcoding.
- `references/component-recipes.md` — copy-paste button/card/hero/section recipes in BOTH plain CSS and **Shopify Smart-Theme JSON** (how G FUEL landers are actually built).
- `references/asset-generation.md` — Higgsfield + Nano Banana on-brand image pipeline, SVG/PNG conventions, dimensions per slot.
- `references/cloning-workflow.md` — clone a reference URL (e.g. Javvy) A-to-Z, then reskin to G FUEL.
- `references/usage-examples.md` — good vs. bad, so you can see the target.

## Pre-ship checklist
- [ ] Colors come from the palette (#461aa2 / #240164 / #3bbfef) — no stray blues/greys.
- [ ] Headings are Blunt (uppercase where appropriate); body is Acumin VF — NO system/Inter fonts.
- [ ] Radius matches tokens (40px CTAs, 12–16px cards, 9999px pills).
- [ ] Section padding 80/56/40 responsive; gutter 36/20.
- [ ] Buttons use button-primary / button-secondary-outline patterns.
- [ ] Product grid 4→3→2 responsive with 16px gap.
- [ ] Every image slot has desktop + mobile versions.
- [ ] If a Shopify lander: unique section/block IDs, valid `block_order` + `order` arrays.
