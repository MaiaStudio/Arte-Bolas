import { useEffect, useRef, useState } from "react";
import { services, brand } from "../../data/content";
import { projects } from "../../data/projects";
import PhotoImage from "../interactive/PhotoImage";

const photos = services.map(
  (s) => projects.find((p) => p.id === s.project)!.photos[0],
);

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      if (!root.current) return;
      if (typeof window !== "undefined" && window.innerWidth < 800) return;

      const chapters = Array.from(
        root.current.querySelectorAll<HTMLElement>(".service-chapter"),
      );
      if (!chapters.length) return;

      const vh = window.innerHeight || 800;
      const targetLine = vh * 0.52;

      let next = 0;
      chapters.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;
        if (top <= targetLine) {
          next = i;
        }
      });

      // Se o último capítulo já estiver confortável no campo de visão (<= 68% da tela),
      // ativa o 3° passo garantindo que nunca fique travado no anterior.
      const lastChapter = chapters[chapters.length - 1];
      if (lastChapter) {
        const lastTop = lastChapter.getBoundingClientRect().top;
        if (lastTop <= vh * 0.68) {
          next = chapters.length - 1;
        }
      }

      setActive((prev) => (prev !== next ? next : prev));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={root} id="servicos" className="services section-pad">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">O QUE PODEMOS CRIAR JUNTOS</p>
        <h2>
          Seu universo.
          <br />
          <em>Novas possibilidades.</em>
        </h2>
      </div>
      <div className="service-story">
        <div className="service-visual">
          <div className="service-photo-stack">
            {photos.map((photo, i) => (
              <img
                key={photo.id}
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="48vw"
                width={photo.width}
                height={photo.height}
                alt={services[i].title}
                aria-hidden={active !== i}
                className={active === i ? "is-active" : ""}
                loading="eager"
                decoding="async"
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.getAttribute("src") !== photo.original) {
                    image.removeAttribute("srcset");
                    image.src = photo.original;
                  }
                }}
              />
            ))}
          </div>
          <nav className="service-progress" aria-label="Etapas dos serviços">
            {services.map((s, i) => (
              <a
                key={s.project}
                href={`#servico-${i}`}
                aria-label={s.title}
                aria-current={active === i ? "step" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(i);
                  const target = root.current?.querySelector<HTMLElement>(
                    `#servico-${i}`,
                  );
                  if (target) {
                    target.scrollIntoView?.({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
              >
                <span>0{i + 1}</span>
                <i />
              </a>
            ))}
          </nav>
        </div>
        <div>
          {services.map((s, i) => (
            <article
              className="service-chapter"
              id={`servico-${i}`}
              key={s.project}
            >
              <PhotoImage
                className="service-mobile-photo"
                photo={photos[i]}
                alt={s.title}
              />
              <p className="eyebrow">
                0{i + 1} / {["CELEBRAÇÕES", "MARCAS", "CENOGRAFIA"][i]}
              </p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a
                className="text-link"
                href={brand.contact}
                target="_blank"
                rel="noreferrer"
              >
                Vamos imaginar seu projeto ↗
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
