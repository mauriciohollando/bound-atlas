"use client";

import { useEffect, useRef } from "react";
import {
  FULLSCREEN_VERT,
  createGL,
  createProgram,
  loadTexture,
  resizeCanvas,
} from "./webgl";
import { INK_MAP_FRAG } from "./shaders/inkMap";

type Props = {
  mapSrc: string;
  reveal?: number;
  onInkProgress?: (amt: number) => void;
  className?: string;
};

export function InkMapStage({
  mapSrc,
  reveal = 1,
  onInkProgress,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef(reveal);
  revealRef.current = reveal;
  const progressCb = useRef(onInkProgress);
  progressCb.current = onInkProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGL2RenderingContext;
    try {
      gl = createGL(canvas);
    } catch {
      return;
    }

    const program = createProgram(gl, FULLSCREEN_VERT, INK_MAP_FRAG);
    const locs = {
      uMap: gl.getUniformLocation(program, "uMap"),
      uInk: gl.getUniformLocation(program, "uInk"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uReveal: gl.getUniformLocation(program, "uReveal"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uPointer: gl.getUniformLocation(program, "uPointer"),
      uPointerDown: gl.getUniformLocation(program, "uPointerDown"),
    };

    // Ink accumulation canvas (CPU stamps → GPU texture)
    const inkCanvas = document.createElement("canvas");
    const inkCtx = inkCanvas.getContext("2d", { willReadFrequently: false });
    if (!inkCtx) return;

    const inkTex = gl.createTexture();
    if (!inkTex) return;
    gl.bindTexture(gl.TEXTURE_2D, inkTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let mapTex: WebGLTexture | null = null;
    let raf = 0;
    let alive = true;
    const t0 = performance.now();
    let drawing = false;
    let last: { x: number; y: number } | null = null;
    let inkPixels = 0;
    let pointer = { x: 0.5, y: 0.5 };

    const syncInkSize = (w: number, h: number) => {
      if (inkCanvas.width === w && inkCanvas.height === h) return;
      // preserve existing ink when resizing
      const prev = document.createElement("canvas");
      prev.width = inkCanvas.width;
      prev.height = inkCanvas.height;
      const pctx = prev.getContext("2d");
      if (pctx && inkCanvas.width > 0) {
        pctx.drawImage(inkCanvas, 0, 0);
      }
      inkCanvas.width = w;
      inkCanvas.height = h;
      inkCtx.fillStyle = "#000";
      inkCtx.fillRect(0, 0, w, h);
      if (pctx && prev.width > 0) {
        inkCtx.drawImage(prev, 0, 0, w, h);
      }
      uploadInk();
    };

    const uploadInk = () => {
      gl.bindTexture(gl.TEXTURE_2D, inkTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        inkCanvas,
      );
    };

    const stamp = (x: number, y: number, pressure = 1) => {
      const r = (10 + pressure * 16) * (inkCanvas.height / 900);
      const g = inkCtx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${0.55 * pressure})`);
      g.addColorStop(0.45, `rgba(255,255,255,${0.22 * pressure})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      inkCtx.globalCompositeOperation = "lighter";
      inkCtx.fillStyle = g;
      inkCtx.beginPath();
      inkCtx.arc(x, y, r, 0, Math.PI * 2);
      inkCtx.fill();
      // fiber streaks
      inkCtx.strokeStyle = `rgba(255,255,255,${0.12 * pressure})`;
      inkCtx.lineWidth = Math.max(1, r * 0.15);
      inkCtx.beginPath();
      inkCtx.moveTo(x - r * 0.6, y + (Math.random() - 0.5) * r);
      inkCtx.lineTo(x + r * 0.6, y + (Math.random() - 0.5) * r);
      inkCtx.stroke();
      inkPixels += r * r * 0.35;
      const area = inkCanvas.width * inkCanvas.height;
      progressCb.current?.(Math.min(1, inkPixels / (area * 0.04)));
    };

    const strokeTo = (x: number, y: number) => {
      if (!last) {
        stamp(x, y, 1);
        last = { x, y };
        uploadInk();
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.floor(dist / 3));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        stamp(last.x + dx * t, last.y + dy * t, 0.7 + Math.random() * 0.4);
      }
      last = { x, y };
      uploadInk();
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = inkCanvas.width / rect.width;
      return {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
        u: (e.clientX - rect.left) / rect.width,
        v: 1 - (e.clientY - rect.top) / rect.height,
      };
    };

    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      drawing = true;
      const p = toLocal(e);
      pointer = { x: p.u, y: p.v };
      last = null;
      strokeTo(p.x, p.y);
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer = { x: p.u, y: p.v };
      if (!drawing) return;
      strokeTo(p.x, p.y);
    };
    const onUp = () => {
      drawing = false;
      last = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.style.touchAction = "none";

    loadTexture(gl, mapSrc)
      .then((t) => {
        if (!alive) {
          gl.deleteTexture(t);
          return;
        }
        mapTex = t;
      })
      .catch(() => undefined);

    // seed a faint guided stroke so the map feels alive before first touch
    const seed = () => {
      const w = inkCanvas.width;
      const h = inkCanvas.height;
      if (w < 2) return;
      inkCtx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 40; i++) {
        const t = i / 39;
        const x = w * (0.18 + t * 0.55);
        const y = h * (0.62 + Math.sin(t * Math.PI * 2) * 0.06);
        stamp(x, y, 0.25);
      }
      uploadInk();
    };

    let seeded = false;

    const draw = () => {
      if (!alive) return;
      const { w, h } = resizeCanvas(canvas, gl);
      syncInkSize(w, h);
      if (!seeded && w > 2) {
        seeded = true;
        seed();
      }

      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      if (mapTex) gl.bindTexture(gl.TEXTURE_2D, mapTex);
      gl.uniform1i(locs.uMap, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, inkTex);
      gl.uniform1i(locs.uInk, 1);
      gl.uniform1f(locs.uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(locs.uReveal, revealRef.current);
      gl.uniform2f(locs.uResolution, w, h);
      gl.uniform2f(locs.uPointer, pointer.x, pointer.y);
      gl.uniform1f(locs.uPointerDown, drawing ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      if (mapTex) gl.deleteTexture(mapTex);
      gl.deleteTexture(inkTex);
      gl.deleteProgram(program);
    };
  }, [mapSrc]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Draw ink on the Bound atlas"
      style={{ width: "100%", height: "100%", display: "block", cursor: "crosshair" }}
    />
  );
}
