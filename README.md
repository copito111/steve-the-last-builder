# STEVE — THE LAST BUILDER

A cinematic English-language fan chronicle. Built with plain HTML, CSS and JavaScript: no framework, runtime dependencies, API keys, database or paid service needed.

## Run locally

Requires Node.js 20 or newer.

```sh
npm run dev
```

Open http://127.0.0.1:4173 . Production build: `npm run build`. Preview it: `npm run preview`. Validate source and linked assets: `npm run check`.

## What's inside

- Responsive cinematic cover with pointer parallax, cyan particle aura and a rotating CSS 3D Worldheart.
- Six chronological chapter tabs, keyboard navigation, scene lightbox and five tilting avatar portraits.
- A 116-second cinematic still-image player with pause, seek, fullscreen, original score and optional voice. It is not an exported video.
- Original background instrumental, local audio controls and automatic music ducking beneath narration. Audio starts only after a visitor clicks.
- Private drag-and-drop narration preview. MP3, WAV, M4A, OGG and WebM are accepted when supported by the browser; 50 MB limit. IndexedDB keeps the recording on that visitor's device. No recording is uploaded to a server.
- Reduced-motion support, accessible dialogs, visible focus, alt text and responsive layouts.
- Downloadable English script and exact 9:16 poster composition.

## Publish your own narration

The recording picker is a **private local preview**, not a publishing feature. To let every visitor hear your voice:

1. Record the English script in `public/narration-script.txt` (about 110–120 seconds).
2. Export an MP3 and save it at `public/audio/narration.mp3`.
3. Commit and push to the connected GitHub repository. Vercel redeploys automatically when the Git integration is enabled.

The site detects that file automatically. Keep it near 116 seconds for the chapter cues. A visitor's private recording takes precedence on that browser and can be removed with the on-page control.

## Vercel

Import this repository. Framework preset: **Other**. Build command: `npm run build`. Output directory: `dist`. No environment variables needed. The tracked `vercel.json` declares the settings.

## Music and artwork

`public/audio/worldheart-original.mp3` is an original procedural instrumental made for this project, using synthesized tones and percussion, with no third-party samples or vocals. It may be used, modified and redistributed royalty-free as part of this project. Recreate it with `python scripts/generate_score.py` (optional Python/NumPy/FFmpeg dependencies, not needed for deployment).

The eleven original AI-generated character and scene illustrations are stored as optimized WebP images. The design is inspired by the supplied references. This is an original fictional fan project, not official Minecraft material; Minecraft, STEVE and related characters remain associated with their respective owners. Not affiliated with Mojang or Microsoft.

The dates are fictional and preserved exactly. Font families Barlow Condensed, DM Sans and Space Mono are delivered by Google Fonts; local system fonts remain available if the font service is unavailable.
