import { useState } from "react";
import { categories, projects, type Project } from "../../data/projects";
import ProjectCard from "../interactive/ProjectCard";
import ProjectGallery from "../interactive/ProjectGallery";
import SplitText from "../ui/SplitText";

export default function Projects() {
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = projects.filter(
    (p) => category === "Todos" || p.category === category,
  );
  return (
    <section id="projetos" className="projects section-pad">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow" data-reveal>PORTFÓLIO / IDEIAS QUE ACONTECERAM</p>
          <SplitText
            tag="h2"
            textAlign="left"
            effect="rise"
            splitType="words, chars"
            delay={25}
            duration={0.9}
          >
            O que a gente
            <br />
            <em>coloca no mundo.</em>
          </SplitText>
        </div>
        <p data-reveal>
          Fotografias reais. Histórias singulares.
          <br />
          Explore as cores, os detalhes
          <br />e as possibilidades de cada criação.
        </p>
      </div>
      <div className="filters" aria-label="Filtrar projetos">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}{" "}
            <sup>
              {c === "Todos"
                ? projects.length
                : projects.filter((p) => p.category === c).length}
            </sup>
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} projetos exibidos
      </p>
      <div className="projects-grid">
        {visible.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={projects.indexOf(p)}
            onOpen={() => setSelected(p)}
          />
        ))}
      </div>
      {selected && (
        <ProjectGallery
          key={selected.id}
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
