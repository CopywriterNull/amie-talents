"""Cut a raw recording into finished 9:16 reels with word-by-word captions.

    .venv/bin/python scripts/render.py <workdir>/edl.json

edl.json:
    {"source": "/path/raw.mov", "style": "bold", "out": "~/Desktop/reels/<slug>",
     "reels": [{"name": "hook-a", "from": 0, "to": 88, "drop": [[12, 19]]}]}
"from"/"to"/"drop" are inclusive word indexes from words.json (next to edl.json).
Per reel it writes <out>/<name>.mp4 and <name>-check.jpg (a contact sheet to look at).
"""
import json, os, subprocess, sys, tempfile

from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
PAD_IN, PAD_OUT = 0.08, 0.15   # whisper word edges are loose; never clip a word's onset/tail
MAX_GAP = 0.35                 # a pause longer than this between kept words gets cut down
FONTS = os.path.expanduser("~/Library/Fonts")
SYS = "/System/Library/Fonts/Supplemental"

STYLES = {
    # dark footage / default: white caps, heavy outline, one yellow active word
    "bold": dict(font=f"{SYS}/Arial Black.ttf", size=86, upper=True, fill="#FFFFFF",
                 active="#FFD400", stroke=10, stroke_fill="#000000", box=None, per=3),
    # calmer talking head: sentence case, soft shadow, active word in a cyan accent
    "clean": dict(font=f"{FONTS}/NeueMontreal-Bold.otf", size=78, upper=False, fill="#FFFFFF",
                  active="#3BBFEF", stroke=3, stroke_fill="#000000", box=None, per=4),
    # light-mode A/B variant: black words on a white card, active word highlighted
    "light": dict(font=f"{SYS}/Arial Black.ttf", size=72, upper=True, fill="#111111",
                  active="#FF3B30", stroke=0, stroke_fill="#000000", box="#FFFFFF", per=3),
}
CAPTION_Y = 0.62   # centre of the caption line; IG covers the bottom ~20% and the right rail


def segments(words, keep, max_gap=MAX_GAP):
    """Source-time (start, end) ranges covering the kept words, with long pauses removed."""
    out = []
    for i in keep:
        w = words[i]
        s, e = w["s"] - PAD_IN, w["e"] + PAD_OUT
        if out and i - 1 in keep and w["s"] - words[i - 1]["e"] <= max_gap:
            out[-1][1] = e
        else:
            if out and s < out[-1][1]:   # padding overlap between two kept runs
                s = out[-1][1]
            out.append([max(0.0, s), e])
    return out


def remap(words, keep, segs):
    """Kept words with times moved onto the cut timeline."""
    res, offset, k = [], 0.0, 0
    for s, e in segs:
        while k < len(keep) and words[keep[k]]["s"] < e:
            w = words[keep[k]]
            res.append({"w": w["w"], "s": max(0.0, w["s"] - s) + offset, "e": min(w["e"], e) - s + offset})
            k += 1
        offset += e - s
    return res, offset


def caption_frames(cwords, total, st, tmp):
    """Transparent full-frame PNG per caption state + an ffmpeg concat list timing them."""
    font = ImageFont.truetype(st["font"], st["size"])
    blank = os.path.join(tmp, "blank.png")
    Image.new("RGBA", (W, H)).save(blank)
    items, t, starts = [], 0.0, [0]
    # a caption chunk never runs across a sentence/comma break: "WRONG WAY HERE" reads as nonsense
    for k in range(1, len(cwords)):
        if k - starts[-1] >= st["per"] or cwords[k - 1]["w"][-1:] in ",.?!;:":
            starts.append(k)
    for c, c_end in zip(starts, starts[1:] + [len(cwords)]):
        chunk = cwords[c:c_end]
        for j, w in enumerate(chunk):
            nxt = cwords[c + j + 1]["s"] if c + j + 1 < len(cwords) else total
            if w["s"] > t:
                items.append((blank, w["s"] - t))
            path = os.path.join(tmp, f"c{c + j:04d}.png")
            draw_chunk([x["w"] for x in chunk], j, font, st, path)
            # hold the caption through short gaps, drop it during real pauses
            end = min(nxt, w["e"] + 0.6) if j == len(chunk) - 1 else nxt
            items.append((path, max(1 / FPS, end - w["s"])))
            t = w["s"] + items[-1][1]
    if total > t:
        items.append((blank, total - t))
    lst = os.path.join(tmp, "captions.txt")
    with open(lst, "w") as f:
        for p, d in items:
            f.write(f"file '{p}'\nduration {d:.3f}\n")
        f.write(f"file '{items[-1][0]}'\n")   # concat demuxer ignores the last duration otherwise
    return lst


def draw_chunk(texts, active, font, st, path):
    texts = [t.rstrip(",.;:") for t in texts]   # reel captions drop trailing commas/full stops, keep ?!
    texts = [t.upper() if st["upper"] else t for t in texts]
    img = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(img)
    space = d.textlength(" ", font=font)
    widths = [d.textlength(t, font=font) for t in texts]
    # wrap onto a second line if the chunk is wider than the safe width
    lines, cur, cw, maxw = [], [], 0, W * 0.84
    for t, wd in zip(range(len(texts)), widths):
        if cur and cw + space + wd > maxw:
            lines.append(cur); cur, cw = [], 0
        cw += (space if cur else 0) + wd
        cur.append(t)
    lines.append(cur)
    asc, desc = font.getmetrics()
    lh = int((asc + desc) * 1.05)
    y = int(H * CAPTION_Y - lh * len(lines) / 2)
    if st["box"]:
        bw = max(sum(widths[i] for i in ln) + space * (len(ln) - 1) for ln in lines)
        d.rounded_rectangle([(W - bw) / 2 - 36, y - 22, (W + bw) / 2 + 36, y + lh * len(lines) + 14],
                            radius=28, fill=st["box"])
    for ln in lines:
        x = (W - (sum(widths[i] for i in ln) + space * (len(ln) - 1))) / 2
        for i in ln:
            d.text((x, y), texts[i], font=font, fill=st["active"] if i == active else st["fill"],
                   stroke_width=st["stroke"], stroke_fill=st["stroke_fill"])
            x += widths[i] + space
        y += lh
    img.save(path)


def render(src, words, reel, st, out_dir, grade=True):
    drop = {i for a, b in reel.get("drop", []) for i in range(a, b + 1)}
    keep = [i for i in range(reel["from"], reel["to"] + 1) if i not in drop]
    segs = segments(words, keep)
    cwords, total = remap(words, keep, segs)
    with tempfile.TemporaryDirectory() as tmp:
        lst = caption_frames(cwords, total, st, tmp)
        parts = "".join(f"[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{n}];"
                        f"[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS,"
                        f"afade=t=in:d=0.02,afade=t=out:st={e - s - 0.02:.3f}:d=0.02[a{n}];"
                        for n, (s, e) in enumerate(segs))
        joins = "".join(f"[v{n}][a{n}]" for n in range(len(segs)))
        look = ",eq=contrast=1.06:saturation=1.12:gamma=0.98" if grade else ""
        fc = (parts + f"{joins}concat=n={len(segs)}:v=1:a=1[vc][ac];"
              f"[vc]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}{look}[vb];"
              f"[1:v]fps={FPS},format=rgba[cap];[vb][cap]overlay=0:0:eof_action=pass,format=yuv420p[v];"
              f"[ac]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
        out = os.path.join(out_dir, f"{reel['name']}.mp4")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-f", "concat", "-safe", "0", "-i", lst,
                        "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18",
                        "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out],
                       check=True)
    sheet = os.path.join(out_dir, f"{reel['name']}-check.jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out, "-vf",
                    f"fps={8 / total:.4f},scale=270:-1,tile=4x2", "-frames:v", "1", sheet], check=True)
    cut = sum(e - s for s, e in segs)
    print(f"{out}  {total:.1f}s  ({len(segs)} segments, {len(keep)} words, "
          f"{words[reel['to']]['e'] - words[reel['from']]['s'] - cut:.1f}s removed)\n{sheet}")


def selftest():
    w = [{"w": t, "s": a, "e": b} for t, a, b in
         [("a", 0.0, 0.4), ("b", 0.5, 0.9), ("c", 3.0, 3.4), ("d", 3.5, 3.9)]]
    segs = segments(w, [0, 1, 2, 3])
    assert len(segs) == 2 and abs(segs[0][1] - 1.05) < 1e-9, segs        # 2.1s pause cut out
    segs = segments(w, [0, 3])                                            # dropped middle words
    assert len(segs) == 2 and segs[1][0] == 3.5 - PAD_IN, segs
    cw, total = remap(w, [0, 1, 2, 3], segments(w, [0, 1, 2, 3]))
    assert abs(total - (1.05 + 1.13)) < 1e-9 and abs(cw[2]["s"] - (1.05 + PAD_IN)) < 1e-9, (cw, total)
    print("selftest ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--selftest"]:
        selftest(); sys.exit()
    edl_path = sys.argv[1]
    edl = json.load(open(edl_path))
    words = json.load(open(os.path.join(os.path.dirname(edl_path), "words.json")))
    out_dir = os.path.expanduser(edl["out"])
    os.makedirs(out_dir, exist_ok=True)
    for reel in edl["reels"]:
        st = STYLES[reel.get("style", edl.get("style", "bold"))]
        render(edl["source"], words, reel, st, out_dir, grade=edl.get("grade", True))
