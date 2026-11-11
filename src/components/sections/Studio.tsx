import { useEffect, useRef } from "react";
import { brand } from "../../data/content";
import { projects } from "../../data/projects";
import PhotoImage from "../interactive/PhotoImage";
import SplitText from "../ui/SplitText";
import CircularText from "../ui/CircularText";
export function About() {
  return (
    <section id="sobre" className="about section-pad">
      <div className="about-photo">
        <PhotoImage
          photo={projects.find((p) => p.id === "laco-vermelho")!.photos[1]}
          alt="Detalhe da escala de uma instalação de laço vermelho da Arte Bola"
        />
      </div>
      <div>
        <p className="eyebrow" data-reveal>ARTE BOLA / FORTALEZA, CEARÁ</p>
        <SplitText
          tag="h2"
          textAlign="left"
          effect="rise"
          splitType="words, chars"
          delay={25}
          duration={0.9}
        >
          O olhar é criativo.
          <br />
          <em>O fazer é artesanal.</em>
        </SplitText>
        <p data-reveal>
          Desde 1999, transformamos balões em instalações artísticas, cenários e
          experiências visuais marcantes.
        </p>
        <p data-reveal>
          Nosso ponto de partida é a imaginação. Nosso trabalho é encontrar a
          cor, a forma e a proporção que fazem sentido para cada espaço e cada
          celebração.
        </p>
        <span className="about-signature" data-reveal>
          Desde 1999, dando forma à imaginação.
        </span>
      </div>
    </section>
  );
}
export function Process() {
  const gridRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = 0;
    let initialized = false;

    const computeTargetProgress = () => {
      const rect = grid.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const startY = vh * 0.95;
      const endY = window.innerWidth <= 799 ? vh * 0.22 : vh * 0.46;
      const raw = (startY - rect.top) / Math.max(1, startY - endY);
      return Math.max(0, Math.min(1, raw));
    };

    const applyWave = (progress: number) => {
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const start = i * 0.25;
        const duration = 0.5;
        const t = Math.max(0, Math.min(1, (progress - start) / duration));

        // Opacity fades from 30% (0.3) to 100% (1.0) in sync with the wave
        const easeOpacity = 0.5 - 0.5 * Math.cos(Math.PI * t);
        const opacity = 0.3 + 0.7 * easeOpacity;

        // Wave vertical motion: rises from +68px up to wave crest (-22px), then settles at 0px
        const crestAt = 0.62;
        let y = 0;
        let badgeY = 0;
        let badgeScale = 1;

        if (t <= crestAt) {
          const u = t / crestAt;
          const easeOut = Math.sin((u * Math.PI) / 2);
          y = 68 + (-22 - 68) * easeOut;
          badgeY = 20 + (-10 - 20) * easeOut;
          badgeScale = 1 + 0.06 * easeOut;
        } else {
          const u = (t - crestAt) / (1 - crestAt);
          const easeInOut = 0.5 - 0.5 * Math.cos(Math.PI * u);
          y = -22 * (1 - easeInOut);
          badgeY = -10 * (1 - easeInOut);
          badgeScale = 1.06 - 0.06 * easeInOut;
        }

        step.style.opacity = opacity.toFixed(3);
        step.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;

        const badge = step.querySelector<HTMLElement>("span");
        if (badge) {
          badge.style.transform = `translate3d(0, ${badgeY.toFixed(2)}px, 0) scale(${badgeScale.toFixed(3)})`;
        }
      });
    };

    const tick = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.001) {
        currentProgress += diff * 0.14;
        applyWave(currentProgress);
        rafId = requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        applyWave(currentProgress);
        rafId = 0;
      }
    };

    const onScrollOrResize = () => {
      targetProgress = computeTargetProgress();
      if (!initialized) {
        initialized = true;
        currentProgress = targetProgress;
        applyWave(currentProgress);
        return;
      }
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="processo" className="process section-pad">
      <div className="section-heading">
        <p className="eyebrow" data-reveal>DA PRIMEIRA CONVERSA AO GRANDE DIA</p>
        <SplitText
          tag="h2"
          textAlign="left"
          effect="rise"
          splitType="words, chars"
          delay={25}
          duration={0.9}
        >
          Uma ideia sua.
          <br />
          <em>Uma criação nossa.</em>
        </SplitText>
      </div>
      <div ref={gridRef} className="process-grid">
        {[
          [
            "Escutar",
            "Conte o que você imagina: ocasião, espaço, cores e referências.",
          ],
          [
            "Desenhar",
            "Exploramos uma composição que traduza a sua ideia em formas e volumes.",
          ],
          [
            "Dar vida",
            "Cuidamos dos detalhes da montagem para que o cenário encontre o seu lugar.",
          ],
        ].map(([title, text], i) => (
          <article
            key={title}
            ref={(el) => {
              stepsRef.current[i] = el;
            }}
            className="process-step"
            data-process-step
            style={{
              opacity: 0.3,
              transform: "translate3d(0, 68px, 0)",
            }}
          >
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section id="contato" className="final-cta section-pad">
      <p className="eyebrow" data-reveal>A PRÓXIMA HISTÓRIA PODE SER A SUA</p>
      <div className="final-cta-heading-wrap">
        <SplitText
          tag="h2"
          textAlign="left"
          effect="rise"
          splitType="words, chars"
          delay={25}
          duration={0.9}
        >
          Vamos fazer
          <br />
          <em>acontecer?</em>
        </SplitText>
        <a
          className="final-cta-badge"
          href={brand.contact}
          target="_blank"
          rel="noreferrer"
          aria-label="Quero minha Arte Bola"
        >
          <CircularText
            text="Quero minha Arte Bola • "
            onHover="speedUp"
            direction="clockwise"
            spinDuration={20}
            size={180}
            fontSize={13}
            fontWeight={800}
            draggable
            hoverTilt={18}
            className="final-cta-circular"
          >
            <span className="final-cta-badge-arrow" aria-hidden="true">
              ↗
            </span>
          </CircularText>
        </a>
      </div>
      <div data-reveal>
        <p>Traga sua ideia. A gente imagina junto.</p>
        <a
          className="button"
          href={brand.contact}
          target="_blank"
          rel="noreferrer"
        >
          Converse com a Arte Bola ↗
        </a>
      </div>
    </section>
  );
}
