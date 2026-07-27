"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AtmosphereStage } from "./AtmosphereStage";
import { InkMapStage } from "./InkMapStage";
import { useStoryFlags } from "@/flags/store";

type Phase =
  | "black1"
  | "black2"
  | "meridian"
  | "seal"
  | "mapReveal"
  | "draw";

const HOOKS = {
  black1: "The maps were never meant to be complete.",
  black2: "Reading is the sanctioned map.",
  meridian: "Meridian smelled of wet stone and cinnamon.",
  seal: "The seal was warm — like a hand that held a lantern.",
  map: "Trace the Bound lines. Ink remembers what paper forgets.",
};

export function IntroExperience() {
  const enter = useStoryFlags((s) => s.enter);
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("black1");
  const [inkProgress, setInkProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [skipReady, setSkipReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) setPhase("draw");
    const t = window.setTimeout(() => setSkipReady(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  // Timed cinematic beats
  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    const go = (next: Phase, ms: number) => {
      timers.push(window.setTimeout(() => setPhase(next), ms));
    };
    if (phase === "black1") go("black2", 3200);
    if (phase === "black2") go("meridian", 3000);
    if (phase === "meridian") go("seal", 4800);
    if (phase === "seal") go("mapReveal", 4200);
    if (phase === "mapReveal") go("draw", 2200);
    return () => timers.forEach(clearTimeout);
  }, [phase, reduced]);

  const finish = useCallback(() => {
    enter();
    router.replace("/hub");
  }, [enter, router]);

  const skipToDraw = () => setPhase("draw");

  const showAtmosphere = phase === "meridian" || phase === "seal";
  const atmosphereSrc =
    phase === "seal"
      ? "/art/intro/seal-touch.webp"
      : "/art/intro/meridian-dawn.webp";

  return (
    <div className="intro-root">
      <AnimatePresence mode="wait">
        {(phase === "black1" || phase === "black2") && (
          <motion.div
            key={phase}
            className="intro-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <motion.p
              className="intro-hook"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1.1, delay: 0.25 }}
            >
              {phase === "black1" ? HOOKS.black1 : HOOKS.black2}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAtmosphere && (
          <motion.div
            key={atmosphereSrc}
            className="intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <AtmosphereStage
              src={atmosphereSrc}
              fade={1}
              inkAmt={phase === "seal" ? 0.75 : 0.5}
            />
            <motion.p
              className="intro-hook intro-hook-over"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              {phase === "seal" ? HOOKS.seal : HOOKS.meridian}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "mapReveal" || phase === "draw") && (
          <motion.div
            key="map"
            className="intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          >
            <InkMapStage
              mapSrc="/art/intro/bound-atlas-map.webp"
              reveal={1}
              onInkProgress={setInkProgress}
            />
            <div className="intro-map-ui">
              <motion.p
                className="intro-hook intro-hook-over"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "draw" ? 1 : 0.7 }}
                transition={{ duration: 1 }}
              >
                {HOOKS.map}
              </motion.p>
              <div className="intro-draw-meta">
                <div className="intro-ink-meter" aria-hidden>
                  <div
                    className="intro-ink-meter-fill"
                    style={{ width: `${Math.round(inkProgress * 100)}%` }}
                  />
                </div>
                <button
                  type="button"
                  className="intro-enter"
                  onClick={finish}
                >
                  ENTER THE ATLAS
                </button>
                <p className="intro-hint">
                  Draw with your cursor — iron-gall ink on Bound parchment
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {skipReady && phase !== "draw" && (
        <button type="button" className="intro-skip" onClick={skipToDraw}>
          Skip
        </button>
      )}
    </div>
  );
}
