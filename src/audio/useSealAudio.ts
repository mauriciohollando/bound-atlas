"use client";

import { useCallback, useEffect, useRef } from "react";
import { useStoryFlags } from "@/flags/store";

/** Lightweight Web Audio stem: cinnamon-bell + seal warmth pulse. */
export function useSealAudio() {
  const muted = useStoryFlags((s) => s.audioMuted);
  const ctxRef = useRef<AudioContext | null>(null);
  const warmthRef = useRef<OscillatorNode | null>(null);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const chime = useCallback(() => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    void ctx.resume();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.02 + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + i * 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + 1.4 + i * 0.1);
    });
  }, [ensureCtx, muted]);

  const startWarmth = useCallback(() => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx || warmthRef.current) return;
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 110;
    gain.gain.value = 0.035;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    warmthRef.current = osc;
    window.setTimeout(() => {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
      warmthRef.current = null;
    }, 2800);
  }, [ensureCtx, muted]);

  useEffect(() => {
    return () => {
      warmthRef.current?.stop();
      void ctxRef.current?.close();
    };
  }, []);

  return { chime, startWarmth };
}
