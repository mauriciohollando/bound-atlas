# 04 — Atlas Information Architecture

## Top-level flow

```
Boot / ink-seal glow
    → ENTER (threshold ritual)
        → Atlas Hub (first visit: Meridian only unlocked)
            → Chapter pins / Continue
                → Story Mode (scroll comic)
                    ↔ optional Archive tabs
                    ↔ optional Survey tools (if unlocked)
                → return to Hub (map redraws)
        → Credits / Manifesto (small, quiet)
```

## Atlas Hub — spatial IA

### Continents & connectors

| Region | Unlock after | Pin style |
|--------|--------------|-----------|
| Meridian / Scholar Quarter | Start | Gold Compact sun |
| Solmere countryside / Low Chart | Ch3 start | Wheat |
| Saltmere | Ch3 end | Green glass roof |
| Span of First Ink | Ch5 | Sealed-light ribbon |
| Auric Haven | Ch5 end | Tower crowns |
| Long Water / Bramble road | Ch8 | Merchant wagon |
| Melk’s Wrong Ridge | Ch8 end | Black scar (unerasable) |
| Greywatch | Ch9 | Lantern tooth |
| Spine of Eld | Ch10–13 | White peaks |
| Temple Above Clouds | Ch12 | Bone bell |
| Hollowford | Ch14 | Twin-bed river |
| Soft Middle veins | After Ch15 letter OR Ch16 fight | Flicker between west↔east |

### Hub interactions

- **Hover/focus pin:** place name + one sensory line (smell/sound).  
- **Click pin:** enter chapter scroll or visitable room if built.  
- **Drag twin-curve toy** (late): only after folio complete + letter opened.  
- **Poster board** (corner): updates with chase state.  
- **Crow perch:** delivers queued notes when flags allow.

## Diegetic UI vs meta UI

| Need | Diegetic preferred | Meta fallback |
|------|--------------------|---------------|
| Continue | Warm letter / sleeping compass | “Continue” text |
| Settings | Ink vial / seal stamp desk | Gear menu |
| Map | Atlas itself | Minimap |
| Clues | Folio satchel | Inventory list |
| Branch | Folded vault tab / reed fold | “Optional” link |

## Navigation chrome (minimal)

- Progress tick = ink line filling along chapter edge  
- Escape to hub = “fold atlas” animation  
- No persistent hamburger if avoidable; long-press seal or corner compass  

## Save model

- Local save: chapter index, flags, collected clue IDs, audio prefs, reduced motion  
- Optional account later — not required for v1  
- “New atlas” = wipe personal Soft Middle veins (scary confirm)

## URL scheme (shareable)

- `/` hub  
- `/ch/01` … `/ch/17`  
- `/archive/poster-meridian`  
- `/survey/seals`  
- Deep links respect spoiler flags (show locked state, not content)

## Spoiler / gate service

Central `StoryFlags` (see clue doc). Hub and tools subscribe; never trust client-only for “secret” text if you later add multiplayer — for v1, client flags are fine with clear spoiler warning on forced unlock (dev only).
