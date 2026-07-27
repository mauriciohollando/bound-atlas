"use client";

import { useEffect, useRef } from "react";
import {
  FULLSCREEN_VERT,
  createGL,
  createProgram,
  loadTexture,
  resizeCanvas,
} from "./webgl";
import { ATMOSPHERE_FRAG } from "./shaders/atmosphere";

type Props = {
  src: string;
  fade?: number;
  inkAmt?: number;
  className?: string;
};

export function AtmosphereStage({
  src,
  fade = 1,
  inkAmt = 0.55,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fadeRef = useRef(fade);
  const inkRef = useRef(inkAmt);
  fadeRef.current = fade;
  inkRef.current = inkAmt;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGL2RenderingContext;
    try {
      gl = createGL(canvas);
    } catch {
      return;
    }

    const program = createProgram(gl, FULLSCREEN_VERT, ATMOSPHERE_FRAG);
    const uImage = gl.getUniformLocation(program, "uImage");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uFade = gl.getUniformLocation(program, "uFade");
    const uInkAmt = gl.getUniformLocation(program, "uInkAmt");
    const uResolution = gl.getUniformLocation(program, "uResolution");

    let tex: WebGLTexture | null = null;
    let raf = 0;
    let alive = true;
    const t0 = performance.now();

    loadTexture(gl, src)
      .then((t) => {
        if (!alive) {
          gl.deleteTexture(t);
          return;
        }
        tex = t;
      })
      .catch(() => undefined);

    const draw = () => {
      if (!alive) return;
      const { w, h } = resizeCanvas(canvas, gl);
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      if (tex) gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uImage, 0);
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(uFade, fadeRef.current);
      gl.uniform1f(uInkAmt, inkRef.current);
      gl.uniform2f(uResolution, w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (tex) gl.deleteTexture(tex);
      gl.deleteProgram(program);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
