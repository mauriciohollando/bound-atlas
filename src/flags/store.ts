"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** StoryFlags for the vertical slice. Soft Middle / late flags stay false. */
export type StoryFlags = {
  entered: boolean;
  seal_warmth: boolean;
  ch01_complete: boolean;
  continueChapter: "ch01" | null;
  audioMuted: boolean;
  reducedMotion: boolean;
  /** Dev-only: reveal sealed hub pins / Soft Middle vein. */
  devUnlockAll: boolean;
};

type FlagActions = {
  enter: () => void;
  setSealWarmth: () => void;
  completeCh01: () => void;
  setAudioMuted: (muted: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  setDevUnlockAll: (value: boolean) => void;
  newAtlas: () => void;
};

const initialFlags: StoryFlags = {
  entered: false,
  seal_warmth: false,
  ch01_complete: false,
  continueChapter: null,
  audioMuted: false,
  reducedMotion: false,
  devUnlockAll: false,
};

export const useStoryFlags = create<StoryFlags & FlagActions>()(
  persist(
    (set) => ({
      ...initialFlags,
      enter: () => set({ entered: true }),
      setSealWarmth: () =>
        set({ seal_warmth: true, continueChapter: "ch01" }),
      completeCh01: () =>
        set({
          ch01_complete: true,
          seal_warmth: true,
          continueChapter: null,
        }),
      setAudioMuted: (audioMuted) => set({ audioMuted }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setDevUnlockAll: (devUnlockAll) => set({ devUnlockAll }),
      newAtlas: () => set({ ...initialFlags }),
    }),
    { name: "bound-atlas-flags-v1" },
  ),
);
