# Animated lessons

Narrated, animated lessons (about 14 minutes each), one per topic. Each is a
static page in `public/lessons/<topic>.html` with its narration in
`public/lessons/<topic>-narration.mp3`. The topic's Watch tab in the Science
Lab plays it in an iframe (`?embed=1`), awards stars for finished chapters, and
ticks chapters the learner has already watched on any device. A topic gets the
tab once `lesson` is set in `lib/extras/<topic>.ts`.

`PLAYBOOK.md` sets the quality bar for scripts, storyboards and scenes.

## Layout

| Path | What it is |
| --- | --- |
| `engine/lib.js` | Shared SVG art and helpers (palette, molecules, cells, arrows, meters...) |
| `engine/engine.js`, `engine/template.html` | The player: audio-driven playback, captions, chapters, scrubbing, speed, full screen, resume, embed messaging |
| `engine/make_audio.py` | Kokoro TTS (`af_heart`, speed 0.95), one line at a time; writes the MP3 and `<topic>/timeline.json` |
| `engine/check_audio.py` | Transcribes every narration line with Whisper and diffs it with the script |
| `engine/build.py` | Bundles a topic into one HTML page |
| `engine/shot.js` | Renders chosen moments and tiles them into a contact sheet |
| `<topic>/script.py` | `META` (name, kicker, dek) and `CHAPTERS` (every line: id, caption, optional spoken text, pause) |
| `<topic>/STORYBOARD.md` | What the screen shows for each line |
| `<topic>/scenes/NN_<chapter>.js` | One scene per chapter, a pure function of time keyed to line ids |
| `<topic>/lib.js` | Optional art shared by that topic's scenes |
| `<topic>/timeline.json` | Exact line timings from the narration |

## Build

```bash
pip install kokoro-onnx soundfile sherpa-onnx      # plus ffmpeg
# Kokoro v1.0 model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
# Whisper base.en for the check: https://github.com/k2-fsa/sherpa-onnx/releases/tag/asr-models
KOKORO_DIR=/path/to/kokoro python3 lessons/engine/make_audio.py --topic respiration /tmp/audio/respiration
WHISPER_DIR=/path/to/sherpa-onnx-whisper-base.en python3 lessons/engine/check_audio.py --topic respiration /tmp/audio/respiration
python3 lessons/engine/build.py --topic respiration --variant app --mp3 /tmp/audio/respiration/narration.mp3
```

Editing a line in `script.py` only re-synthesises that line (cached by text).
Scenes refer to lines by id, so their timing follows the new audio. A change to
the pictures alone needs no new audio: rebuild from the committed
`timeline.json` and leave the MP3 as it is (omit `--mp3`).
