#!/usr/bin/env python3
"""Check a lesson's narration by transcribing every line and diffing it with the script.

usage: WHISPER_DIR=/path/to/sherpa-onnx-whisper-base.en \\
       python3 lessons/engine/check_audio.py --topic TOPIC AUDIO_DIR [--threshold 0.93] [--lines id1,id2]

AUDIO_DIR is the make_audio.py output folder (its cache/ holds one clip per
line). Needs sherpa-onnx (pip install sherpa-onnx) and the Whisper base.en
model from https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models.

Prints every line whose word accuracy is below the threshold, with the words
that differ. Most flags are spelling conventions ("lime water", "6's");
look for real mishearings, e.g. a sentence-initial "Anaerobic" heard as
"And aerobic", which a listener would mishear too.
"""
import argparse
import difflib
import hashlib
import os
import re
import sys

import soundfile as sf

ENGINE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ENGINE)
from make_audio import SPEED, VOICE, load_chapters, spoken  # noqa: E402

NUM = {"0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven",
       "8": "eight", "9": "nine", "10": "ten", "11": "eleven", "12": "twelve", "18": "eighteen", "20": "twenty",
       "100": "hundred", "1000": "thousand"}


def norm(s):
    s = s.lower().replace("%", " percent").replace("-", " ")
    s = re.sub(r"[^a-z0-9' ]", " ", s)
    return [NUM.get(w, w) for w in s.split()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("audio_dir")
    ap.add_argument("--threshold", type=float, default=0.93)
    ap.add_argument("--lines", help="comma list of chapter.line ids to check (default: all)")
    a = ap.parse_args()
    import sherpa_onnx
    m = os.environ["WHISPER_DIR"]
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{m}/base.en-encoder.onnx", decoder=f"{m}/base.en-decoder.onnx",
        tokens=f"{m}/base.en-tokens.txt", language="en", task="transcribe", num_threads=4)
    want = set(a.lines.split(",")) if a.lines else None
    flagged = total = errs = words = 0
    for ch in load_chapters(a.topic):
        for line in ch["lines"]:
            lid = f"{ch['id']}.{line['id']}"
            if want and lid not in want:
                continue
            text = spoken(line)
            key = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:16]
            clip, sr = sf.read(os.path.join(a.audio_dir, "cache", key + ".wav"), dtype="float32")
            st = rec.create_stream()
            st.accept_waveform(sr, clip)
            rec.decode_stream(st)
            hyp = st.result.text.strip()
            r, h = norm(text), norm(hyp)
            sm = difflib.SequenceMatcher(a=r, b=h)
            match = sum(b.size for b in sm.get_matching_blocks())
            err = len(r) - match + max(0, len(h) - match)
            total += 1; errs += err; words += len(r)
            acc = 1 - err / max(1, len(r))
            if acc < a.threshold:
                flagged += 1
                diffs = [f"{' '.join(r[i1:i2]) or '∅'} -> {' '.join(h[j1:j2]) or '∅'}"
                         for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag != "equal"]
                print(f"{lid:28s} acc={acc:.2f} | " + " ; ".join(diffs), flush=True)
    print(f"checked {total} lines; flagged {flagged}; word error rate {errs / max(1, words):.3f}")


if __name__ == "__main__":
    main()
