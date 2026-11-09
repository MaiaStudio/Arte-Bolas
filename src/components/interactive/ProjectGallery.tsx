import { useEffect, useRef, useState } from "react";
import type { Project } from "../../data/projects";
export default function ProjectGallery({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const photo = project.photos[index];
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    const el = dialog.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    el.showModal();
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      prior?.focus();
    };
  }, []);
  const go = (delta: number) => {
    setIndex(
      (i) => (i + delta + project.photos.length) % project.photos.length,
    );
    setFailed(false);
  };
  return (
    <dialog
      ref={dialog}
      className="gallery"
      aria-labelledby="gallery-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="gallery-panel">
        <div className="gallery-header">
          <div>
            <p className="eyebrow">{project.category}</p>
            <h2 id="gallery-title">{project.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar galeria">
            Fechar ×
          </button>
        </div>
        <div className="gallery-image">
          {failed ? (
            <p>
              Não foi possível carregar esta imagem.{" "}
              <a href={photo.original}>Abrir fotografia original ↗</a>
            </p>
          ) : (
            <img
              key={photo.id}
              src={photo.full}
              width={photo.width}
              height={photo.height}
              alt={`${project.description} Perspectiva ${index + 1}.`}
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <div className="gallery-controls">
          <button
            disabled={project.photos.length < 2}
            onClick={() => go(-1)}
            aria-label="Fotografia anterior"
          >
            ←
          </button>
          <p aria-live="polite">
            {index + 1} / {project.photos.length}
            <small>{project.description}</small>
          </p>
          <button
            disabled={project.photos.length < 2}
            onClick={() => go(1)}
            aria-label="Próxima fotografia"
          >
            →
          </button>
        </div>
      </div>
    </dialog>
  );
}
