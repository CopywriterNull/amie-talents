---
name: creating-gfuel-tub-pdp
description: Use when building a G FUEL single-tub flavour PDP hero in the gfuel-theme Shopify repo — a new flavour or creator collab that ships as just a tub (no collector box). Triggers on "build a hero for <flavour>", "another one for <creator>", or handing over tub art plus a mockup. Covers the four-card layout, the illustrated icon set, asset extraction from supplied art, the CTA ladder, and the hidden-template deploy + QA loop.
---

# Building a G FUEL tub PDP hero

For a **single tub** — one flavour, one product, no collector box. If the product ships a box with
extras, use `creating-gfuel-collab-pdp` instead: it has the "What's in the Box" grid this pattern
deliberately drops.

**Do not build from scratch.** `example-section.liquid` in this folder is the live Butters hero.
Copy it and reskin. It already carries every fix listed under "Hard-won rules" below.

**Pick the tier first.** This scaffold is the *standard* tier: theme fonts, four-card layout,
education strips. For a major licensed IP the user will often want the *design-system* tier —
"make it cooler, like Black Clover" — a fully bespoke IP-native page (custom Google fonts, themed
panel chrome, SVG-mask doodles, countdown lock). That tier lives in `creating-gfuel-collab-pdp`
under "The design-system tier" and applies to tubs too (Pragmata Pure Lunum is a tub built that
way, from the Black Clover scaffold, with no What's-in-the-Box). A standard-tier page for a
premium IP tends to get sent back for the upgrade — ask, or default to the design-system tier
when the IP is a licensed game/anime with its own strong visual world.

## Where things live

- **Repo:** `lhuynhgfuel/gfuel-theme`, branch `main`, which is **bidirectionally synced to the live
  theme** `gfuel-theme/main` (`#140531531851`). Pushing to main deploys.
- **Sections:** `sections/pdp-<slug>-hero.liquid`
- **Templates:** `templates/product.pdp-<slug>.json`
- **Assets:** `assets/<slug>-*.png|jpg`

## 1. Gather inputs

- Product handle or admin ID. New flavours are usually **draft**, so they 404 publicly — you'll
  need a `shopifypreview.com` link with a `preview_key` to see the real product.
- The mockup, the tub photography, the illustrated icon set, the page background.
- **Waitlist or not?** Coming-soon flavours run a wait.li campaign; a normal launch doesn't.
  This decides the `show_waitlist` default.

## 2. Scaffold

```bash
cp example-section.liquid sections/pdp-<slug>-hero.liquid
# swap the class prefix (bt- -> your two letters) and the liquid var prefix (bt_ -> xx_)
```

```json
{ "sections": { "main": { "type": "pdp-<slug>-hero", "settings": {} } }, "order": ["main"] }
```

Generating a new page from an existing one **by script** beats hand-copying — it guarantees the
new page inherits the fixes. When you do, watch for colours that are *literal hex inside a rule*
rather than palette variables: the gallery sunburst shipped Push Pop red onto two other pages
because of exactly that.

## 3. Layout

Four cards on a two-column grid, then full-width education strips:

```
[ gallery card ] [ info card: title / pills / price / CTA / chips / blurb / trust ]
[ benefits — spans BOTH columns (grid-column:1/-1) ]
[ New to G FUEL? ] [ Flavor Profile ] [ Why G FUEL ] [ Shop With Confidence ] [ FAQ ] [ Details ]
```

- The info card is **left-aligned**, not centred.
- IP is a **filled** pill, flavour is an **outlined** pill, side by side.
- No "New & Officially Licensed" badge — it was removed from the pattern.
- Benefits are **icon-left / text-right**, four across, spanning the full row. Without the
  box card, a half-width benefits card leaves dead space.
- Education strips exist because collab pages pull in people who know the creator but have never
  bought G FUEL. The FAQ opens with "What is G FUEL?" on purpose.

## 4. Type — the rule that matters most

**Blunt is a display face. Use `--disp` at 18px and up only** — title, price, section headings,
CTA buttons. Everything smaller and functional uses `--body` (Acumin) with **weight** carrying the
hierarchy. Blunt at 10–13px is what makes a page read "blocky and illegible"; ALL-CAPS Blunt on FAQ
questions is the worst offender.

Both faces are `@font-face`'d globally by the layout — `Blunt Regular`, `Blunt Semicondensed`,
`Blunt Wide`, `Acumin VF`. **No Google Fonts link needed.**

Audit before shipping:

```bash
python3 - <<'EOF'
import re
s=open('sections/pdp-<slug>-hero.liquid').read(); css=s[s.find('<style>'):s.find('</style>')]
bad=[m.group(1) for m in re.finditer(r'\{[^}]*var\(--disp\)[^}]*font-size:\s*([\d.]+)px', css) if float(m.group(1))<18]
print("sub-18px Blunt:", bad or "none")
EOF
```

## 5. Extracting the illustrated assets

Supplied icon art arrives on a flat grey studio background. Flood-fill from the border, feather the
alpha so the cut edge isn't stamped, crop to bbox:

```python
from PIL import Image, ImageFilter
from collections import deque
def knockout(im, tol=52, feather=1.2):
    im=im.convert('RGBA'); w,h=im.size; px=im.load()
    border=[(x,0) for x in range(w)]+[(x,h-1) for x in range(w)]+[(0,y) for y in range(h)]+[(w-1,y) for y in range(h)]
    ref=[px[s][:3] for s in border]
    R,G,B=[sum(c[i] for c in ref)//len(ref) for i in range(3)]
    seen=bytearray(w*h); q=deque(border)
    while q:
        x,y=q.popleft()
        if x<0 or y<0 or x>=w or y>=h or seen[y*w+x]: continue
        seen[y*w+x]=1; r,g,b,a=px[x,y]
        if abs(r-R)+abs(g-G)+abs(b-B) > tol*3: continue
        px[x,y]=(r,g,b,0); q.extend(((x+1,y),(x-1,y),(x,y+1),(x,y-1)))
    im.putalpha(im.getchannel('A').filter(ImageFilter.GaussianBlur(feather)))
    return im.crop(im.getbbox())
```

Sparkles and glow survive this. Then **resize to ~2.5× display size before committing** — source art
is often 1536px for an 84px icon, which is 200KB+ each for nothing. Butters' full set is ~420KB.

**Never ship AI-rendered product tubs.** The label text comes out garbled ("NOW & IHRROVED ENERGY
FORMULA"). Use real product photography for the tub; generated art is for decorative icons and
backgrounds only.

Backgrounds: convert to JPG at ~2400px wide, quality ~80 (≈130–350KB), reference via `asset_url`
as the fallback when no `bg_image` is set in the editor.

## 6. CTA ladder

In priority order — copy it exactly:

1. `show_waitlist` **and** wait.li campaign active → waitlist panel, regardless of stock
2. `show_waitlist` **and** unavailable → waitlist panel
3. available + tagged `pre-order` → preorder button + ship date **printed verbatim** (never through
   `| date:`, which turns "August 2026" into "August 1, 2026")
4. available → add to cart
5. otherwise → plain sold-out panel with **no** signup form

An active campaign is a *coming soon*, not a *sold out* — use separate headings for the two states.
Never print "Sold Out" while a campaign is running.

**wait.li has no email capture.** For guests it renders a link to Shopify customer login; for
customers, a plain join button. Mockups showing "Enter your email address" cannot be built on
wait.li alone — that needs Klaviyo. Never render a decorative email field that collects nothing.

## 7. Add-to-cart — two hard-won bugs

- **Never put `wla_button` on a native submit button.** wait.li's site-wide script binds clicks on
  that class even when no campaign is running, kills the submit, and strands the user on /cart with
  an empty basket. Use a section-scoped class (`.xx-atc-btn`) and duplicate the styling.
- **Never rely on a raw `{% form 'product' %}` POST** — the SPA router mangles the redirect. Intercept
  submit and call the theme API, keeping the native post as the no-JS fallback:

```js
await _cart.add({ items:[{ id, quantity:1,
  properties:{ 'Ships': <pre_order_shipping_date> },      // preorder only
  selling_plan: <id of the plan named "Pre-order item"> }]}); // preorder only
_stores.modal.setId('modal--cart-drawer');
```

The button is styled glossy candy in CSS — gradient fill, white ring, outer glow, inset highlight,
heart + sparkle. **Keep it real text, never an image**, so the label stays selectable, translatable,
readable to screen readers, and can interpolate the price.

## 8. Mobile

- **Cap the stage: `.xx-stage{max-width:330px;margin:0 auto}`.** Without it the `aspect-ratio:1/1`
  image eats the entire viewport. This is the #1 mobile bug on these pages.
- One column at 1100px; benefits and box grids to two columns at 760px.
- Nothing below ~12px. Bump the 10–11px desktop labels up.
- Verify: stage width **exactly 330**, `document.documentElement.scrollWidth === innerWidth`.

## 9. Watch for these after ANY type or spacing change

Two things break repeatedly and neither is obvious in a screenshot:

- **The five attribute chips overflow and wrap.** The measurement is the authority, not any
  metric set: `new Set(chips.map(c => c.getBoundingClientRect().top)).size === 1`. Butters fits
  at 12.5px labels / 7px gap / 26px icons, but the same spec wrapped on Pragmata's ~590px info
  column — total chip width was ~641px. When they wrap, tighten to 12px labels, 6px gap, 24px
  icons, `padding:7px 11px 7px 6px`, `letter-spacing:.02em` (fits ~580px). Never below 12px.
- **Benefit headings that wrap to two lines push their icons out of alignment.** `.xx-benefit .bh`
  carries a `min-height` to reserve the block. Check the four icons share one `top`.

## 10. Deploy and QA

Push to `main`. The sync auto-commits back, so always:

```bash
git add "sections/<file>.liquid"     # never git add -A
git commit -m "…"
git pull --rebase origin main
git push origin main
```

**Verification, in order of trustworthiness:**

1. `shopify theme pull --store gfuel.myshopify.com --theme 140531531851 --only <file> --path /tmp/v`
   then grep your marker. **This is the authority** — but CLI auth expires: when it does, the pull
   swallows its device-code login prompt inside a pipe, sits for minutes, then dies with
   "Unknown error". If a pull hangs, run it in the foreground and look for the login URL, or fall
   back to #2.
2. **The Section Rendering API** — cache-proof and needs no auth:
   `curl -s "https://gfuel.com/products/<any-live-handle>?section_id=pdp-<slug>-hero" | grep <marker>`.
   If the section renders, the sync landed (templates ship in the same commit).
3. A real browser load — but know the **cookie-keyed stale cache**: a browser carrying gfuel.com
   cookies can keep getting the OLD template for `?view=` URLs (any cache-buster, any product)
   while cookieless requests get the new one. Diagnose with `window.template` in the console; the
   stale bucket expires on its own. For an immediate visual QA, render the fresh HTML in the tab:
   `fetch(url,{credentials:'omit'}).then(r=>r.text())` then `document.open();document.write(html);
   document.close()` — fonts and section CSS come along, so layout checks are valid.
4. `curl` — **do not trust it alone.** Shopify's page cache serves stale HTML for `?view=` URLs
   *even with a unique cache-buster*; it returned a build two revisions old for ten minutes
   straight. (And per #3, curl agreeing with you doesn't mean the user's browser does.)

Validate the schema before every push — a bad one is silently rejected and Shopify keeps serving
the old file:

```bash
python3 -c "import re,json;s=open('sections/<file>.liquid').read();json.loads(re.search(r'{% schema %}(.*?){% endschema %}',s,re.S).group(1));print('schema OK')"
```

Schema gotchas: text/textarea settings **cannot have a blank `default`** (omit the key); `header`
content is capped at **50 characters**.

Also worth knowing: the Chrome extension's JS reports `img.complete === false` and `naturalWidth 0`
for images that are visibly on screen. Don't diagnose broken images from that — take a screenshot.

The reverse trap: **sections with scroll-reveal (`.c2-rv`) screenshot completely blank**, with
`getComputedStyle(el).opacity === "0"` even though `.in` is applied and `.c2-rv.in{opacity:1}`
matches. The automated tab is backgrounded, so `document.hidden` is true and the animation timeline
is frozen — transitions sit at `currentTime: 0` forever. Check `document.timeline.currentTime`
twice before investigating anything; if it doesn't advance, the page is fine. To see the layout,
inject `.c2-rv{opacity:1!important;transform:none!important}` and re-screenshot. `resize_window`
also reports success without changing `window.innerWidth`, so simulate phone widths by injecting
the media-query rules as `!important` plus a narrow container max-width.

## 11. Staying hidden

Leave the template assigned to **no product**. It's then unreachable publicly while previewable at
`?view=pdp-<slug>`. Assign it in Shopify admin (Online Store → product → Theme template) only at
launch. Confirm the product's live template is unchanged:

```bash
curl -s "https://gfuel.com/products/<handle>" | grep -o 'window.template = "[^"]*"'
```

## Common mistakes

- Building from scratch instead of copying `example-section.liquid`.
- Blunt under 18px — the single biggest cause of "it looks blocky".
- Forgetting the 330px mobile stage cap.
- Literal hex inside a rule instead of a palette variable, so a reskin keeps the old page's colour.
- Centring the info card — the pattern is left-aligned.
- Half-width benefits card on a tub page; it must span both columns.
- Shipping source-resolution art (200KB+ per icon).
- Printing "Sold Out" while a wait.li campaign is active.
- `wla_button` on a native button, or a raw product-form POST.
- Trusting `curl` or a browser refresh instead of `shopify theme pull`.
- Claiming a guarantee or return policy the store doesn't offer — check `/policies/refund-policy`
  before putting a trust badge on the page.
