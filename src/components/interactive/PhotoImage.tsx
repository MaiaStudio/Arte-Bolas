import type { Photo } from "../../data/projects";
export default function PhotoImage({
  photo,
  alt,
  className = "",
  sizes = "(max-width: 799px) 92vw, 50vw",
}: {
  photo: Photo;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <img
      className={className}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
