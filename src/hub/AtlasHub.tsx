"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CompactSeal } from "@/art/PlaceArt";
import { useStoryFlags } from "@/flags/store";

type PinId = "meridian" | "saltmere" | "span";

const PINS: Array<{
  id: PinId;
  name: string;
  sensory: string;
  sensoryAfter: string;
  x: number;
  y: number;
  unlock: "start" | "ch01" | "later";
}> = [
  {
    id: "meridian",
    name: "Meridian — Scholar Quarter",
    sensory: "Wet stone. Cinnamon on the wind.",
    sensoryAfter: "The seal’s warmth still lives in your fingertips.",
    x: 42,
    y: 48,
    unlock: "start",
  },
  {
    id: "saltmere",
    name: "Saltmere",
    sensory: "Tar and citrus — sealed until the road opens.",
    sensoryAfter: "Tar and citrus — sealed until the road opens.",
    x: 68,
    y: 62,
    unlock: "later",
  },
  {
    id: "span",
    name: "Span of First Ink",
    sensory: "Sealed light over dark water — not yet.",
    sensoryAfter: "Sealed light over dark water — not yet.",
    x: 78,
    y: 38,
    unlock: "later",
  },
];

export function AtlasHub() {
  const ch01Complete = useStoryFlags((s) => s.ch01_complete);
  const sealWarmth = useStoryFlags((s) => s.seal_warmth);
  const entered = useStoryFlags((s) => s.entered);
  const devUnlockAll = useStoryFlags((s) => s.devUnlockAll);
  const setDevUnlockAll = useStoryFlags((s) => s.setDevUnlockAll);
  const newAtlas = useStoryFlags((s) => s.newAtlas);
  const audioMuted = useStoryFlags((s) => s.audioMuted);
  const setAudioMuted = useStoryFlags((s) => s.setAudioMuted);
  const router = useRouter();
  const [focus, setFocus] = useState<PinId | null>("meridian");
  const [inspector, setInspector] = useState<"live" | "retired">("live");

  const focused = useMemo(
    () => PINS.find((p) => p.id === focus) ?? PINS[0],
    [focus],
  );

  const isUnlocked = (pin: (typeof PINS)[number]) => {
    if (devUnlockAll) return true;
    if (pin.unlock === "start") return true;
    if (pin.unlock === "ch01") return ch01Complete;
    return false;
  };

  if (!entered) {
    return null;
  }

  return (
    <div className="hub">
      <header className="hub-header">
        <h1 className="hub-title">The Bound Atlas</h1>
        <p className="hub-sub">
          {ch01Complete
            ? "Your personal atlas has begun to redraw."
            : "Reading is the sanctioned map. Touch a pin to walk."}
        </p>
      </header>

      <div className="hub-stage">
        <div className="atlas-map" role="img" aria-label="Bound atlas of Meridian">
          <div className="atlas-parchment" />
          <div className="atlas-continent meridian-land" />
          <div className="atlas-continent east-haze" />
          {ch01Complete && <div className="atlas-ink-edge" />}
          {devUnlockAll && <div className="soft-middle-vein" aria-hidden />}

          {PINS.map((pin) => {
            const open = isUnlocked(pin);
            return (
              <button
                key={pin.id}
                type="button"
                className={`atlas-pin${open ? " is-open" : " is-sealed"}${focus === pin.id ? " is-focus" : ""}`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() => setFocus(pin.id)}
                onFocus={() => setFocus(pin.id)}
                aria-label={`${pin.name}${open ? "" : " (sealed)"}`}
              >
                <span className="pin-sun" />
                <span className="pin-label">{pin.name.split("—")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        <aside className="hub-side">
          <div className="hub-card">
            <h2>{focused.name}</h2>
            <p className="sensory">
              {ch01Complete && focused.id === "meridian"
                ? focused.sensoryAfter
                : focused.sensory}
            </p>
            {focused.id === "meridian" && isUnlocked(focused) && (
              <Link className="hub-cta" href="/ch/01">
                {ch01Complete ? "Revisit Morning in Meridian" : "Enter Chapter I"}
              </Link>
            )}
            {!isUnlocked(focused) && (
              <p className="sealed-note">Fold sealed. Walk the story first.</p>
            )}
          </div>

          <div className="hub-card seal-desk">
            <h2>Seal desk</h2>
            <p className="sensory">Live Compact sun vs retired Ledger gold.</p>
            <div className="seal-row">
              <button
                type="button"
                className={inspector === "live" ? "seal-pick on" : "seal-pick"}
                onClick={() => setInspector("live")}
              >
                <CompactSeal variant="live" size={72} />
                <span>Live</span>
              </button>
              <button
                type="button"
                className={inspector === "retired" ? "seal-pick on" : "seal-pick"}
                onClick={() => setInspector("retired")}
              >
                <CompactSeal variant="retired" size={72} />
                <span>Retired</span>
              </button>
            </div>
            <p className="sensory">
              {inspector === "live"
                ? "Warm. Bound. The Guild’s living stamp."
                : "Slightly green-gold. Wrong official. Juni would notice."}
            </p>
          </div>

          <div className="hub-tools">
            <button
              type="button"
              className="tool-btn"
              onClick={() => setAudioMuted(!audioMuted)}
            >
              Audio {audioMuted ? "off" : "on"}
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => setDevUnlockAll(!devUnlockAll)}
            >
              Dev flags {devUnlockAll ? "on" : "off"}
            </button>
            <button
              type="button"
              className="tool-btn danger"
              onClick={() => {
                newAtlas();
                router.replace("/");
              }}
            >
              New atlas
            </button>
          </div>

          {sealWarmth && !ch01Complete && (
            <p className="hub-hint">Continue the scroll — the seal still hums.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
