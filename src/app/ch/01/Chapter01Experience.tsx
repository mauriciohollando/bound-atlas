"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ch01Panels } from "../../../../content/chapters/ch01/panels";
import { ComicScroll } from "@/comic/ComicScroll";
import { useSealAudio } from "@/audio/useSealAudio";
import { useStoryFlags } from "@/flags/store";

export function Chapter01Experience() {
  const router = useRouter();
  const entered = useStoryFlags((s) => s.entered);
  const setSealWarmth = useStoryFlags((s) => s.setSealWarmth);
  const completeCh01 = useStoryFlags((s) => s.completeCh01);
  const setReducedMotion = useStoryFlags((s) => s.setReducedMotion);
  const { chime, startWarmth } = useSealAudio();
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setReducedMotion]);

  useEffect(() => {
    if (hydrated && !entered) router.replace("/");
  }, [hydrated, entered, router]);

  const onSeal = useCallback(() => {
    setSealWarmth();
    startWarmth();
    chime();
  }, [setSealWarmth, startWarmth, chime]);

  const onComplete = useCallback(() => {
    setDone(true);
  }, []);

  const foldAtlas = () => {
    completeCh01();
    router.push("/hub");
  };

  if (!hydrated || !entered) {
    return <main className="page-loading">Unfolding ink…</main>;
  }

  return (
    <main className="chapter-page">
      <header className="chapter-bar">
        <Link href="/hub" className="fold-link">
          Fold atlas
        </Link>
        <h1>I — Morning in Meridian</h1>
        <span className="chapter-bar-spacer" />
      </header>

      <ComicScroll
        panels={ch01Panels}
        onSealWarmth={onSeal}
        onComplete={onComplete}
      />

      {done && (
        <div className="chapter-complete">
          <p>The seal’s warmth stays with you.</p>
          <button type="button" className="hub-cta" onClick={foldAtlas}>
            Return — redraw the atlas
          </button>
        </div>
      )}
    </main>
  );
}
