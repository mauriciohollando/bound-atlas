"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PanelBeat } from "../../content/chapters/ch01/panels";
import { PlaceArt } from "@/art/PlaceArt";
import { useStoryFlags } from "@/flags/store";

type Props = {
  panels: PanelBeat[];
  onSealWarmth?: () => void;
  onComplete?: () => void;
};

export function ComicScroll({ panels, onSealWarmth, onComplete }: Props) {
  const reducedMotion = useStoryFlags((s) => s.reducedMotion);
  const sealFired = useRef(false);
  const [activeId, setActiveId] = useState(panels[0]?.id ?? "");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-panel-id]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.getAttribute("data-panel-id");
          if (id) setActiveId(id);
          const ritual = entry.target.getAttribute("data-ritual");
          if (ritual === "seal_touch" && !sealFired.current) {
            sealFired.current = true;
            onSealWarmth?.();
          }
        }
      },
      { threshold: 0.55, rootMargin: "-10% 0px -20% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [panels, onSealWarmth]);

  useEffect(() => {
    if (!endRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onComplete?.();
      },
      { threshold: 0.8 },
    );
    io.observe(endRef.current);
    return () => io.disconnect();
  }, [onComplete]);

  return (
    <div className="comic-scroll">
      <div className="comic-progress" aria-hidden>
        <div
          className="comic-progress-ink"
          style={{
            height: `${Math.max(
              4,
              ((panels.findIndex((p) => p.id === activeId) + 1) / panels.length) *
                100,
            )}%`,
          }}
        />
      </div>

      {panels.map((panel, i) => (
        <article
          key={panel.id}
          data-panel-id={panel.id}
          data-ritual={panel.ritual ?? ""}
          data-section={panel.section}
          className={`comic-panel${activeId === panel.id ? " is-active" : ""}`}
          style={
            reducedMotion
              ? undefined
              : ({
                  ["--parallax" as string]: `${(i % 3) * 4}px`,
                } as CSSProperties)
          }
        >
          <PlaceArt
            place={panel.place}
            cast={panel.cast}
            ritual={panel.ritual}
            reduceMotion={reducedMotion}
          />
          <div className="comic-caption">
            {panel.voice && (
              <span className="comic-voice">{panel.voice}</span>
            )}
            <p>{panel.text}</p>
          </div>
        </article>
      ))}

      <div ref={endRef} className="comic-end" />
    </div>
  );
}
