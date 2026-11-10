import { useEffect } from "react";

export default function MotionDirector({ ready }: { ready: boolean }) {
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    let triggersInitialized = false;

    const initScrollTriggers = async () => {
      if (!alive || triggersInitialized) return;
      triggersInitialized = true;

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!alive) return;

      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section reading veils & copy
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
            tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.24 }, 0);
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

        // General data-reveal items
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

        // Service chapters (desktop)
        if (window.innerWidth >= 800) {
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
        }

        // Manifesto horizontal scroll stage pin
        const stage = document.querySelector<HTMLElement>(".manifesto-stage");
        const track = stage?.querySelector<HTMLElement>(".manifesto-track");
        if (stage && track) {
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
        }

        ScrollTrigger.refresh();
      });
    };

    if (window.location.hash) {
      initScrollTriggers();
    } else {
      const events = [
        "scroll",
        "wheel",
        "touchstart",
        "pointerdown",
        "keydown",
      ] as const;
      events.forEach((evt) =>
        window.addEventListener(evt, initScrollTriggers, {
          once: true,
          passive: true,
        }),
      );

      if (typeof requestIdleCallback === "function") {
        setTimeout(() => {
          requestIdleCallback(() => initScrollTriggers());
        }, 5000);
      } else {
        setTimeout(initScrollTriggers, 2000);
      }
    }

    return () => {
      alive = false;
    };
  }, [ready]);

  return null;
}
