import Image from "next/image";
import type { PanelBeat } from "../../content/chapters/ch01/panels";

type Props = {
  place: PanelBeat["place"];
  cast?: PanelBeat["cast"];
  ritual?: PanelBeat["ritual"];
  reduceMotion?: boolean;
};

const PLACE_IMAGE: Partial<Record<PanelBeat["place"], string>> = {
  courtyard: "/art/places/meridian-courtyard.webp",
  window: "/art/places/meridian-courtyard.webp",
  fountain: "/art/places/meridian-courtyard.webp",
  cloister: "/art/places/meridian-courtyard.webp",
  dais: "/art/places/meridian-courtyard.webp",
  feast: "/art/places/meridian-courtyard.webp",
};

/** Painterly place + clear-line cast — Meridian palette with locked plates. */
export function PlaceArt({ place, cast = [], ritual, reduceMotion }: Props) {
  const plate = PLACE_IMAGE[place];

  return (
    <div
      className={`place-art place-${place}${ritual === "banner_sway" && !reduceMotion ? " banners-live" : ""}${ritual === "seal_touch" ? " seal-live" : ""}`}
      aria-hidden
    >
      {plate ? (
        <Image
          src={plate}
          alt=""
          fill
          className="place-photo"
          sizes="(max-width: 720px) 100vw, 720px"
          priority={place === "window" || place === "courtyard"}
        />
      ) : (
        <div className="place-wash" />
      )}
      <div className="place-tint" />
      <div className="place-mid" />
      {place === "courtyard" && (
        <>
          <div className="banner banner-a" />
          <div className="banner banner-b" />
        </>
      )}
      {place === "seal" && (
        <div className="seal-orb">
          <Image
            src="/art/seals/compact-seal-live.webp"
            alt=""
            width={140}
            height={140}
            className="seal-photo"
          />
        </div>
      )}
      <div className="cast-row">
        {cast.includes("theo") && <Silhouette who="theo" />}
        {cast.includes("mira") && <Silhouette who="mira" />}
        {cast.includes("nellie") && <Silhouette who="nellie" />}
        {cast.includes("dorian") && <Silhouette who="dorian" />}
        {cast.includes("crowd") && <Silhouette who="crowd" />}
      </div>
    </div>
  );
}

function Silhouette({
  who,
}: {
  who: "theo" | "mira" | "nellie" | "dorian" | "crowd";
}) {
  return <div className={`sil sil-${who}`} title={who} />;
}

export function CompactSeal({
  variant,
  size = 64,
}: {
  variant: "live" | "retired";
  size?: number;
}) {
  const gold = variant === "live" ? "#c9a227" : "#a8a05a";
  const core = variant === "live" ? "#f0d060" : "#b8b070";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={variant === "live" ? "Live Compact seal" : "Retired Compact seal"}
    >
      <circle cx="50" cy="50" r="46" fill="#1a2332" stroke={gold} strokeWidth="3" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={gold} strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const x2 = 50 + Math.cos(r) * 28;
        const y2 = 50 + Math.sin(r) * 28;
        return (
          <line
            key={deg}
            x1="50"
            y1="50"
            x2={x2}
            y2={y2}
            stroke={gold}
            strokeWidth="2"
          />
        );
      })}
      <circle cx="50" cy="50" r="10" fill={core} />
      <circle cx="50" cy="50" r="4" fill="#1a2332" />
    </svg>
  );
}
