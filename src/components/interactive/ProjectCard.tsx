import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "../../data/projects";
import PhotoImage from "./PhotoImage";

function isMobileMode() {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= 799 ||
    Boolean(
      window.matchMedia?.(
        "(max-width: 799px), (hover: none), (pointer: coarse)",
      ).matches,
    )
  );
}

export default function ProjectCard({
  project,
  onOpen,
  index,
}: {
  project: Project;
  onOpen: () => void;
  index: number;
}) {
  const [after, setAfter] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [mobileZoomed, setMobileZoomed] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const hitRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const lastPointerType = useRef<string>("mouse");
  const lastPointerPos = useRef({ x: 0, y: 0 });

  const pair = project.comparison;
  const activePhoto = pair
    ? after
      ? pair.after
      : pair.before
    : project.photos[0];
  const isZoomed = hovered || mobileZoomed;

  const computeClampOffset = useCallback(() => {
    const el = hitRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const scale = 2;
    const halfExtraW = (rect.width * (scale - 1)) / 2;
    const halfExtraH = (rect.height * (scale - 1)) / 2;

    const left = rect.left - halfExtraW;
    const right = rect.right + halfExtraW;
    const top = rect.top - halfExtraH;
    const bottom = rect.bottom + halfExtraH;

    const pad = 16;
    let tx = 0;
    let ty = 0;

    if (left < pad) {
      tx = pad - left;
    } else if (right > window.innerWidth - pad) {
      tx = window.innerWidth - pad - right;
    }

    if (top < pad) {
      ty = pad - top;
    } else if (bottom > window.innerHeight - pad) {
      ty = window.innerHeight - pad - bottom;
    }

    setOffset({ x: Math.round(tx), y: Math.round(ty) });
  }, []);

  useEffect(() => {
    if (!hovered) return;
    const onScroll = () => {
      const el = hitRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const { x, y } = lastPointerPos.current;
        const inside =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;
        if (!inside) {
          setHovered(false);
          setOffset({ x: 0, y: 0 });
          return;
        }
        computeClampOffset();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hovered, computeClampOffset]);

  useEffect(() => {
    if (!mobileZoomed) return;
    const handleOutside = (e: MouseEvent | PointerEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (target && zoomRef.current && !zoomRef.current.contains(target)) {
        setMobileZoomed(false);
        setOffset({ x: 0, y: 0 });
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileZoomed(false);
        setOffset({ x: 0, y: 0 });
      }
    };
    document.addEventListener("pointerdown", handleOutside, true);
    document.addEventListener("click", handleOutside, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside, true);
      document.removeEventListener("click", handleOutside, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileZoomed]);

  const ratio = activePhoto.height / activePhoto.width;

  return (
    <article
      className={`project-card${isZoomed ? " is-zoomed" : ""}${elevated ? " is-elevated" : ""}`}
    >
      <div className="project-photo">
        <div
          ref={hitRef}
          className="project-image-hit"
          data-testid={`project-image-hit-${project.id}`}
          style={{
            aspectRatio: `${activePhoto.width} / ${activePhoto.height}`,
            maxHeight: `min(100%, calc(46vw * ${ratio.toFixed(4)}))`,
          }}
          onPointerDown={(e) => {
            lastPointerType.current = e.pointerType || "mouse";
          }}
          onMouseEnter={(e) => {
            if (isMobileMode() || lastPointerType.current === "touch") return;
            lastPointerPos.current = { x: e.clientX, y: e.clientY };
            computeClampOffset();
            setHovered(true);
            setElevated(true);
          }}
          onMouseMove={(e) => {
            if (isMobileMode() || lastPointerType.current === "touch") return;
            lastPointerPos.current = { x: e.clientX, y: e.clientY };
            const rect = hitRef.current?.getBoundingClientRect();
            if (rect && rect.width > 0 && rect.height > 0) {
              const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
              if (!inside && hovered) {
                setHovered(false);
                setOffset({ x: 0, y: 0 });
              }
            }
          }}
          onMouseLeave={() => {
            if (isMobileMode() || lastPointerType.current === "touch") return;
            setHovered(false);
            setOffset({ x: 0, y: 0 });
          }}
          onClick={(e) => {
            if (!isMobileMode() && lastPointerType.current !== "touch") return;
            if (!mobileZoomed) {
              e.stopPropagation();
              computeClampOffset();
              setMobileZoomed(true);
              setElevated(true);
            }
          }}
        >
          <div
            ref={zoomRef}
            className={`project-image-zoom${isZoomed ? " is-zoomed" : ""}${mobileZoomed ? " is-mobile-zoomed" : ""}`}
            style={
              {
                "--zoom-tx": `${offset.x}px`,
                "--zoom-ty": `${offset.y}px`,
              } as CSSProperties
            }
            onTransitionEnd={() => {
              if (!isZoomed) setElevated(false);
            }}
          >
            <PhotoImage photo={activePhoto} alt={project.description} />
            {mobileZoomed && (
              <button
                type="button"
                className="project-zoom-close"
                aria-label={`Fechar imagem ampliada: ${project.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileZoomed(false);
                  setOffset({ x: 0, y: 0 });
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        className="project-open"
        onClick={onOpen}
        aria-label={`Abrir galeria: ${project.title}`}
      >
        <div className="project-caption">
          <span className="project-number">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{project.title}</h3>
            <p>{project.category}</p>
          </div>
        </div>
      </button>
      {pair && (
        <button
          className="comparison-toggle"
          aria-pressed={after}
          onClick={() => setAfter(!after)}
        >
          {after ? "Ver antes" : "Ver depois"}
        </button>
      )}
    </article>
  );
}
