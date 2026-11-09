import photos from "./photos.generated.json";
export type Photo = (typeof photos)[number];
export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  photos: Photo[];
  comparison?: { before: Photo; after: Photo };
};
// Editorial names describe the visible decor; no inferred client names or dates.
const catalog: Record<
  string,
  { title: string; category: string; description: string; group?: string }
> = {
  "540428866": {
    title: "Verde em estado de festa",
    category: "Celebrações",
    description:
      "Volumes verdes, transparências e detalhes dourados em uma composição intimista.",
  },
  "550833873": {
    title: "Uma entrada em cena",
    category: "Cenografia",
    description:
      "Balões vermelhos e brancos emolduram uma entrada com tapete vermelho.",
  },
  "562207333": {
    title: "Entre rosas e vermelhos",
    category: "Celebrações",
    description:
      "Uma composição orgânica acompanha a arquitetura e recebe os convidados.",
  },
  "591155320": {
    title: "O Natal ganha forma",
    category: "Cenografia",
    description:
      "Colunas verdes e vermelhas e balões dourados integram um cenário natalino.",
  },
  "671247720": {
    title: "Um presente em grande escala",
    category: "Cenografia",
    description:
      "Um laço vermelho esculpido em balões transforma a fachada em presente.",
    group: "laco-vermelho",
  },
  "681596486": {
    title: "Um presente em grande escala",
    category: "Cenografia",
    description:
      "Um laço vermelho esculpido em balões transforma a fachada em presente.",
    group: "laco-vermelho",
  },
  "708436914": {
    title: "A festa entra em campo",
    category: "Celebrações",
    description:
      "Verdes, dourados e referências ao futebol para uma celebração ao ar livre.",
  },
  "793028579": {
    title: "Cor que comunica",
    category: "Marcas",
    description:
      "Uma instalação em roxo e dourado acompanha um espaço de apresentação de produtos.",
  },
  "810659443": {
    title: "Uma jogada de cor",
    category: "Celebrações",
    description:
      "Laranja e preto dão ritmo a um cenário inspirado no basquete.",
  },
};
export const projects: Project[] = Object.values(
  photos.reduce<Record<string, Project>>((all, photo) => {
    const code = photo.id.match(/App_(\d+)/)?.[1] ?? photo.id;
    const item = catalog[code] ?? {
      title: "Novas formas de celebrar",
      category: "Portfólio",
      description: "Composição de balões do acervo Arte Bola.",
    };
    const id = item.group ?? code;
    if (!all[id])
      all[id] = {
        id,
        title: item.title,
        category: item.category,
        description: item.description,
        photos: [],
      };
    all[id].photos.push(photo);
    return all;
  }, {}),
);
export const categories = [
  "Todos",
  ...new Set(projects.map((p) => p.category)),
];
