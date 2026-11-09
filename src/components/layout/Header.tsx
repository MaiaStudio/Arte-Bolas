import { useEffect, useRef, useState } from "react";
import { brand, navigation } from "../../data/content";
export default function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab" && innerWidth < 800) {
        const links = Array.from(nav.current!.querySelectorAll("a"));
        const first = links[0],
          last = links.at(-1);
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          button.current?.focus();
        } else if (e.shiftKey && document.activeElement === button.current) {
          e.preventDefault();
          last?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          button.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [open]);
  return (
    <header className="header">
      <a className="wordmark" href="#hero" aria-label="Arte Bola — início">
        arte bola<span>balões & imaginação</span>
      </a>
      <button
        ref={button}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Fechar −" : "Menu +"}
      </button>
      <nav
        ref={nav}
        id="navigation"
        className={open ? "open" : ""}
        aria-label="Principal"
      >
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a
          className="nav-contact"
          href={brand.contact}
          target="_blank"
          rel="noreferrer"
        >
          Vamos criar ↗
        </a>
      </nav>
    </header>
  );
}
