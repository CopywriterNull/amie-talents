"""Word-level transcript of a raw recording.

    .venv/bin/python scripts/transcribe.py <video> <workdir> [--model small.en]

Writes <workdir>/words.json ([{i, w, s, e}]) and prints the numbered transcript
with every pause >= 0.6s marked, which is what you read to write the EDL.
"""
import argparse, json, os, subprocess, sys

import numpy as np

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("workdir")
ap.add_argument("--model", default="small.en")
a = ap.parse_args()
os.makedirs(a.workdir, exist_ok=True)

model = WhisperModel(a.model, device="cpu", compute_type="int8")
# The prompt nudges Whisper to keep restarts and fillers instead of tidying them away,
# because those are exactly the words the edit needs to find and cut.
# Decode with system ffmpeg: faster-whisper's bundled PyAV decoder breaks on some installs.
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", a.video, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
segs, info = model.transcribe(
    np.frombuffer(pcm, np.float32), word_timestamps=True, vad_filter=False, condition_on_previous_text=False,
    initial_prompt="Umm, so, uh, I mean, like, wait, let me, let me start again.",
)
words = []
for seg in segs:
    for w in seg.words:
        words.append({"i": len(words), "w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)})
if not words:
    sys.exit("no speech found")

json.dump(words, open(os.path.join(a.workdir, "words.json"), "w"), indent=0)

line, prev_end = [], words[0]["s"]
for w in words:
    gap = w["s"] - prev_end
    if gap >= 0.6:
        print(" ".join(line))
        print(f"   ---- pause {gap:.1f}s ----")
        line = []
    line.append(f"[{w['i']}]{w['w']}")
    prev_end = w["e"]
print(" ".join(line))
print(f"\n{len(words)} words, {words[-1]['e']:.1f}s, lang={info.language}")
