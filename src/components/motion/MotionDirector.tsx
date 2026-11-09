import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function MotionDirector({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    gsap.registerPlugin(ScrollTrigger);
    let alive = true;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("#hero .reading-veil", {
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
      gsap.from(".hero-copy > *:not(.reading-veil)", {
        y: 28,
        opacity: 0,
        duration: 0.78,
        stagger: 0.09,
        ease: "expo.out",
      });
      gsap.from([".palette", ".hero-note"], {
        y: 18,
        opacity: 0,
        duration: 0.68,
        stagger: 0.08,
        delay: 0.22,
        ease: "expo.out",
      });

      ["#physics", "#form", "#release"].forEach((selector) => {
        const section = document.querySelector<HTMLElement>(selector);
        if (!section) return;
        const veil = section.querySelector<HTMLElement>(".reading-veil");
        const items = section.querySelectorAll<HTMLElement>(
          ".reading-zone > *:not(.reading-veil)",
        );
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "bottom 18%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        if (veil) {
          tl.fromTo(
            veil,
            { opacity: 0 },
            { opacity: 1, duration: 0.24 },
            0,
          );
        }
        if (items.length) {
          tl.fromTo(
            items,
            { y: 34, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.26 },
            0,
          );
        }
        tl.to({}, { duration: 0.48 });
        if (items.length) {
          tl.to(
            items,
            { y: -26, opacity: 0, stagger: 0.03, duration: 0.26 },
            0.74,
          );
        }
        if (veil) {
          tl.to(veil, { opacity: 0, duration: 0.24 }, 0.76);
        }
      });

      gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .forEach((el) =>
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.75,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );

      gsap.utils
        .toArray<HTMLElement>(".service-chapter")
        .forEach((el) =>
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.72,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );
    });
    mm.add(
      "(min-width: 800px) and (prefers-reduced-motion: no-preference)",
      () => {
        const stage = document.querySelector<HTMLElement>(".manifesto-stage")!,
          track = stage.querySelector<HTMLElement>(".manifesto-track")!;
        const distance = () =>
          Math.max(0, track.scrollWidth - stage.clientWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none" }, 0).fromTo(
          ".manifesto-progress i",
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0,
        );
      },
    );
    const refresh = () => {
      if (alive) ScrollTrigger.refresh();
    };
    refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    const ro = new ResizeObserver(() => {
      if (alive) ScrollTrigger.refresh();
    });
    const grid = document.querySelector(".projects-grid");
    if (grid) ro.observe(grid);
    return () => {
      alive = false;
      window.removeEventListener("load", refresh);
      ro.disconnect();
      mm.revert();
    };
  }, [ready]);
  return null;
}
