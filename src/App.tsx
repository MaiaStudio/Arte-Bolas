import { useCallback, useEffect, useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero";
import Manifesto from "./components/sections/Manifesto";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import { About, Process, FinalCTA } from "./components/sections/Studio";
import BalloonScene from "./components/interactive/BalloonScene";
import BalloonCursor from "./components/interactive/BalloonCursor";
import MotionDirector from "./components/motion/MotionDirector";
export default function App() {
  const [ready, setReady] = useState(false);
  const release = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      release();
      return;
    }
    const timeout = setTimeout(release, 2200);
    return () => clearTimeout(timeout);
  }, [release]);
  return (
    <>
      <a className="skip-link" href="#projetos">
        Ir para os projetos
      </a>
      <Header />
      <main>
        <div id="experience">
          <BalloonScene onReady={release} />
          <Hero />
        </div>
        <Manifesto />
        <Projects />
        <Services />
        <About />
        <Process />
        <FinalCTA />
      </main>
      <Footer />
      <BalloonCursor />
      <MotionDirector ready={ready} />
      {!ready && (
        <div className="loader" role="status">
          <span>
            arte bola<i>✳</i>
          </span>
          <p>Dando forma à imaginação.</p>
          <button onClick={release}>Pular introdução →</button>
        </div>
      )}
    </>
  );
}
