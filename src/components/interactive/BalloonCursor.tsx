import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function BalloonCursor() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    const mm = gsap.matchMedia();
    mm.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" }),
          y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const target = e.target as HTMLElement;
          x(e.clientX + 18);
          y(e.clientY + 18);
          el.style.opacity = target.closest("input,textarea,select,dialog")
            ? "0"
            : "1";
          el.dataset.interactive = String(
            !!target.closest("button,a,.project-image-hit"),
          );
        };
        const leave = () => {
          el.style.opacity = "0";
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("pointerleave", leave);
        return () => {
          x.tween.kill();
          y.tween.kill();
          el.style.opacity = "0";
          window.removeEventListener("pointermove", move);
          document.removeEventListener("pointerleave", leave);
        };
      },
    );
    return () => mm.revert();
  }, []);
  return <div ref={root} className="balloon-cursor" aria-hidden="true" />;
}
