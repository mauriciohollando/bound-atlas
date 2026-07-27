# 09 — Audio Design

## Philosophy

Score and sound **perform with the reader** (Upgrade Soul).  
No mandatory voiceover.  
Silence is a Spine tool.

## Stems (layers)

| Stem | Role | Example |
|------|------|---------|
| **Place bed** | Continuous atmosphere | Courtyard, harbor, thin air |
| **Motion bed** | Tied to scroll velocity | Coach rhythm, monorail hum |
| **Story accent** | On panel/section enter | Seal warmth chord, wax sigh |
| **Threat accent** | Ledger / Melk / greys | Pin chill, ink scream |
| **Soft Middle** | Dissonant partials | Twin-curve overlay success/fail |
| **Silence** | Intentional | Wind-serpent circle; post-Bramble |

## Reactive rules

1. Advancing scroll/panel schedules accents; scrubbing backward crossfades, doesn’t reverse “plot music” awkwardly.  
2. Holding still extends place bed (Boat/Petty lesson).  
3. Autoscroll uses same accent map as manual.  
4. Mute = no stems; “text only” available.  
5. `prefers-reduced-motion` does not require mute, but threat accents soften.

## Chapter cue map (high level)

| Ch | Signature |
|----|-----------|
| 1 | Cinnamon bells, soft crowd |
| 2 | Iron under woodwinds |
| 3 | Wheels → gulls |
| 4 | Festive music with wrong undercurrent |
| 5 | Spray + sealed-light drone |
| 6 | Tower bells in Haven modes |
| 7 | Pursuit percussion; stamp impacts |
| 8 | Kitchen honesty → parchment rip |
| 9 | Quiet; orange; last late-smile motif |
| 10 | Scorched crow; distant March drums |
| 11 | Breath; then stone hum answering rhyme |
| 12 | Bone bells; star-cold |
| 13 | Air thickening; dust |
| 14 | Three-tongue market; silt water |
| 15 | Wax sigh; tooth-stutter foley (subtle) |
| 16 | Clash; Continuance calm motif vs Melk pain |
| 17 | Held breath; open horizon fifth |

## Diegetic vs non-diegetic

- Prefer diegetic sources in frame (bells, rails, crow).  
- Soft Middle may be “heard in the teeth” — keep barely musical.  
- No omniscient narrator VO.

## Implementation notes

- Web Audio graph; stem buses; distance attenuation for hub.  
- Stream beds; preload accents for upcoming section.  
- Haptics (optional): only Melk mountain birth + major wave-equivalents — rare.
