import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, ScrollSmoother, reduced } from './lib/anim';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Manifesto from './components/Manifesto';
import Services from './components/Services';
import Process from './components/Process';
import Awards from './components/Awards';
import Consultation from './components/Consultation';
import Benefits from './components/Benefits';
import Reviews from './components/Reviews';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

import './index.css';
import './App.css';

/* Every section declares the palette it wants; the controller cross-fades the
   root variables so the whole page changes skin as you scroll. */
const THEMES = {
  cream: { bg: '#f2dfce', fg: '#0a0a0a', accent: '#1527ce' },
  ink: { bg: '#0a0a0a', fg: '#f2dfce', accent: '#2438ff' },
  blue: { bg: '#1527ce', fg: '#f2dfce', accent: '#f2dfce' },
  paper: { bg: '#eaeaea', fg: '#0a0a0a', accent: '#1527ce' },
};

export default function App() {
  const rootRef = useRef(null);
  const smootherRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const onLoaderDone = useCallback(() => setLoaded(true), []);

  /* ---- smooth scroll + theme choreography ---- */
  useEffect(() => {
    /* Touch devices get plain native scrolling. A smoother there means a fixed
       wrapper whose transform is driven from JS, which always trails the
       compositor during momentum scrolling — that reads as stutter on a phone. */
    const smoother =
      isTouch() || reduced()
        ? null
        : ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 0.6,
            effects: true,
            smoothTouch: false,
            ignoreMobileResize: true,
          });
    smootherRef.current = smoother;
    smoother?.paused(true);

    const ctx = gsap.context(() => {
      const root = document.documentElement;

      gsap.utils.toArray('[data-theme]').forEach((section) => {
        const theme = THEMES[section.dataset.theme];
        if (!theme) return;
        const apply = (t) => {
          root.style.setProperty('--bg', t.bg);
          root.style.setProperty('--fg', t.fg);
          root.style.setProperty('--accent', t.accent);
        };

        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => apply(theme),
          onEnterBack: () => apply(theme),
        });
      });

      /* top progress hairline */
      gsap.to('.progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
    }, rootRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('load', onResize);

    return () => {
      window.removeEventListener('load', onResize);
      ctx.revert();
      smoother?.kill();
    };
  }, []);

  /* ---- lock the page while the loader runs ---- */
  useEffect(() => {
    if (smootherRef.current) smootherRef.current.paused(!loaded);
    else document.body.style.overflow = loaded ? '' : 'hidden';
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  return (
    <div ref={rootRef}>
      <Preloader onDone={onLoaderDone} />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero started={loaded} />
            <Ticker />
            <Manifesto />
            <Services />
            <Process />
            <Awards />
            <Consultation />
            <Benefits />
            <Reviews />
            <Gallery />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}
