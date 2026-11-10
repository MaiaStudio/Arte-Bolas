import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fs from "node:fs";
import Projects from "../src/components/sections/Projects";
import Services from "../src/components/sections/Services";
import { Process } from "../src/components/sections/Studio";
import Header from "../src/components/layout/Header";
import BalloonScene from "../src/components/interactive/BalloonScene";
import { projects, categories } from "../src/data/projects";
import { brand } from "../src/data/content";
const mockEngine = vi.hoisted(() => ({
  createBalloonScene: vi.fn((..._args: unknown[]) => vi.fn()),
}));
vi.mock("../src/components/interactive/balloonEngine", () => mockEngine);
describe("Acervo real", () => {
  it("cadastra cada original exatamente uma vez, com variantes existentes", () => {
    const photos = projects.flatMap((p) => p.photos);
    const originals = fs
      .readdirSync("public/work")
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    expect(photos).toHaveLength(originals.length);
    expect(new Set(photos.map((p) => p.original)).size).toBe(originals.length);
    for (const p of photos) {
      expect(fs.existsSync("public" + p.src)).toBe(true);
      expect(fs.existsSync("public" + p.full)).toBe(true);
      expect(p.width / p.height).toBeGreaterThan(0);
    }
    expect(projects.find((p) => p.id === "laco-vermelho")!.photos).toHaveLength(
      2,
    );
    expect(projects.every((p) => !p.comparison)).toBe(true);
  });
  it("mostra a contagem real e filtra todas as categorias", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    expect(
      screen.getAllByRole("button", { name: /Abrir galeria/ }),
    ).toHaveLength(projects.length);
    for (const category of categories) {
      await user.click(
        screen.getByRole("button", { name: new RegExp(`^${category}`) }),
      );
      expect(
        screen.getAllByRole("button", { name: /Abrir galeria/ }),
      ).toHaveLength(
        category === "Todos"
          ? projects.length
          : projects.filter((p) => p.category === category).length,
      );
    }
  });
  it("abre, navega pelas duas perspectivas, fecha e restaura o foco", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const opener = screen.getByRole("button", {
      name: /Abrir galeria: Um presente/,
    });
    await user.click(opener);
    expect(screen.getByRole("dialog")).toBeTruthy();
    const first = screen
      .getByRole("img", { name: /Perspectiva 1/ })
      .getAttribute("src");
    await user.click(
      screen.getByRole("button", { name: "Próxima fotografia" }),
    );
    expect(
      screen.getByRole("img", { name: /Perspectiva 2/ }).getAttribute("src"),
    ).not.toBe(first);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
    expect(screen.getByRole("img", { name: /Perspectiva 1/ })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Fechar galeria" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe("");
  });
  it("oferece acesso ao original quando a foto falha", async () => {
    render(<Projects />);
    fireEvent.click(
      screen.getAllByRole("button", { name: /Abrir galeria/ })[0],
    );
    fireEvent.error(screen.getByRole("img", { name: /Perspectiva 1/ }));
    expect(
      screen
        .getByRole("link", { name: /Abrir fotografia original/ })
        .getAttribute("href"),
    ).toBe(projects[0].photos[0].original);
  });
  it("remove o botão 'Ver projeto' e aplica zoom 2x no hover (desktop), desfazendo ao sair da imagem original", () => {
    window.innerWidth = 1440;
    render(<Projects />);
    expect(screen.queryByText(/Ver projeto/i)).toBeNull();
    const hit = screen.getByTestId(`project-image-hit-${projects[0].id}`);
    const zoom = hit.querySelector(".project-image-zoom")!;
    expect(zoom.classList.contains("is-zoomed")).toBe(false);
    fireEvent.mouseEnter(hit, { clientX: 200, clientY: 200 });
    expect(zoom.classList.contains("is-zoomed")).toBe(true);
    expect(
      screen.queryByRole("button", { name: /Fechar imagem ampliada/ }),
    ).toBeNull();
    fireEvent.mouseLeave(hit);
    expect(zoom.classList.contains("is-zoomed")).toBe(false);
  });
  it("no mobile amplia em 2x ao clicar, exibe botão '×' no canto superior direito e fecha ao clicar no '×' ou fora da imagem", () => {
    window.innerWidth = 390;
    render(<Projects />);
    const hit = screen.getByTestId(`project-image-hit-${projects[0].id}`);
    const zoom = hit.querySelector(".project-image-zoom")!;
    fireEvent.click(hit);
    expect(zoom.classList.contains("is-zoomed")).toBe(true);
    expect(zoom.classList.contains("is-mobile-zoomed")).toBe(true);
    const closeBtn = screen.getByRole("button", {
      name: new RegExp(`Fechar imagem ampliada: ${projects[0].title}`),
    });
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
    expect(zoom.classList.contains("is-zoomed")).toBe(false);

    // Reabre e fecha clicando fora da imagem
    fireEvent.click(hit);
    expect(zoom.classList.contains("is-zoomed")).toBe(true);
    fireEvent.pointerDown(document.body);
    expect(zoom.classList.contains("is-zoomed")).toBe(false);
    window.innerWidth = 1024;
  });
  it("anima os 3 passos do Processo em onda sequencial sincronizada com o scroll e opacidade de 30% a 100%", () => {
    window.innerWidth = 1440;
    window.innerHeight = 1000;
    let mockTop = 980; // Abaixo do início (startY = 950)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      () =>
        ({
          top: mockTop,
          bottom: mockTop + 220,
          left: 0,
          right: 1200,
          width: 1200,
          height: 220,
          x: 0,
          y: mockTop,
          toJSON: () => {},
        }) as DOMRect,
    );
    const { container } = render(<Process />);
    const steps = container.querySelectorAll<HTMLElement>(".process-step");
    expect(steps).toHaveLength(3);
    expect(Number(steps[0].style.opacity)).toBeCloseTo(0.3, 2);
    expect(Number(steps[1].style.opacity)).toBeCloseTo(0.3, 2);
    expect(Number(steps[2].style.opacity)).toBeCloseTo(0.3, 2);

    // Quando o grid atinge o ponto final (endY = 460)
    mockTop = 400;
    const { container: doneContainer } = render(<Process />);
    const doneSteps =
      doneContainer.querySelectorAll<HTMLElement>(".process-step");
    expect(Number(doneSteps[0].style.opacity)).toBeCloseTo(1, 2);
    expect(Number(doneSteps[1].style.opacity)).toBeCloseTo(1, 2);
    expect(Number(doneSteps[2].style.opacity)).toBeCloseTo(1, 2);
  });
  it("transiciona perfeitamente as imagens da seção Serviços ao rolar e ao clicar nos passos", async () => {
    window.innerWidth = 1440;
    window.innerHeight = 900;
    const { container } = render(<Services />);
    const images = container.querySelectorAll(".service-photo-stack img");
    expect(images).toHaveLength(3);

    // Clicar no passo 03 deve ativar a 3ª imagem imediatamente
    const step3Link = screen.getByRole("link", { name: "Ideias que crescem em escala." });
    fireEvent.click(step3Link);
    expect(images[2].classList.contains("is-active")).toBe(true);
    expect(images[0].classList.contains("is-active")).toBe(false);
    expect(step3Link.getAttribute("aria-current")).toBe("step");

    // Clicar no passo 01 deve retornar à 1ª imagem
    const step1Link = screen.getByRole("link", { name: "Celebrações com a sua personalidade." });
    fireEvent.click(step1Link);
    expect(images[0].classList.contains("is-active")).toBe(true);
    expect(images[2].classList.contains("is-active")).toBe(false);
    expect(step1Link.getAttribute("aria-current")).toBe("step");
  });
  it("sobrepõe os 3 cards de Serviços no mobile com o scroll na descida e reverte na volta", () => {
    window.innerWidth = 390;
    window.innerHeight = 800;
    let tops = [80, 440, 1160]; // Card 1 fixado em 80px, Card 2 subindo na metade (overlap = 0.5)
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        const idx =
          this.id === "servico-0"
            ? 0
            : this.id === "servico-1"
              ? 1
              : this.id === "servico-2"
                ? 2
                : -1;
        const top = idx >= 0 ? tops[idx] : 0;
        return {
          top,
          bottom: top + 720,
          left: 0,
          right: 390,
          width: 390,
          height: 720,
          x: 0,
          y: top,
          toJSON: () => {},
        } as DOMRect;
      },
    );

    const { container } = render(<Services />);
    const chapters = container.querySelectorAll<HTMLElement>(".service-chapter");
    expect(chapters).toHaveLength(3);
    // Card 1 está sendo sobreposto pelo Card 2 (metade do percurso -> scale ~0.975, opacity ~0.675)
    expect(chapters[0].style.transform).toBe("scale(0.975)");
    expect(Number(chapters[0].style.opacity)).toBeCloseTo(0.675, 2);
    expect(chapters[1].style.transform).toBe("");

    // Na volta (scroll para cima): Card 2 desce de volta para fora da tela (top = 820)
    tops = [80, 820, 1540];
    const { container: revertContainer } = render(<Services />);
    const revertedChapters =
      revertContainer.querySelectorAll<HTMLElement>(".service-chapter");
    expect(revertedChapters[0].style.transform).toBe("");
    expect(revertedChapters[0].style.opacity).toBe("");
    window.innerWidth = 1024;
  });
});
describe("Navegação e cena", () => {
  it("abre e fecha menu com Escape", () => {
    render(<Header />);
    const menu = screen.getByRole("button", { name: /Menu/ });
    fireEvent.click(menu);
    expect(menu.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menu.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(menu);
  });
  it("preserva o contato existente, sem números inventados", () => {
    render(<Header />);
    expect(
      screen.getByRole("link", { name: /Vamos criar/ }).getAttribute("href"),
    ).toBe(brand.contact);
    expect(new URL(brand.contact).protocol).toBe("https:");
  });
  it("troca paleta e descarta a instância anterior", async () => {
    const dispose = vi.fn();
    mockEngine.createBalloonScene.mockReturnValue(dispose);
    render(<BalloonScene onReady={() => {}} />);
    await waitFor(() =>
      expect(mockEngine.createBalloonScene).toHaveBeenCalled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Rosa blush" }));
    await waitFor(() =>
      expect(mockEngine.createBalloonScene.mock.lastCall?.[2]).toBe("#FFC5C2"),
    );
    expect(dispose).toHaveBeenCalled();
    expect(
      screen
        .getByRole("button", { name: "Rosa blush" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
  it("libera conteúdo e mostra fallback com reduced motion", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    const ready = vi.fn();
    const { container } = render(<BalloonScene onReady={ready} />);
    expect(ready).toHaveBeenCalled();
    expect(container.querySelector(".scene-fallback")).not.toBeNull();
  });
  it("libera conteúdo se WebGL falhar", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    mockEngine.createBalloonScene.mockImplementationOnce(() => {
      throw new Error("WebGL unavailable");
    });
    const ready = vi.fn();
    const { container } = render(<BalloonScene onReady={ready} />);
    await waitFor(() => expect(ready).toHaveBeenCalled());
    expect(container.querySelector(".scene-fallback")).not.toBeNull();
  });
});
