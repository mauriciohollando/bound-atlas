"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CompactSeal } from "@/art/PlaceArt";
import { AtmosphereStage } from "@/intro/AtmosphereStage";
import { InkMapStage } from "@/intro/InkMapStage";
import { useStoryFlags } from "@/flags/store";

type PinId = "meridian" | "saltmere" | "span";

const PINS: Array<{
  id: PinId;
  name: string;
  sensory: string;
  sensoryAfter: string;
  /** Percent positions over the fantasy atlas plate. */
  x: number;
  y: number;
  unlock: "start" | "ch01" | "later";
}> = [
  {
    id: "meridian",
    name: "Meridian — Scholar Quarter",
    sensory: "Wet stone. Cinnamon on the wind.",
    sensoryAfter: "The seal’s warmth still lives in your fingertips.",
    x: 38,
    y: 48,
    unlock: "start",
  },
  {
    id: "saltmere",
    name: "Saltmere",
    sensory: "Tar and citrus — sealed until the road opens.",
    sensoryAfter: "Tar and citrus — sealed until the road opens.",
    x: 28,
    y: 72,
    unlock: "later",
  },
  {
    id: "span",
    name: "Span of First Ink",
    sensory: "Sealed light over dark water — not yet.",
    sensoryAfter: "Sealed light over dark water — not yet.",
    x: 52,
    y: 46,
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
  const [drawMode, setDrawMode] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

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
    <div className="hub-immersive">
      <div className="hub-map-layer" aria-hidden={!drawMode}>
        {drawMode ? (
          <InkMapStage mapSrc="/art/intro/bound-atlas-map.webp" reveal={1} />
        ) : (
          <AtmosphereStage
            src="/art/intro/bound-atlas-map.webp"
            fade={1}
            inkAmt={0.65}
          />
        )}
      </div>

      <div className="hub-vignette" aria-hidden />

      <header className="hub-immersive-header">
        <div>
          <p className="hub-kicker">The Bound Atlas</p>
          <h1 className="hub-immersive-title">
            {ch01Complete
              ? "Your personal atlas has begun to redraw."
              : "Reading is the sanctioned map."}
          </h1>
        </div>
        <div className="hub-header-actions">
          <button
            type="button"
            className={`tool-btn${drawMode ? " on" : ""}`}
            onClick={() => setDrawMode((v) => !v)}
          >
            {drawMode ? "Ink brush on" : "Ink brush off"}
          </button>
          <button
            type="button"
            className="tool-btn"
            onClick={() => setPanelOpen((v) => !v)}
          >
            {panelOpen ? "Hide desk" : "Show desk"}
          </button>
          <button
            type="button"
            className="tool-btn danger"
            onClick={() => {
              newAtlas();
              router.replace("/");
            }}
          >
            Replay intro
          </button>
        </div>
      </header>

      <div className="hub-pin-layer">
        {PINS.map((pin) => {
          const open = isUnlocked(pin);
          return (
            <button
              key={pin.id}
              type="button"
              className={`atlas-pin immersive${open ? " is-open" : " is-sealed"}${focus === pin.id ? " is-focus" : ""}`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              onClick={() => {
                setFocus(pin.id);
                setPanelOpen(true);
              }}
              aria-label={`${pin.name}${open ? "" : " (sealed)"}`}
            >
              <span className="pin-sun" />
              <span className="pin-label">{pin.name.split("—")[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {panelOpen && (
        <aside className="hub-float-panel">
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
            <div className="seal-row">
              <button
                type="button"
                className={inspector === "live" ? "seal-pick on" : "seal-pick"}
                onClick={() => setInspector("live")}
              >
                <CompactSeal variant="live" size={64} />
                <span>Live</span>
              </button>
              <button
                type="button"
                className={inspector === "retired" ? "seal-pick on" : "seal-pick"}
                onClick={() => setInspector("retired")}
              >
                <CompactSeal variant="retired" size={64} />
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
          </div>

          {sealWarmth && !ch01Complete && (
            <p className="hub-hint">Continue the scroll — the seal still hums.</p>
          )}
          {drawMode && (
            <p className="hub-hint">
              Drag across the parchment — iron-gall ink with brush fibers.
            </p>
          )}
        </aside>
      )}
    </div>
  );
}
