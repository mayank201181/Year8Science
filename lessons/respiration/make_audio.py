"""Synthesise the lesson narration and its timeline.

usage: KOKORO_DIR=/path/to/models python3 make_audio.py OUT_DIR

Needs kokoro-onnx (pip install kokoro-onnx soundfile), the Kokoro v1.0 model
files (kokoro-v1.0.onnx, voices-v1.0.bin) in KOKORO_DIR, and ffmpeg.
Writes OUT_DIR/narration.mp3 and OUT_DIR/timeline.json. Each line is
synthesised separately and cached by its text, so editing one line of the
script only re-renders that line.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from script import CHAPTERS  # noqa: E402

VOICE = "af_heart"   # same voice and pace as the earlier explainers
SPEED = 0.95
SR = 24000
LEAD = 0.6           # silence before the first line
GAP = 0.5            # silence between lines
CARD = 1.8           # silent title-card beat at the start of each chapter
TAIL = 0.9           # extra silence at the end of each chapter
END = 1.2            # silence after the last line


def spoken(line):
    if line.get("say"):
        return line["say"]
    s = line["cap"].replace("**", "")
    s = s.replace(" → ", " gives ").replace(" + ", " plus ")
    return s


def main(out_dir):
    model_dir = os.environ["KOKORO_DIR"]
    cache = os.path.join(out_dir, "cache")
    os.makedirs(cache, exist_ok=True)
    kok = None

    def synth(text):
        nonlocal kok
        key = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:16]
        path = os.path.join(cache, key + ".wav")
        if os.path.exists(path):
            a, _ = sf.read(path, dtype="float32")
            return a
        if kok is None:
            kok = Kokoro(os.path.join(model_dir, "kokoro-v1.0.onnx"),
                         os.path.join(model_dir, "voices-v1.0.bin"))
        a, sr = kok.create(text, voice=VOICE, speed=SPEED, lang="en-us")
        assert sr == SR
        sf.write(path, a, SR)
        print(f"  synth {len(a)/SR:5.2f}s  {text[:70]}", flush=True)
        return a

    pieces = []
    t = 0.0

    def silence(sec):
        nonlocal t
        n = int(round(sec * SR))
        pieces.append(np.zeros(n, dtype="float32"))
        t += n / SR

    def audio(a):
        nonlocal t
        pieces.append(a.astype("float32"))
        t += len(a) / SR

    timeline = {"voice": VOICE, "speed": SPEED, "chapters": []}
    for ci, ch in enumerate(CHAPTERS):
        ch_start = t
        if ci == 0:
            silence(LEAD)
        if ch.get("card", True):
            silence(CARD)
        lines = []
        for li, line in enumerate(ch["lines"]):
            a = synth(spoken(line))
            start = t
            audio(a)
            lines.append({"id": line["id"], "start": round(start, 3), "end": round(t, 3), "cap": line["cap"]})
            last = li == len(ch["lines"]) - 1
            silence(line.get("pause", 0.0) + (0 if last else GAP))
        silence(TAIL if ci < len(CHAPTERS) - 1 else END)
        timeline["chapters"].append({
            "id": ch["id"], "title": ch["title"], "short": ch["short"], "card": ch.get("card", True),
            "start": round(ch_start, 3), "end": round(t, 3), "lines": lines,
        })
    timeline["total"] = round(t, 3)

    buf = np.concatenate(pieces)
    peak = float(np.max(np.abs(buf))) or 1.0
    buf = buf * (0.92 / peak)
    wav = os.path.join(out_dir, "narration.wav")
    sf.write(wav, buf, SR, subtype="PCM_16")
    mp3 = os.path.join(out_dir, "narration.mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-ar", str(SR),
                    "-c:a", "libmp3lame", "-b:a", "40k", mp3], check=True)
    with open(os.path.join(out_dir, "timeline.json"), "w") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=1)
    words = sum(len(re.findall(r"\w+", spoken(l))) for c in CHAPTERS for l in c["lines"])
    print(f"total {t/60:.2f} min, {words} words, mp3 {os.path.getsize(mp3)/1e6:.2f} MB")
    for c in timeline["chapters"]:
        print(f"  {c['id']:12s} {c['start']:7.2f} -> {c['end']:7.2f}  ({c['end']-c['start']:5.1f}s)")


if __name__ == "__main__":
    main(sys.argv[1])
