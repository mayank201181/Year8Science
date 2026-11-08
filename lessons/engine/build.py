#!/usr/bin/env python3
"""Build an animated lesson page.

usage:
  python3 lessons/engine/build.py --topic respiration --variant app [--mp3 PATH]
      -> public/lessons/respiration.html (+ respiration-narration.mp3)
  python3 lessons/engine/build.py --topic respiration --variant artifact --out DIR --mp3 PATH
      -> DIR/index.html + DIR/narration.mp3 (a claude.ai artifact: no document skeleton)
  python3 lessons/engine/build.py --topic respiration --variant local --out DIR --fonts FONTS_DIR --audio PATH
      -> DIR/index.html for local checks with shot.js (fonts from @fontsource on disk)

A topic folder holds script.py (META + CHAPTERS), timeline.json (from
make_audio.py), scenes/NN_<chapter id>.js and optionally lib.js (art shared by
that topic's scenes). The bundle is: engine/lib.js, engine/kit.js, <topic>/lib.js, each scene
in its own function scope, then engine/engine.js. --only id1,id2 bundles just
those scenes; the rest render as placeholders.
"""
import argparse
import glob
import html
import importlib.util
import json
import os
import re
import shutil

ENGINE = os.path.dirname(os.path.abspath(__file__))
LESSONS = os.path.dirname(ENGINE)
REPO = os.path.dirname(LESSONS)
SITE = "https://year8science.vercel.app"


def load_script(topic):
    path = os.path.join(LESSONS, topic, "script.py")
    spec = importlib.util.spec_from_file_location(f"script_{topic.replace('-', '_')}", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def bundle_js(topic, only=None):
    globals_src = [("engine/lib.js", open(os.path.join(ENGINE, "lib.js")).read()),
                   ("engine/kit.js", open(os.path.join(ENGINE, "kit.js")).read())]
    topic_lib = os.path.join(LESSONS, topic, "lib.js")
    if os.path.exists(topic_lib):
        globals_src.append((f"{topic}/lib.js", open(topic_lib).read()))
    parts = [src if label.startswith("engine/") else f"/* ---- {label} ---- */\n" + src for label, src in globals_src]
    for f in sorted(glob.glob(os.path.join(LESSONS, topic, "scenes", "*.js"))):
        sid = os.path.basename(f)[:-3].split("_", 1)[-1]
        if only and sid not in only:
            continue
        parts.append(f"/* ---- {topic}/scenes/{os.path.basename(f)} ---- */\n(function () {{\n{open(f).read()}\n}})();")
    parts.append(open(os.path.join(ENGINE, "engine.js")).read())
    # lib.js, kit.js and a topic lib.js share one global scope: a repeated top-level name would silently
    # replace an earlier helper (kit's first sine-wave art was called `wave` and broke lib's wave(t, ...)).
    seen = {}
    for label, src in globals_src:
        for name in re.findall(r"^(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=)", src, re.M):
            name = name[0] or name[1]
            assert name not in seen, f"global '{name}' is defined in both {seen[name]} and {label}"
            seen[name] = label
    js = "\n".join(parts)
    assert "</script" not in js.lower(), "a script contains </script"
    return js


def local_fonts(fdir):
    faces = []
    fr = os.path.join(fdir, "node_modules/@fontsource/fredoka/files")
    at = os.path.join(fdir, "node_modules/@fontsource/atkinson-hyperlegible-next/files")
    for w in (500, 600, 700):
        faces.append(f'@font-face{{font-family:"Fredoka";font-weight:{w};src:url("file://{fr}/fredoka-latin-{w}-normal.woff2") format("woff2")}}')
    for w in (400, 600, 700, 800):
        faces.append(f'@font-face{{font-family:"Atkinson Hyperlegible Next";font-weight:{w};src:url("file://{at}/atkinson-hyperlegible-next-latin-{w}-normal.woff2") format("woff2")}}')
    return "<style>" + "\n".join(faces) + "</style>"


def build(topic, variant, out=None, timeline=None, fonts=None, audio=None, mp3=None, only=None):
    meta = load_script(topic).META
    tl = json.load(open(timeline or os.path.join(LESSONS, topic, "timeline.json")))
    name = meta["name"]
    n_ch = len(tl["chapters"])
    words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
             "thirteen", "fourteen", "fifteen", "sixteen"]
    lab_path = f"/topic/{topic}"
    if variant == "artifact":
        audio_src, lab, quiz, target, page = "narration.mp3", SITE + lab_path, SITE + lab_path + "?tab=quiz", 'target="_blank" rel="noopener"', "index.html"
    elif variant == "app":
        audio_src, lab, quiz, target, page = f"{topic}-narration.mp3", lab_path, lab_path + "?tab=quiz", 'target="_top"', f"{topic}.html"
    else:
        audio_src, lab, quiz, target, page = audio or "narration.mp3", SITE + lab_path, SITE + lab_path + "?tab=quiz", 'target="_blank" rel="noopener"', "index.html"
    esc = lambda s: html.escape(s, quote=True)
    rep = {
        "@@TIMELINE@@": json.dumps(tl, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/"),
        "@@AUDIO@@": audio_src, "@@LABURL@@": lab, "@@QUIZURL@@": quiz, "@@LABTARGET@@": target,
        "@@TOTALSEC@@": str(int(tl["total"])),
        "@@TOPIC@@": esc(topic), "@@NAME@@": esc(name), "@@KICKER@@": esc(meta["kicker"]),
        "@@TITLE@@": esc(meta.get("title", f"{name}, Animated")),
        "@@H1@@": esc(meta.get("h1", f"{name}, animated")),
        "@@DEK@@": esc(meta["dek"].replace("{chapters}", words[n_ch] if n_ch < len(words) else str(n_ch))),
        "@@QUIZNAME@@": esc(meta.get("quiz_name", name)),
        "<!--@@LOCALFONTS@@-->": local_fonts(fonts) if variant == "local" and fonts else "",
        "<!--@@BACK@@-->": f'<a class="back" href="{lab_path}" target="_top">← Back to {esc(name)}</a>' if variant == "app" else "",
    }
    doc = open(os.path.join(ENGINE, "template.html")).read()
    for k, v in rep.items():
        doc = doc.replace(k, v)
    doc = doc.replace("@@JS@@", bundle_js(topic, only))
    head, body = doc.split("<!--@@BODY@@-->")
    if variant == "artifact":
        doc = head + body
    else:
        doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
               + head + "\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")
    out = out or (os.path.join(REPO, "public", "lessons") if variant == "app" else None)
    assert out, "--out is required for this variant"
    os.makedirs(out, exist_ok=True)
    path = os.path.join(out, page)
    with open(path, "w") as f:
        f.write(doc)
    if mp3:
        shutil.copyfile(mp3, os.path.join(out, audio_src if variant != "local" else "narration.mp3"))
    print(f"built {topic} ({variant}): {path} ({len(doc)/1024:.0f} KB, {n_ch} chapters, {tl['total']/60:.1f} min)")
    return path


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--topic", required=True)
    ap.add_argument("--variant", default="local", choices=["artifact", "app", "local"])
    ap.add_argument("--out")
    ap.add_argument("--timeline", help="defaults to lessons/<topic>/timeline.json")
    ap.add_argument("--fonts")
    ap.add_argument("--audio")
    ap.add_argument("--mp3")
    ap.add_argument("--only", help="comma list of scene ids to include (others render as placeholders)")
    a = ap.parse_args()
    build(a.topic, a.variant, a.out, a.timeline, a.fonts, a.audio, a.mp3, set(a.only.split(",")) if a.only else None)
