import { brand } from "../../data/content";
import SplitText from "../ui/SplitText";

export default function Hero() {
  return (
    <>
      <section id="hero" className="hero experience-section">
        <div className="hero-copy reading-zone">
          <div className="reading-veil" aria-hidden="true" />
          <p className="eyebrow">ARTE COM BALÕES * DESDE 1999</p>
          <SplitText
            tag="h1"
            textAlign="left"
            effect="rise"
            splitType="words, chars"
            delay={35}
            duration={1.1}
          >
            Mais que
            <br />
            balões.
            <br />
            <em>Pura arte.</em>
          </SplitText>
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
          <SplitText
            tag="h2"
            textAlign="left"
            effect="rise"
            splitType="words, chars"
            delay={30}
            duration={1.0}
          >
            É leve.
            <br />
            Mas transforma
            <br />
            <em>tudo ao redor.</em>
          </SplitText>
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
          <SplitText
            tag="h2"
            textAlign="left"
            effect="rise"
            splitType="words, chars"
            delay={30}
            duration={1.0}
          >
            Cor que encontra
            <br />
            <em>o seu ritmo.</em>
          </SplitText>
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
          <SplitText
            tag="h2"
            textAlign="center"
            effect="rise"
            splitType="words, chars"
            delay={30}
            duration={1.0}
          >
            Imaginar é só
            <br />
            <em>o começo.</em>
          </SplitText>
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
