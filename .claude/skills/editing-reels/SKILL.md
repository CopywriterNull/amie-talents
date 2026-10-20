---
name: editing-reels
description: Use when Lenny hands over a raw talking-head recording (phone video, .mov/.mp4) and wants it edited into an Instagram Reel / TikTok / Short, says "edit this reel", "cut my mistakes and pauses", "add word-by-word captions", "make hook variants for trial reels", "A/B two versions", or gives a note on a previous reel edit.
---

# Editing reels

## Overview
Raw recording in, finished 1080x1920 reels out: restarts, flubs, fillers and dead air cut, loudness normalised, light grade, word-by-word captions. Lenny records sloppy on purpose (he restarts the sentence and keeps going); finding and cutting those mistakes is the edit's job. One recording often holds several takes or hook versions. Each one becomes its own reel, so they can go out as Instagram trial reels and the best hook wins.

Run from `~/.claude/skills/editing-reels`. Python is always `.venv/bin/python`.

## Steps
1. **Read `rules.md`.** It holds every past note. Follow all of it.
2. **Transcribe:** `.venv/bin/python scripts/transcribe.py <raw> <work>`, where `<work>` = `~/Desktop/reels/<slug>/work`. This prints the numbered words with pauses marked. About 5s per minute of footage.
3. **Fix the transcript.** Correct misheard words and capitalisation in `<work>/words.json` (`w` field only, never `s`/`e`). Captions print these words verbatim, so "comment at it" has to become "comment edit". Check product names and the CTA keyword especially.
4. **Write `<work>/edl.json`.** You decide what stays; the script handles the timing.
   ```json
   {"source": "<raw>", "style": "bold", "out": "~/Desktop/reels/<slug>",
    "reels": [{"name": "hook-a", "from": 0, "to": 44, "drop": [[8, 17]]},
              {"name": "hook-b", "from": 8, "to": 44, "drop": [[8, 10]], "style": "light"}]}
   ```
   - `from`/`to`/`drop` are inclusive word indexes. Pauses over 0.35s between kept words are cut automatically, so only drop words.
   - Drop restarts, flubs and fillers per `rules.md`. A restart is two attempts at the same words close together: keep the last full attempt.
   - Takes and hook versions: when the same body is spoken more than once, or several openings lead into one body, make one reel per hook. A reel can share the body by dropping the other hooks.
5. **Render:** `.venv/bin/python scripts/render.py <work>/edl.json`. This writes `<name>.mp4` and `<name>-check.jpg` per reel.
6. **Verify each reel.** Look at the contact sheet: captions readable, nothing in the bottom 20%. Re-transcribe the output with `scripts/transcribe.py <reel.mp4> <work>/verify-<name>`. The words must read as one clean take: no doubled phrase, no clipped first word, the CTA intact. Fix the EDL and re-render until they do.
7. **Deliver.** List each reel's path, length, hook line and style, so Lenny knows which is which for the A/B.

## Styles
| style | look | use |
|---|---|---|
| `bold` (default) | white caps, heavy black outline, active word yellow | busy or dark footage |
| `clean` | sentence-case Neue Montreal, active word cyan | calm talking head |
| `light` | black caps on a white card, active word red | the second A/B variant |

A reel's `style` overrides the EDL's. Set `"grade": false` on the EDL for footage that's already graded. Chunks hold up to 3 words (4 for `clean`) and never cross a comma or full stop.

## Notes from Lenny
When Lenny dislikes something in an edit, fix it. Then add a one-line rule to `rules.md` in the same imperative style. If the note is mechanical (a font, a colour, caption size or position), change `STYLES` / `CAPTION_Y` in `scripts/render.py` instead, and still log the rule.

## Not built yet
These came from the source videos but aren't in this skill yet. Say so if asked; don't fake them:
- real screenshots of what's mentioned (a repo, a post) popping on screen
- background removal to put him over graphics
- sound effects
- Remotion motion graphics
- covers
- posting as trial reels
