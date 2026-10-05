#!/usr/bin/env python3
"""Render an NSC Official Rules .doc/.docx as a paste-ready, rules-only Shopify page body.

    python3 build-rules-page.py "<rules.docx>" <out.html>

Text is verbatim from the doc. Page-safe: no theme overrides, no HTML comments
(on /pages/ the body renders inside the content_banner section).
"""
import html, re, subprocess, sys
from pathlib import Path

src, dest = sys.argv[1], Path(sys.argv[2])
text = subprocess.run(["textutil", "-convert", "txt", "-stdout", src],
                      capture_output=True, text=True, check=True).stdout
# Word field codes leak through textutil: HYPERLINK "url" \t "_blank"url  ->  url
text = re.sub(r'HYPERLINK "[^"]*"(?: \\t "[^"]*")?', "", text)
paras = [p.strip() for p in text.split("\n") if p.strip()]
title = paras[0]
assert paras[1] == "Official Rules", paras[1]
paras = paras[2:]

URL = re.compile(r"(https://gfuel\.com/[\w/-]+)")


def inline(s):
    return URL.sub(r'<a href="\1">\1</a>', html.escape(s, quote=False))


out, bullets = [], []
for p in paras:
    if p.startswith("•"):
        bullets.append(f"<li>{inline(p.lstrip('•').strip())}</li>")
        continue
    if bullets:
        out.append("<ul>" + "".join(bullets) + "</ul>")
        bullets = []
    # Bold a short lead-in label ("SPONSOR:", "Initial Entry:") when no sentence precedes it.
    i = p.find(":")
    if 0 < i <= 60 and "." not in p[:i]:
        out.append(f"<p><b>{inline(p[:i + 1])}</b> {inline(p[i + 1:].strip())}</p>")
    else:
        out.append(f"<p>{inline(p)}</p>")
if bullets:
    out.append("<ul>" + "".join(bullets) + "</ul>")

css = (".gfr{max-width:760px;margin:0 auto;padding:8px 0 24px;font-size:14px;line-height:1.65;color:#1c1726;}"
       ".gfr h2{font-family:'Blunt Regular',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;font-size:34px;line-height:1;margin:0;text-align:center;}"
       ".gfr .gfr-sub{text-align:center;color:#6b6577;font-size:13px;letter-spacing:.14em;text-transform:uppercase;margin:8px 0 28px;}"
       ".gfr p{margin:0 0 14px;}.gfr b{color:#240164;}.gfr ul{margin:0 0 14px 22px;}.gfr li{margin:4px 0;}"
       ".gfr a{color:inherit;text-decoration:underline;word-break:break-word;}"
       "@media(max-width:768px){.gfr h2{font-size:28px;}}")
body = (f"<style>{css}</style>\n<div class=\"gfr\">\n<h2>{html.escape(title)}</h2>\n"
        f"<p class=\"gfr-sub\">Official Rules</p>\n" + "\n".join(out) + "\n</div>\n")
dest.write_text(body)
print(f"wrote {dest} ({len(paras)} paragraphs)")
