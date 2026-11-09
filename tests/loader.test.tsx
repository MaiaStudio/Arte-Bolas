import { afterEach, describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
vi.mock("../src/components/interactive/BalloonScene", () => ({
  default: () => null,
}));
vi.mock("../src/components/interactive/BalloonCursor", () => ({
  default: () => null,
}));
vi.mock("../src/components/motion/MotionDirector", () => ({
  default: () => null,
}));
vi.mock("../src/components/sections/Services", () => ({ default: () => null }));
import App from "../src/App";
afterEach(() => vi.useRealTimers());
describe("Liberação da introdução", () => {
  it("libera após 2,2 segundos mesmo sem resposta da cena", () => {
    vi.useFakeTimers();
    render(<App />);
    expect(
      screen.getByRole("button", { name: /Pular introdução/ }),
    ).toBeTruthy();
    act(() => vi.advanceTimersByTime(2200));
    expect(
      screen.queryByRole("button", { name: /Pular introdução/ }),
    ).toBeNull();
    expect(screen.getByRole("heading", { name: /Mais que/ })).toBeTruthy();
  });
  it("permite pular imediatamente", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Pular introdução/ }));
    expect(
      screen.queryByRole("button", { name: /Pular introdução/ }),
    ).toBeNull();
  });
  it("não mantém a abertura com movimento reduzido", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    render(<App />);
    expect(
      screen.queryByRole("button", { name: /Pular introdução/ }),
    ).toBeNull();
  });
});
