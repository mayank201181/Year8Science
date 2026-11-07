#!/usr/bin/env python3
"""Build the animated lesson page from src/.

usage:
  python3 build.py --timeline T.json --out DIR --variant artifact   # claude.ai artifact (no skeleton), audio narration.mp3
  python3 build.py --timeline T.json --out DIR --variant app        # Science Lab public/ page, audio respiration-narration.mp3
  python3 build.py --timeline T.json --out DIR --variant local --fonts FONTS_DIR --audio PATH   # local testing

Scenes are src/scenes/NN_<id>.js in filename order; each file is wrapped in its
own function scope. --only id1,id2 bundles just those scenes. --mp3 copies the
narration next to the page.
"""
import argparse
import glob
import json
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
LAB = "https://year8science.vercel.app/topic/respiration"


def bundle_js(only=None):
    parts = [open(os.path.join(SRC, "lib.js")).read()]
    for f in sorted(glob.glob(os.path.join(SRC, "scenes", "*.js"))):
        sid = os.path.basename(f)[:-3].split("_", 1)[-1]
        if only and sid not in only:
            continue
        parts.append(f"/* ---- scenes/{os.path.basename(f)} ---- */\n(function () {{\n{open(f).read()}\n}})();")
    parts.append(open(os.path.join(SRC, "engine.js")).read())
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


def build(timeline_path, out, variant, fonts=None, audio=None, mp3=None, only=None):
    tl = json.load(open(timeline_path))
    html = open(os.path.join(SRC, "template.html")).read()
    if variant == "artifact":
        audio_src, lab, target, name = "narration.mp3", LAB, 'target="_blank" rel="noopener"', "index.html"
    elif variant == "app":
        audio_src, lab, target, name = "respiration-narration.mp3", "/topic/respiration", "", "respiration.html"
    else:
        audio_src, lab, target, name = audio or "narration.mp3", LAB, 'target="_blank" rel="noopener"', "index.html"
    rep = {
        "@@TIMELINE@@": json.dumps(tl, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/"),
        "@@AUDIO@@": audio_src, "@@LABURL@@": lab, "@@LABTARGET@@": target,
        "@@TOTALSEC@@": str(int(tl["total"])),
        "<!--@@LOCALFONTS@@-->": local_fonts(fonts) if variant == "local" and fonts else "",
        "<!--@@BACK@@-->": '<a class="back" href="/topic/respiration">← Back to Respiration</a>' if variant == "app" else "",
    }
    for k, v in rep.items():
        html = html.replace(k, v)
    js = bundle_js(only)
    html = html.replace("@@JS@@", js)
    head, body = html.split("<!--@@BODY@@-->")
    if variant == "artifact":
        doc = head + body
    else:
        doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
               + head + "\n</head>\n<body>\n" + body + "\n</body>\n</html>\n")
    os.makedirs(out, exist_ok=True)
    path = os.path.join(out, name)
    with open(path, "w") as f:
        f.write(doc)
    if mp3:
        shutil.copyfile(mp3, os.path.join(out, audio_src if variant != "local" else "narration.mp3"))
    print(f"built {variant}: {path} ({len(doc)/1024:.0f} KB)")
    return path


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--timeline", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--variant", default="local", choices=["artifact", "app", "local"])
    ap.add_argument("--fonts")
    ap.add_argument("--audio")
    ap.add_argument("--mp3")
    ap.add_argument("--only", help="comma list of scene ids to include (others render as placeholders)")
    a = ap.parse_args()
    build(a.timeline, a.out, a.variant, a.fonts, a.audio, a.mp3, set(a.only.split(",")) if a.only else None)
