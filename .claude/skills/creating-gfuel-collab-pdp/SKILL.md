---
name: creating-gfuel-collab-pdp
description: Use when the user wants to build a G FUEL × IP collab product page (PDP) in the gfuel-theme Shopify repo — typically starts with an image/mockup or product art for a licensed collab (Critical Role, an anime, a game like PRAGMATA, etc.) and asks to "build this page", "make a PDP like the Mighty Nein one", or to upgrade an existing collab page ("make it cooler, like Black Clover"). Covers section scaffolding, the bespoke IP design-system tier, metafields, wait.li waitlist, countdown locks, mobile layout patterns, and the GitHub↔Shopify deploy + QA workflow.
license: Proprietary — G FUEL internal use.
---

# Building a G FUEL collab PDP

These are bespoke, art-directed product pages for **licensed IP collabs** (e.g. Critical Role: Mighty Nein — "Dust of Deliciousness Collector's Box"). Each is a single self-contained Liquid section + a template JSON, Liquid-driven from the assigned product. The user almost always starts with **an image mockup** of the page they want.

**Do not build from scratch.** The Mighty Nein PDP is the proven, production pattern. Copy it and reskin to the new IP. `example-section.liquid` in this skill folder is a full, working copy of the current live v1 section — use it as the scaffold.

## Where everything lives

- **Repo:** `gfuel-theme` — clones live under `~/codebase/` (`gfuel-theme` is often checked out on `dev`; a separate worktree, e.g. `~/codebase/gfuel-main`, holds `main`). **Check the branch before shipping** — only `main` deploys to the live theme.
- **Push account:** `lhuynhgfuel` (gh). Confirm with `gh auth status` — active account must be `lhuynhgfuel`, and `git remote -v` must show `github.com/lhuynhgfuel/gfuel-theme`. (Do NOT use the `CopywriterNull` account here — that's for other repos.)
- **Branch:** `main`.
- **Sections:** `sections/<slug>.liquid` (e.g. `pdp-cb-deliciousness.liquid`). Build an A/B pair when asked (`-v2`).
- **Templates:** `templates/product.<slug>.json` — points `main` at the section type.
- **Live theme:** `gfuel-theme/main` (`#140531531851`). GitHub `main` is bidirectionally synced to it (see Deploy).

## Workflow

### 1. Gather inputs
Confirm with the user:
- **IP / collab name** and the **product** it maps to (Shopify product handle).
- The **mockup image(s)** — study them for palette, fonts, decorative motifs, layout order, and which sections exist (gallery, what's-in-box, waitlist vs add-to-cart, benefits, accordions, trust row).
- **A/B?** One template or a v1/v2 pair.
- Whether the product is **coming-soon** (→ wait.li waitlist CTA) or **purchasable** (→ add-to-cart). The section handles both automatically via `product.available`.

### 2. Scaffold from the example
Copy `example-section.liquid` → `sections/<new-slug>.liquid`. It already contains: fonts, CSS design tokens, decorative layer, breadcrumb, framed gallery + thumbnails, "What's in the Box" card, info column (eyebrow/title/subtitle/flavor/price), waitlist/add-to-cart CTA, benefit chips, accordions, thumbnail JS, and the `{% schema %}`.

Then create `templates/product.<new-slug>.json`:
```json
{ "sections": { "main": { "type": "<new-slug>", "settings": {} } }, "order": ["main"] }
```

### 3. Reskin to the IP (match the mockup)
The base palette is a cream/gold/purple "fantasy" theme. Retheme via the CSS custom properties at the top of `.mn-pdp{ … }` — `--cream --panel --purple --purple-2 --gold --gold-2 --ink --muted --line` — plus the two fonts (`--serif`, `--disp`). These collab pages **intentionally deviate from the core G FUEL brand** to match the IP's world, so it's fine to swap fonts/colors wholesale. (For anything that must stay on core G FUEL brand — e.g. a shared component — consult the `gfuel-brand` skill.)

### 3b. The design-system tier ("make it cooler, like Black Clover")
A palette swap of the scaffold reads as a reskin; a major licensed IP usually deserves a **bespoke design system** — a themed world built from the IP, not recolored chrome. A palette-only page for a premium IP tends to get sent back with "make it cooler like Black Clover", so default to this tier for big licensed games/anime. The two production exemplars are `sections/pdp-cb-blackclover.liquid` (grimoire: Grenze Gothisch/Cinzel/Alegreya, parchment sheets, gold studs, anti-magic vein) and `sections/pdp-pragmata-hero.liquid` (lunar console: Michroma/IBM Plex Mono/Space Grotesk, bulkhead plates, HUD corner brackets, data-pip rule) — **copy the Black Clover section and re-theme it**; the Pragmata build proves the whole system ports in one pass, tub-only products included.

What the tier consists of (every exemplar has all of these):
1. **Three IP-native Google Fonts** loaded by `<link>` in the section — display / label (letterspaced caps for micro-type) / body. Theme Blunt/Acumin are *not* used.
2. **A reusable "sheet" panel chrome** — one `.xx-sheet` class: themed surface gradient, 1px themed border, inset hairline (`::before`), a texture overlay (scanlines, parchment), and a corner-ornament element (gold studs / HUD brackets) placed per panel.
3. **A signature divider** — the anti-magic vein / telemetry data-pip line, reused across panels.
4. **Tintable inline SVG-mask doodles** (`-webkit-mask-image` on `currentColor` spans) — 4–5 IP motifs used as page-margin sigils, accordion bullets, and feature icons. No icon uploads.
5. **Ceremony copy** — rotated stamp, licensed lockup ("Officially Licensed × G FUEL®"), letterspaced eyebrow/sub-lines, gradient-foil display title, and the IP's own vocabulary in headings ("Survey Log", "From the Grimoire").
6. **The Black Clover fold structure** — dossier plate left (stage with radial glow, thumbs *outside* the sheet) / buy panel right, 4-feature strip, meet-the-flavor checklist panel, FAQ-as-accordion-sheets (Description + Ingredients folded in; no separate comparison/reassurance strips), final art band with inverted-color CTA.
7. **BC's plumbing, verbatim** — its ATC handler (with `/cart/add.js` fetch fallback), the countdown lock with wait.li early-access bypass (`launch_time` setting), the inline-styled wait.li form, and the `ip-family-switcher` render with an `--ipf-*` variable override block scoped to your page.
8. **Motion, sparingly** — 1–3 subtle keyframe touches (stamp flicker, pip travel, star drift) all disabled under `prefers-reduced-motion`.

On phones, hide the plate furniture (`doshead`, sigils, plate footer) — it pushes the CTA below the fold — and cap the stage image with `max-height` (~255px).

Swap decorative PNGs in `assets/` (petals/vines/corners/flavor icon). Key out any transparency-checkerboard to real alpha before uploading. Reference them with `{{ 'name.png' | asset_url }}`.

Rename the CSS class prefix if you want (`mn-` → your IP), but it's optional — classes are scoped inside the section.

### 4. Wire data (metafields)
The section reads these, all with sensible fallbacks:
| Metafield | Used for |
|---|---|
| `custom.pdp_background` | Full-page background artwork (cream overlay applied). |
| `custom.collector_box_items` | "What's in the Box" images. Labels fall back to a fixed list. |
| `my_fields.product_flavor` | Flavor badge (fallback = section setting). |
| `custom.ingredients` | Ingredients accordion. |
| `custom.faq` | FAQ accordion. |
Section settings (theme editor): `title_text` (blank = product title), `eyebrow`, `subtitle`, `flavor`, plus any short-copy fields the mockup needs.

### 5. CTA lifecycle: Waitlist → Preorder → Add to Cart
The PDP CTA resolves in this priority order (implemented in both deliciousness sections; copy it for new collabs):

1. **wait.li campaign ACTIVE** → Join Waitlist, *regardless of stock state*. Activity comes from `{% render 'wait_li_config' %}` (first `|`-field == `'true'`), which reads the app-managed `wait_li.<product_id>` metafield. Deactivating the campaign in the wait.li APP (not inventory, not tags) is what releases the CTA.
2. **Available + tagged `pre-order`** → `PRE ORDER — {{ product.price | money }}` button, with a bold ship-date line under it: `📦 Preorder — ships {{ date }}`.
3. **Available, no tag** → `Add to Cart — {{ price }}`.
4. **Unavailable, no campaign** → waitlist fallback (renders nothing useful; acceptable).

**Preorder data conventions (theme-wide, cards + PDP):**
- Tag must be exactly `pre-order` (lowercase, hyphen) — card JS does a case-sensitive `tags.includes("pre-order")`.
- Ship date lives in metafield `custom.pre_order_shipping_date`. It's a TEXT field (e.g. "August 2026") — print it **verbatim**, never through a `| date:` filter (that force-parses "August 2026" into "August 1, 2026").
- Card-level preorder also requires the metafield to be non-empty AND variant available (see `assets/__section--card_product_card.js` `state.preorder`).

**Collection cards:** products tagged `waitlist` (case-insensitive) render a solid-purple JOIN WAITLIST card button that links to the PDP — overriding even in-stock Add-to-Cart (logic in `getCTAButtonProps`, class `gf-waitlist-cta` styled in `blocks/_card_product_card__cta_button.liquid`). Remove the `waitlist` tag when moving a product to preorder.

**Admin switch checklist (waitlist → preorder):** end the wait.li campaign in the app + remove `waitlist` tag + add `pre-order` tag + set `custom.pre_order_shipping_date` + keep product available.

### 5b. Add-to-Cart MUST use the theme cart API — two hard-won bugs
- **Never put the `wla_button` class on a native submit button.** That's wait.li's own class; its site-wide script (loads even when the campaign is off) binds clicks on `.wla_button`, kills the form submit, and strands the user on /cart with nothing added. Use a section-scoped class (e.g. `mn-atc-btn`) and duplicate the styling.
- **Never rely on a raw `{% form 'product' %}` POST.** The SPA router mangles the redirect (users reported landing on the homepage) and a raw post skips the preorder plumbing. Instead intercept submit and call the theme API exactly like every other PDP:
  ```js
  await _cart.add({ items: [{ id, quantity: 1,
    properties: { 'Ships': <pre_order_shipping_date> },   // preorder only
    selling_plan: <id of plan named "Pre-order item"> }] });// preorder only, from variant.selling_plan_allocations
  _stores.modal.setId('modal--cart-drawer');
  ```
  Look up the selling plan in Liquid: loop `product.selected_or_first_available_variant.selling_plan_allocations`, match `alloc.selling_plan.name == 'Pre-order item'`. Keep the plain form as no-JS fallback (`HTMLFormElement.prototype.submit.call(form)` in the catch).

### 6. Mobile is where the work is
Desktop is a 2-col grid (`grid-template-columns:minmax(0,540px) 1fr`). The `@media (max-width:1000px)` block collapses the hero to a flex column and **reorders** everything with `order:`. Proven mobile rules (all learned from real QA on this page):
- **Cap the gallery** — `.mn-gallery{max-width:330px;margin:0 auto;width:100%}`. Without this the square (`aspect-ratio:1/1`) hero image goes full-viewport-width and dominates the screen. This is the #1 mobile bug.
- **Reorder via `order:`** on the flex children (`.mn-left`/`.mn-info` are `display:contents` so their children participate directly). Typical order: gallery → eyebrow → title → sub → flavor → price → CTA → what's-in-box → accordions → benefits.
- **What's-in-Box → horizontal scroller** (`display:flex;overflow-x:auto`), items `flex:0 0 ~88px`.
- **Accordions full width** (`width:100%`).
- Tight wrap padding (`.mn-wrap{padding:0 15px}`), small emblem padding.
- The script auto-collapses the open Description accordion on mobile to cut scroll height.

### 7. Assign the template
In Shopify admin: Online Store → the product → Theme template → select `<new-slug>`. (Or set it in the product's template field.) Preview without assigning via `?view=<new-slug>`.

## Deploy (READ — production live theme)

GitHub `main` ⇄ the live theme are **bidirectionally synced**, so pushing to `main` deploys. This causes two recurring issues:

1. **The sync auto-commits back**, so your push often rejects with "fetch first." Always:
   ```bash
   git add "sections/<file>.liquid"   # never git add -A / .
   git commit -m "…"
   git pull --rebase origin main
   git push origin main
   ```
   After rebasing, `grep` your markers back into the files to confirm the sync didn't clobber your edits.
2. **Edit in ONE place (prefer git).** Editing the same template in the Shopify theme-editor can revert your git changes — a tug-of-war. Don't hand-edit in admin and git simultaneously.

Explicit deploy (if the sync lags): `shopify theme push --allow-live --only sections/<file>.liquid`.

**Schema gotchas (silent section rejection — Shopify serves the OLD version):**
- text/textarea settings **cannot have a blank `default`** (omit the key entirely instead).
- `header` settings: **content max 50 characters.** Longer → "Invalid schema: setting with type=\"header\" content is too long" and the upload is dropped. Put long guidance in a `paragraph` setting instead.
- **Never trust "Theme upload complete."** The CLI prints it even when a file was rejected — the error panel is separate output that's easy to swallow when grepping. After every push, PULL the file back and grep for your marker:
  ```bash
  shopify theme pull --theme <id> --path /tmp/verify --only sections/<file>.liquid
  grep -c '<your-new-css-class>' /tmp/verify/sections/<file>.liquid   # 0 = rejected
  ```
Validate the `{% schema %}` JSON before every push:
```bash
python3 -c "import re,json,sys; s=open('sections/<file>.liquid').read(); json.loads(re.search(r'{% schema %}(.*?){% endschema %}',s,re.S).group(1)); print('schema OK')"
```

## QA the live page (don't trust the browser)

Shopify serves a CDN full-page cache + browser cache, so a normal reload lies. **Verify against what the server actually returns** by curling with a cache-buster and grepping for your exact CSS markers:
```bash
curl -s -A "Mozilla/5.0" "https://gfuel.com/products/<handle>?cb=$(date +%s)" -o /tmp/live.html
grep -c 'max-width:330px' /tmp/live.html   # etc. — grep each change you made
```
If markers are present in the curl output, it IS live — the user is seeing cache. **A `?cb=<n>` link is NOT a reliable fix**: the page cache is also cookie-keyed, and a browser carrying gfuel.com cookies can keep getting the old template for `?view=` URLs no matter the cache-buster while cookieless curl gets the new one (diagnose with `window.template` in the console; incognito shows the truth; the stale bucket expires on its own). If markers are absent after a minute, the sync lagged — run the explicit `shopify theme push`.

Two cache-proof checks that need no CLI auth:
- **Section Rendering API:** `curl -s "https://gfuel.com/products/<any-live-handle>?section_id=<section-name>" | grep <marker>` — renders the section fresh if it's on the live theme.
- **In-browser visual QA past the stale cache:** from the page console, `fetch(url,{credentials:'omit'}).then(r=>r.text())` then `document.open();document.write(html);document.close()` — renders the fresh HTML with fonts and CSS intact.

## Fonts & assets reference
- Example uses **Cinzel** (display) + **EB Garamond** (body) via Google Fonts, loaded with a `<link>` at the top of the section. Pick fonts that fit the IP.
- Decorative PNGs must have real alpha (no checkerboard).

## Common mistakes
- Building from scratch instead of copying `example-section.liquid`.
- Forgetting to cap the mobile gallery width → giant image (the exact bug that kicked off this pattern).
- Blank `default:` in a schema text/textarea setting → silent section rejection.
- `git push` without `git pull --rebase` first → rejected by the sync.
- Trusting a browser refresh instead of curl-grepping the live HTML.
- Pushing from the wrong gh account (must be `lhuynhgfuel`).
- Putting `wla_button` on a native ATC/preorder button → wait.li JS hijacks the click (see 5b).
- Raw product-form POST instead of `_cart.add` → homepage redirect + missing "Pre-order item" selling plan/Ships property (see 5b).
- Piping `custom.pre_order_shipping_date` through `| date:` → "August 2026" becomes "August 1, 2026". Print verbatim.
- Forgetting the CTA priority: an ACTIVE wait.li campaign beats everything — if the page "won't leave the waitlist," end the campaign in the app; if a card still sells a waitlist product, add the `waitlist` tag.
