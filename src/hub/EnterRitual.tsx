"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompactSeal } from "@/art/PlaceArt";
import { useStoryFlags } from "@/flags/store";

export function EnterRitual() {
  const enter = useStoryFlags((s) => s.enter);
  const router = useRouter();
  const [glow, setGlow] = useState(false);

  const onEnter = () => {
    setGlow(true);
    enter();
    window.setTimeout(() => router.push("/hub"), 700);
  };

  return (
    <main className="enter-screen">
      <div className={`enter-seal${glow ? " is-glow" : ""}`}>
        <CompactSeal variant="live" size={160} />
      </div>
      <h1 className="enter-title">The Bound Atlas</h1>
      <p className="enter-blurb">
        Reading is the sanctioned map. Exploration is Soft Middle.
        <br />
        Progress redraws your personal atlas.
      </p>
      <button type="button" className="enter-btn" onClick={onEnter}>
        ENTER
      </button>
      <p className="enter-fine">Vertical slice — Morning in Meridian</p>
    </main>
  );
}
