# 06 — Clue & Soft Middle System

## Design goals

- Clues are **cartographic objects**, not abstract XP.  
- Payoffs rhyme (west ↔ east).  
- Explorer rewards never unlock story-past gates early.  
- Some archive entries are **intentionally wrong** (Ledger noise).

## Story flags (canonical)

| Flag | Set when | Unlocks |
|------|----------|---------|
| `letter_held` | Ch2 | Warm satchel UI |
| `ledger_word` | Ch3 clerk | Archive tag “Ledger” |
| `folio_partial` | Ch5 | Incomplete folio tool |
| `vesper_marked` | Ch5–7 | Follow/poster states |
| `retired_seal_seen` | Ch6 | Seal inspector pattern pack |
| `offbooks` | Ch7 | Hub: Alliance rails greyed |
| `melk_mountain` | Ch8 | Wrong ridge pin permanent |
| `bramble_dead` | Ch8 | Shrine/respect interactions |
| `folio_complete` | Ch9 | Twin page restored |
| `hinge_named` | Ch9 Vesper | Hollowford labeled hinge |
| `war_west` | Ch10 | March drums on hub west |
| `temple_seen` | Ch12 | Mosaic archive |
| `ghost_confirmed` | Ch14–15 | River prefers ghost |
| `letter_opened` | Ch15 | Twin overlay + Crowe text |
| `corwin_silent` | Ch15 crow | Hub Meridian “unavailable” |
| `binding_touched` | Ch16 | Personal atlas stutter FX |
| `hale_alive` | Ch17 crow | Narrow-circle hope |
| `book1_complete` | Ch17 end | Soft Middle veins + Book 2 tease |

## Collectibles

| ID | Object | Acquired | Use |
|----|--------|----------|-----|
| `wax_letter` | Crowe letter | Ch2 | Open only after `ghost_confirmed` |
| `folio_hollowford` | Survey folio | Ch5 (+page Ch9) | Overlay with western curve |
| `depot_token` | Hollowford brass | Ch6 sight | Archive link |
| `buyers_scrap` | Bramble ledger burn | Ch8 | Names circled → Ch14 market |
| `vesper_page` | Mirrored river | Ch9 | Completes folio |
| `sleeping_compass` | Bone token | Ch12 | Hub navigation skin |
| `crow_unavailable` | L note | Ch15 | Archive |
| `crow_CH` | C.H. note | Ch17 | Archive / end |

## Soft Middle visualization rules

1. Before `letter_opened`: hub shows only rumors (wrong stars, clerk fear) — no labeled Soft Middle.  
2. After `letter_opened`: faint vein between March and Hollowford.  
3. After `binding_touched`: vein pulses when user idles on hub.  
4. Twin overlay tool: drag curves; success chime only if `folio_complete && letter_opened`.

## Anti-spoiler rules

- Dev “unlock all” behind triple-confirm.  
- Shared URLs to late chapters show **sealed wax** interstitial if flags missing: “The water has not preferred its ghost yet.” Offer jump with spoiler acknowledge.  
- Survey Mode copy never says “Ascension = touch Binding.” Show stutter; don’t define.

## False leads (Archive)

- Poster rumor: “Ashcroft opened the letter on the Span” (false).  
- Map Law scrap: “Rivers cannot ghost under Binding Type 1” (outdated).  
- Haven gossip: “Vesper Teal is Corwin’s agent” (false / half).  

Truth is earned in spine; archive teaches distrust of pins.
