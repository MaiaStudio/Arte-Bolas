import { useEffect, useRef, useState } from "react";
import { palettes } from "../../data/content";
export default function BalloonScene({ onReady }: { onReady: () => void }) {
  const host = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(palettes[0].color);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    let disposed = false,
      epoch = 0,
      cleanup: (() => void) | undefined;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const start = async () => {
      const version = ++epoch;
      cleanup?.();
      cleanup = undefined;
      if (media.matches) {
        setFallback(true);
        onReady();
        return;
      }
      try {
        const { createBalloonScene } = await import("./balloonEngine");
        if (disposed || version !== epoch) return;
        const control = {
          started: true,
          progress: 0,
          releaseFocus: 0,
          releaseCenterNormY: 0,
        };
        const mouse = { x: 99, y: 99, isDown: false };
        const update = () => {
          const ids = ["hero", "physics", "form", "release"];
          const anchors = ids.map((id) => document.getElementById(id)!);
          const y = scrollY;
          let progress = 0;
          for (let i = 0; i < anchors.length; i++) {
            const top = anchors[i].getBoundingClientRect().top + y;
            const next = anchors[i + 1];
            const end = next
              ? next.getBoundingClientRect().top + y
              : top + anchors[i].offsetHeight;
            if (y >= top)
              progress =
                i +
                Math.min(1, Math.max(0, (y - top) / Math.max(1, end - top)));
          }
          control.progress = progress;
          const r = document
            .getElementById("release-reading-zone")!
            .getBoundingClientRect();
          const center = r.top + r.height / 2;
          const d = Math.abs(center - innerHeight / 2) / innerHeight;
          control.releaseFocus = 1 - Math.min(1, Math.max(0, (d - 0.1) / 0.46));
          control.releaseCenterNormY = Math.max(
            -0.85,
            Math.min(0.85, 1 - (center / innerHeight) * 2),
          );
        };
        const move = (e: PointerEvent) => {
          const r = host.current!.getBoundingClientRect();
          mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
          mouse.y = 1 - ((e.clientY - r.top) / r.height) * 2;
        };
        const down = () => {
            mouse.isDown = true;
          },
          up = () => {
            mouse.isDown = false;
          },
          leave = () => {
            mouse.x = 99;
            mouse.y = 99;
          };
        const destroy = createBalloonScene(
          host.current!,
          canvas.current!,
          color,
          control,
          mouse,
          update,
          onReady,
        );
        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerdown", down);
        window.addEventListener("pointerup", up);
        document.addEventListener("pointerleave", leave);
        setFallback(false);
        cleanup = () => {
          destroy();
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerdown", down);
          window.removeEventListener("pointerup", up);
          document.removeEventListener("pointerleave", leave);
        };
      } catch {
        if (!disposed) {
          setFallback(true);
          onReady();
        }
      }
    };
    const lost = (e: Event) => {
      e.preventDefault();
      cleanup?.();
      setFallback(true);
      onReady();
    };
    canvas.current?.addEventListener("webglcontextlost", lost);
    const currentCanvas = canvas.current;
    start();
    media.addEventListener("change", start);
    return () => {
      disposed = true;
      cleanup?.();
      media.removeEventListener("change", start);
      currentCanvas?.removeEventListener("webglcontextlost", lost);
    };
  }, [color, onReady]);
  return (
    <>
      <div className="scene-sticky" aria-hidden="true">
        <div className="scene-host" ref={host}>
          <canvas ref={canvas} hidden={fallback} />
          {fallback && (
            <img
              className="scene-fallback"
              src="/images/logo-opt.webp"
              alt=""
            />
          )}
        </div>
      </div>
      <div className="palette" aria-label="Paleta dos balões">
        {palettes.map((p) => (
          <button
            key={p.color}
            style={{ background: p.color }}
            aria-label={p.name}
            aria-pressed={color === p.color}
            onClick={() => setColor(p.color)}
          />
        ))}
        <span>Escolha uma cor</span>
      </div>
    </>
  );
}
