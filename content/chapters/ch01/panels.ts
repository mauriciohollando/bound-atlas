export type PanelBeat = {
  id: string;
  section: string;
  /** Ambient place plate key for painterly background. */
  place: "window" | "courtyard" | "fountain" | "cloister" | "dais" | "seal" | "feast";
  /** Optional character silhouettes present. */
  cast?: Array<"theo" | "mira" | "nellie" | "dorian" | "crowd">;
  /** Primary narrative text (adapted from prose — not a dump). */
  text: string;
  /** Optional dialogue attribution. */
  voice?: string;
  /** Special motion / ritual hook. */
  ritual?: "seal_touch" | "banner_sway";
};

/** Abbreviated Chapter 1 — Boat-style kernel + voice; image carries the rest. */
export const ch01Panels: PanelBeat[] = [
  {
    id: "p01",
    section: "dawn",
    place: "window",
    cast: ["theo"],
    text: "The morning of graduation smelled of wet stone and cinnamon.",
  },
  {
    id: "p02",
    section: "dawn",
    place: "window",
    cast: ["theo"],
    text: "Theo Ashcroft meant to sleep. Instead: open window, rebellious hair, a heart doing something undignified.",
  },
  {
    id: "p03",
    section: "dawn",
    place: "window",
    cast: ["theo"],
    voice: "Theo",
    text: "Today.",
  },
  {
    id: "p04",
    section: "courtyard",
    place: "courtyard",
    cast: ["theo", "dorian", "crowd"],
    ritual: "banner_sway",
    text: "Deep gold and thread-silver banners tried to become sails. Younger apprentices drifted toward Theo — not quite asking, hoping he would offer.",
  },
  {
    id: "p05",
    section: "nellie",
    place: "fountain",
    cast: ["theo", "nellie"],
    voice: "Nellie",
    text: "If you walk in the wrong place they strike your name from the Bound rolls.",
  },
  {
    id: "p06",
    section: "nellie",
    place: "fountain",
    cast: ["theo", "nellie"],
    voice: "Theo",
    text: "That’s not true. Walk where Fenwick points. If anyone looks severe, they’re mostly worried about the seating chart.",
  },
  {
    id: "p07",
    section: "mira",
    place: "cloister",
    cast: ["theo", "mira"],
    voice: "Mira",
    text: "Your left guy-line was crooked. I fixed it. You’re welcome.",
  },
  {
    id: "p08",
    section: "mira",
    place: "cloister",
    cast: ["theo", "mira"],
    voice: "Theo",
    text: "I hadn’t thanked you yet.",
  },
  {
    id: "p09",
    section: "mira",
    place: "cloister",
    cast: ["mira"],
    voice: "Mira",
    text: "I was being efficient.",
  },
  {
    id: "p10",
    section: "ceremony",
    place: "dais",
    cast: ["crowd"],
    text: "A river of gold cloth. Formal hush. One by one, graduates crossed the dais and touched the Guild seal.",
  },
  {
    id: "p11",
    section: "ceremony",
    place: "dais",
    cast: ["theo"],
    text: "When Theo’s turn came, the murmur followed him — so young — and he walked through it the way he always had: chin up, ears burning, grin ready.",
  },
  {
    id: "p12",
    section: "seal",
    place: "seal",
    cast: ["theo"],
    ritual: "seal_touch",
    text: "The seal was warm. Not metaphorically. Warm, like a hand that had been holding a lantern.",
  },
  {
    id: "p13",
    section: "seal",
    place: "seal",
    cast: ["theo"],
    ritual: "seal_touch",
    text: "For a heartbeat he smelled rain on unbound earth — wild, dangerous, old — and then it was gone.",
  },
  {
    id: "p14",
    section: "after",
    place: "feast",
    cast: ["theo", "mira"],
    voice: "Mira",
    text: "Your bow was crooked.",
  },
  {
    id: "p15",
    section: "after",
    place: "feast",
    cast: ["theo", "mira"],
    voice: "Theo",
    text: "Your banner knot was crooked first.",
  },
  {
    id: "p16",
    section: "after",
    place: "feast",
    cast: ["theo", "mira"],
    text: "That, somehow, felt like a promise.",
  },
];
