import { brand } from "../../data/content";
export default function Hero() {
  return (
    <>
      <section id="hero" className="hero experience-section">
        <div className="hero-copy reading-zone">
          <div className="reading-veil" aria-hidden="true" />
          <p className="eyebrow">ARTE COM BALÕES * DESDE 1999</p>
          <h1>
            Mais que
            <br />
            balões.
            <br />
            <em>Pura arte.</em>
          </h1>
          <a className="button" href="#projetos">
            Explore nossos projetos <span>↗</span>
          </a>
        </div>
        <div className="hero-note">
          <span>FORTALEZA, CEARÁ</span>
        </div>
      </section>
      <section id="physics" className="experience-section interlude">
        <div className="reading-zone">
          <div className="reading-veil" aria-hidden="true" />
          <p className="eyebrow">01 / MATÉRIA-PRIMA: IMAGINAÇÃO</p>
          <h2>
            É leve.
            <br />
            Mas transforma
            <br />
            <em>tudo ao redor.</em>
          </h2>
          <p>
            Um material simples. Um novo jeito de olhar.
            <br />É assim que uma ideia começa a ocupar o espaço.
          </p>
        </div>
      </section>
      <section id="form" className="experience-section form-interlude">
        <div className="reading-zone">
          <div className="reading-veil" aria-hidden="true" />
          <p className="eyebrow">02 / A IDEIA GANHA FORMA</p>
          <h2>
            Cor que encontra
            <br />
            <em>o seu ritmo.</em>
          </h2>
          <p>
            Experimentar, combinar, surpreender.
            <br />
            Cada composição tem a sua própria personalidade.
          </p>
        </div>
      </section>
      <section id="release" className="experience-section release">
        <div id="release-reading-zone" className="reading-zone">
          <div className="reading-veil reading-veil--center" aria-hidden="true" />
          <p className="eyebrow">03 / AGORA, NO MUNDO REAL</p>
          <h2>
            Imaginar é só
            <br />
            <em>o começo.</em>
          </h2>
          <p>
            A seguir, ideias que saíram do papel.
            <br />E viraram parte de histórias reais.
          </p>
          <a href="#manifesto" className="text-link">
            Veja de perto ↓
          </a>
        </div>
      </section>
    </>
  );
}
