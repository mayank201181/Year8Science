# Respiration, animated

A narrated, animated lesson (about 14 minutes, 12 chapters) built from the
Respiration topic. The built page lives at `public/lessons/respiration.html`
with its narration in `public/lessons/respiration-narration.mp3`, and the
Respiration guide links to it through `lesson` in `lib/extras/respiration.ts`.

## How it is made

| Step | File | What it does |
| --- | --- | --- |
| Script | `script.py` | Every narration line: an id (the animation cue), the caption, optional spoken text and pauses |
| Voice | `make_audio.py` | Kokoro TTS (`af_heart`, speed 0.95), one line at a time, then `narration.mp3` + `timeline.json` with exact line timings |
| Pictures | `src/lib.js`, `src/scenes/*.js` | Shared SVG art, and one scene per chapter; each scene is a pure function of time keyed to line ids |
| Player | `src/engine.js`, `src/template.html` | Audio-driven playback, captions, chapters, scrubbing, speed, full screen, resume |
| Page | `build.py` | Bundles everything into one HTML file (`--variant app` for this site) |
| Checks | `shot.js` | Renders chosen moments and tiles them into a contact sheet |

## Rebuild

```bash
pip install kokoro-onnx soundfile        # plus ffmpeg
# model files: kokoro-v1.0.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
KOKORO_DIR=/path/to/models python3 make_audio.py /tmp/resp-audio
python3 build.py --timeline /tmp/resp-audio/timeline.json --out ../../public/lessons \
  --variant app --mp3 /tmp/resp-audio/narration.mp3
```

Editing a line in `script.py` only re-synthesises that line (cached by text).
Scenes refer to lines by id, so their timing follows the new audio.

A change to the pictures alone needs no new audio: rebuild from the committed
`timeline.json` and leave the MP3 as it is.

```bash
python3 build.py --timeline timeline.json --out ../../public/lessons --variant app
```
