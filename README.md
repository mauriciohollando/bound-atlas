# The Bound Atlas

Vertical-scroll graphic novel + atlas hub — **prototype vertical slice**.

**Live:** https://bound-atlas.vercel.app  
**Repo:** https://github.com/mauriciohollando/bound-atlas

Flow: **ENTER → Hub → Chapter I (abbreviated) → Hub redraw**

## Stack

- Next.js App Router + Tailwind
- Zustand (`localStorage`) StoryFlags
- CSS/SVG Meridian art + AI reference sheets in `public/art` / `style-bible`
- Web Audio cinnamon-bell + seal warmth accents

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Separate Vercel project `fractal-loop/bound-atlas` (not the portfolio / parent aiquest app).

```bash
npx vercel --prod
```

## Content pipeline

See `style-bible/` and `docs/` (Bound Maps interactive planning set).

## StoryFlags (slice)

| Flag | Meaning |
|------|---------|
| `entered` | Passed ENTER ritual |
| `seal_warmth` | Touched Guild seal in Ch1 |
| `ch01_complete` | Folded atlas after Ch1 |
| `devUnlockAll` | Hub: show Soft Middle vein + unlock sealed pins |

## Non-goals (this slice)

Full Ch2–17, Span panorama, accounts, Ashari script, Melk FX.
