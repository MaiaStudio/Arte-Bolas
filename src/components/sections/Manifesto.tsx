import { projects } from "../../data/projects";
import PhotoImage from "../interactive/PhotoImage";
import SplitText from "../ui/SplitText";

export default function Manifesto() {
  const selection = ["540428866", "laco-vermelho", "810659443"].map((id) =>
    projects.find((p) => p.id === id)!,
  );
  return (
    <section id="manifesto" className="manifesto">
      <div className="section-heading">
        <p className="eyebrow" data-reveal>NOSSA FORMA DE VER O MUNDO</p>
        <SplitText
          tag="h2"
          textAlign="left"
          effect="rise"
          splitType="words, chars"
          delay={25}
          duration={0.9}
        >
          O extraordinário
          <br />
          está em <em>dar forma.</em>
        </SplitText>
        <p data-reveal>
          Da delicadeza de um detalhe à presença de uma grande instalação.
          <br />A nossa linguagem é feita de possibilidades.
        </p>
      </div>
      <div className="manifesto-stage">
        <div className="manifesto-track">
          {selection.map((p, i) => (
            <figure key={p.id}>
              <PhotoImage
                photo={p.photos[0]}
                alt={p.description}
                sizes="(max-width: 799px) 88vw, 65vw"
              />
              <figcaption>
                <span>
                  0{i + 1} / {["O detalhe", "A escala", "A energia"][i]}
                </span>
                <span>{p.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="manifesto-progress" aria-hidden="true">
          <i />
        </div>
      </div>
      <p className="manifesto-end">
        Cada espaço, uma possibilidade. Cada projeto, uma nova história.
      </p>
    </section>
  );
}
