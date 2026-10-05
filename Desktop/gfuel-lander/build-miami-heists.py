#!/usr/bin/env python3
"""Build the Miami Heists giveaway article body.

Injects the NSC Official Rules (verbatim, from the .docx) into
miami-heists-template.html and writes miami-heists-giveaway-article.html.
Re-run after any new rules draft:  python3 build-miami-heists.py "<rules.docx>"
"""
import html, re, subprocess, sys
from pathlib import Path

HERE = Path(__file__).parent
DOCX = sys.argv[1] if len(sys.argv) > 1 else str(
    Path.home() / "Downloads/GFUEL GTA6 Miami Heists Giveaway_Official Rules_Draft 3 clean.docx")

text = subprocess.run(["textutil", "-convert", "txt", "-stdout", DOCX],
                      capture_output=True, text=True, check=True).stdout
paras = [p.strip() for p in text.split("\n") if p.strip()]
# Drop the doc's own title lines; the article renders its own heading.
assert paras[0].startswith("G FUEL Miami Heists Giveaway") and paras[1] == "Official Rules"
paras = paras[2:]

# Lead-ins that render bold. Upper-case section labels plus the mixed-case sub-labels.
LEAD = re.compile(r"^((?:[A-Z][A-Z’'/ ]+|Free Alternate Method of Entry \(“AMOE”\) by Mail|"
                  r"Grand Prize|Runner Up Prizes|General Prize Terms):)\s*")
URL = re.compile(r"(https://gfuel\.com/[\w/-]+)")


def inline(s):
    s = html.escape(s, quote=False)
    return URL.sub(r'<a href="\1">\1</a>', s)


out, bullets = [], []
for p in paras:
    if p.startswith("•"):
        bullets.append(f"<li>{inline(p.lstrip('•').strip())}</li>")
        continue
    if bullets:
        out.append("<ul>" + "".join(bullets) + "</ul>")
        bullets = []
    m = LEAD.match(p)
    if m:
        out.append(f"<p><b>{inline(m.group(1))}</b> {inline(p[m.end():])}</p>")
    else:
        out.append(f"<p>{inline(p)}</p>")
if bullets:
    out.append("<ul>" + "".join(bullets) + "</ul>")

tpl = (HERE / "miami-heists-template.html").read_text()
(HERE / "miami-heists-giveaway-article.html").write_text(tpl.replace("{{RULES}}", "\n".join(out)))
print(f"wrote miami-heists-giveaway-article.html ({len(paras)} rule paragraphs)")
