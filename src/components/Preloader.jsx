import { useEffect, useRef, useState } from 'react';
import { gsap, EASE, EASE_IO } from '../lib/anim';
import './Preloader.css';

/* the loader doubles as the asset warm-up: progress is real, not faked */
const ASSETS = [
  './arch.png',
  './key.png',
  './wardrobe.png',
  './book.png',
  './portrait.png',
  './sculpture.png',
  './wedding.png',
  './dinner.png',
  './flower.png',
  './people.png',
];

const WORDS = ['САМАРА', 'МОСКВА', 'САНКТ-ПЕТЕРБУРГ', 'ПРИВОЛЖЬЕ'];

export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  /* keep the callback in a ref so a parent re-render never restarts the loader */
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {


    const state = { loaded: 0, shown: 0 };
    let killed = false;

    ASSETS.forEach((src) => {
      const img = new Image();
      const tick = () => (state.loaded += 1);
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    const ctx = gsap.context(() => {
      /* city ticker */
      const cities = gsap.timeline({ repeat: -1 });
      WORDS.forEach((_, i) => {
        cities.call(() => setWord(i)).to({}, { duration: 0.42 });
      });

      /* the counter chases real load progress, then finishes on its own */
      const counter = gsap.timeline();
      counter.to(state, {
        shown: 100,
        duration: 2.6,
        ease: 'power1.inOut',
        onUpdate: () => {
          const cap = 20 + (state.loaded / ASSETS.length) * 80;
          const v = Math.min(state.shown, Math.max(cap, state.shown * 0.55));
          setCount(Math.round(v));
          setBgIndex(Math.floor(v / 12) % ASSETS.length);
        },
        onComplete: () => setCount(100),
      });

      /* wordmark draws in while loading */
      gsap.from('.pl-mark', {
        yPercent: 130,
        rotation: 6,
        duration: 1.15,
        ease: EASE,
      });
      gsap.from('.pl-sub', { yPercent: 145, duration: 1.2, delay: 0.25, ease: EASE });
      gsap.to('.pl-line-fill', { scaleX: 1, duration: 2.4, ease: 'power1.inOut' });

      /* outro */
      counter.eventCallback('onComplete', () => {
        if (killed) return;
        cities.kill();
        const out = gsap.timeline({
          onComplete: () => {
            done.current?.();
            gsap.set(root.current, { display: 'none' });
          },
        });

        out
          .to('.pl-mark, .pl-sub', {
            yPercent: -145,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power3.in',
          })
          .to('.pl-meta', { autoAlpha: 0, duration: 0.35 }, '<')
          .to(root.current, { yPercent: -100, duration: 1.15, ease: EASE_IO }, '-=0.35')
          .add(() => done.current?.(), '-=0.6');
      });
    }, root);

    return () => {
      killed = true;
      ctx.revert();
    };
  }, []);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-bg">
        {ASSETS.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`pl-bg-img ${i === bgIndex ? 'is-active' : ''}`}
          />
        ))}
        <div className="pl-bg-overlay" />
      </div>

      <div className="pl-inner">
        <div className="pl-center">
          <div className="mask">
            <div className="pl-mark mask-inner awd-glitch">
              <span className="awd-glitch-part" data-text="BUREAU">BUREAU</span>
            </div>
          </div>
          <div className="mask">
            <div className="pl-sub mask-inner">[БЮРО] — EVENT AGENCY</div>
          </div>
        </div>

        <div className="pl-meta pl-meta-l u-mono">
          <span>Организация частных событий</span>
          <span className="pl-city">{WORDS[word]}</span>
        </div>

        <div className="pl-meta pl-meta-r">
          <span className="pl-count">{String(count).padStart(3, '0')}</span>
        </div>

        <div className="pl-line">
          <div className="pl-line-fill" />
        </div>
      </div>
    </div>
  );
}
