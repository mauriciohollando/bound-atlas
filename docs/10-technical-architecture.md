# 10 — Technical Architecture

## Goals

- Ship Story Mode on Tier B/C devices.  
- Progressive enhancement for panoramas + WebGPU rituals.  
- Fast loads via streaming (Boat lesson).  
- Flag-gated content; local save.

## Proposed stack (v1 recommendation)

| Layer | Suggestion | Why |
|-------|------------|-----|
| App shell | Next.js or Astro + React islands | Routes, content MDX, perf |
| Comic scroll | Custom scrollytelling (IntersectionObserver + canvas/DOM layers) | Boat-like control |
| Motion | GSAP / Motion One + CSS | Wide support |
| 2.5D panorama | Canvas or WebGL (Three.js) | Exodus islands |
| Page-space rituals | Three.js WebGPU when available; WebGL1/2 fallback; static frames last | Shining-like |
| Audio | Web Audio API | Reactive stems |
| Content | MDX / JSON chapter manifests + CDN assets | Pipeline-friendly |
| Save | `localStorage` / `IndexedDB` | Continue + flags |

Exact framework is negotiable; **chapter manifest schema** is not.

## Chapter manifest (sketch)

```json
{
  "id": "ch05",
  "title": "The Span Express",
  "form": ["panorama", "vertical_inserts"],
  "flagsRequired": ["letter_held"],
  "flagsSet": ["folio_partial", "vesper_marked"],
  "sections": [
    { "id": "pylons", "assets": ["..."], "accents": ["sealed_hum"], "branches": [] }
  ],
  "clues": ["folio_hollowford"]
}
```

## Progressive enhancement matrix

| Feature | Tier A | Tier B | Tier C |
|---------|--------|--------|--------|
| Vertical comic | full parallax | light parallax | static layers + CSS |
| Span panorama | WebGL tilt/scroll | reduced layers | long image + scroll |
| Temple basin | WebGPU light | WebGL | illustrated slideshow |
| Twin overlay | full toy | full toy | 2D drag |
| Haptics | if available | optional | off |

## Spoiler gate

Middleware on routes checks `StoryFlags`; late chapter URLs show sealed interstitial.

## Performance budget (targets)

- First chapter interactive < 3s on mid broadband  
- Section streaming ahead by 1–2 screens  
- Hub atlas initial < 1.5MB compressed textures/vectors  

## Analytics (privacy-respecting)

- Chapter complete, branch open rate, tool use — no invasive heatmaps required for v1  
- Error logging for WebGPU fail → fallback path  

## Security / integrity

- Treat flags as UX not DRM  
- Don’t put unreleased chapter art on public CDN without gate if spoilers matter commercially  

## Repo layout (suggested later)

```
/interactive-docs (these md files)
/web
  /content/chapters
  /public/atlas
  /src/comic
  /src/hub
  /src/survey
  /src/audio
```
