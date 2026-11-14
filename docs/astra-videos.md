# Real-life Videos Astra

The collection lives at `/reallife-videos-astra`. Each topic's Watch tab also renders its completed Astra lesson, above its existing lessons. Existing auth and learner-profile gates are unchanged.

`lib/astraVideos.ts` is the readiness registry. A missing entry means planned, not playable. Add an entry only after the complete video has been generated, checked and copied into `public/reallife-videos-astra/`. This avoids presenting previews or empty placeholders as completed lessons.

Each entry needs same-site MP4 parts, poster image, English WebVTT captions, actual duration in seconds including the remux container timing and measured chapter start times. Serve MP4 with faststart for seeking. Keep original higher-resolution source files separately; do not overwrite them with delivery encodes.

Respiration is the approved 986.64-second classroom lesson, delivered as three quality-preserving 540p MP4 parts, stream-copied from the approved compact file to fit connector upload limits. It preserves the existing approved voices. The player identifies presenters as AI-generated, does not autoplay, and provides native playback controls, optional captions, chapter navigation and part downloads. Burned-in captions remain in the underlying video.

Before publishing a new lesson: check scientific wording against its topic source, listen for speaker/voice continuity, inspect whiteboard readability, decode the entire file without errors, check duration/chapters/subtitles and verify full playback plus late seeking on the hosted asset. Run `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build`. Do not add incomplete lessons to the registry or weaken checks.
