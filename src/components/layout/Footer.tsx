import { brand } from "../../data/content";
export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <p>
          Um pouco de ar.
          <br />
          Infinitas possibilidades.
        </p>
        <a href={brand.contact} target="_blank" rel="noreferrer">
          Instagram ↗<small>@artebolabaloes</small>
        </a>
        <a href="#hero">Voltar ao início ↑</a>
      </div>
      <a
        className="footer-logo"
        href="#hero"
        aria-label="Arte Bola — voltar ao início"
      >
        <span>arte</span> <span>bola</span>
        <i aria-hidden="true">✳</i>
      </a>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {brand.name}
        </span>
        <span>
          Desde {brand.since} · {brand.location}
        </span>
        <span>Feito de cor. Feito para sentir.</span>
      </div>
    </footer>
  );
}
