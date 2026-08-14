import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE, magnetic, reduced, isTouch } from '../lib/anim';
import './Hero.css';

const STRIP = ['./portrait.png', './wedding.png', './arch.png', './people.png', './sculpture.png', './dinner.png'];

export default function Hero({ started }) {
  const root = useRef(null);
  const played = useRef(false);

  /* --- scroll behaviour: independent of the intro --- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* the strip behind the wordmark drifts forever and reacts to scroll */
      const loop = gsap.to('.hero-strip-track', {
        xPercent: -50,
        duration: 46,
        ease: 'none',
        repeat: -1,
      });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(0, 4, Math.abs(self.getVelocity()) / 600);
          gsap.to(loop, { timeScale: 1 + v, duration: 0.5, overwrite: true });
        },
      });

      if (reduced()) return;

      /* exit: natural parallax scroll into next section */
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
        },
      })
        .to('.hero-mark', { scale: 1.15, yPercent: -8, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('.hero-tag', { yPercent: 120, autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero-meta', { yPercent: (i) => (i % 2 ? 60 : -60), autoAlpha: 0, ease: 'none' }, 0)
        .to('.hero-strip', { yPercent: 18, scale: 1.1, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('.hero-cue', { autoAlpha: 0, duration: 0.15 }, 0);

      /* pointer parallax */
      if (!isTouch()) {
        const markX = gsap.quickTo('.hero-center', 'x', { duration: 1.1, ease: 'power3' });
        const markY = gsap.quickTo('.hero-center', 'y', { duration: 1.1, ease: 'power3' });
        const stripX = gsap.quickTo('.hero-strip', 'x', { duration: 1.6, ease: 'power3' });

        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          markX(nx * 34);
          markY(ny * 26);
          stripX(nx * -60);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  /* --- intro, fired once the loader clears --- */
  useEffect(() => {
    if (!started || played.current) return;
    played.current = true;

    const ctx = gsap.context(() => {
      const mark = root.current.querySelector('.hero-mark');
      const split = SplitText.create(mark, { type: 'chars', mask: 'chars', charsClass: 'mark-char' });

      const tl = gsap.timeline({ defaults: { ease: EASE } });

      tl.from(split.chars, {
        yPercent: 138,
        rotation: 8,
        duration: 1.5,
        stagger: 0.055,
      })
        .from('.hero-tag-inner', { yPercent: 145, duration: 1.1 }, '-=1.05')
        .from(
          '.hero-meta .split-line',
          { yPercent: 138, duration: 1, stagger: 0.05 },
          '-=0.95'
        )
        .from('.hero-strip-item', { scaleY: 0, duration: 1.2, stagger: 0.06, transformOrigin: '50% 100%' }, '-=1.3')
        .from('.hero-badge', { scale: 0, rotation: -140, duration: 1.6, ease: 'elastic.out(1, 0.55)' }, '-=0.9')
        .from('.hero-cue', { autoAlpha: 0, y: 24, duration: 0.8 }, '-=0.8');

      /* badge keeps spinning */
      gsap.to('.hero-badge-spin', { rotation: 360, duration: 24, ease: 'none', repeat: -1 });
    }, root);

    return () => ctx.revert();
  }, [started]);

  /* split the meta paragraphs into masked lines up-front so the intro can use them */
  useEffect(() => {
    const els = root.current.querySelectorAll('.hero-meta p');
    const splits = Array.from(els).map((el) =>
      SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
    );
    const cleanup = magnetic(root.current.querySelector('.hero-badge'), 0.5);
    return () => {
      splits.forEach((s) => s.revert());
      cleanup();
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={root} data-theme="cream">
      <div className="hero-strip" aria-hidden="true">
        <div className="hero-strip-track">
          {[...STRIP, ...STRIP].map((src, i) => (
            <div className="hero-strip-item" key={i}>
              <img src={src} alt="" className="bw" />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-meta hero-meta-tl">
          <p className="u-meta">
            Протагонисты event-сцены с 2018 года.
            <br />
            Креаторы. Новаторы. Авторы.
          </p>
        </div>

        <div className="hero-meta hero-meta-tr">
          <p className="u-meta">
            С успехом организовываем частные события в Самаре и Самарской области,
            Москве, Санкт-Петербурге и Приволжье
          </p>
        </div>



        <div className="hero-center">
          <h1 className="hero-mark">Bureau</h1>
          <div className="hero-tag mask">
            <span className="hero-tag-inner mask-inner">[БЮРО]</span>
          </div>
        </div>

        <div className="hero-meta hero-meta-br">
          <p className="u-meta">
            Специализируемся на организации частных событий с разным бюджетом,
            сложностью и стилем.
          </p>
        </div>
      </div>

      <div className="hero-badge" data-cursor="drag" role="img" aria-label="Путешествие в наши проекты с налётом театральности и волшебства">
        <svg viewBox="0 0 120 120" className="hero-badge-spin">
          <defs>
            <path id="badge-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text className="hero-badge-text">
            <textPath href="#badge-ring" startOffset="0">
              ПУТЕШЕСТВИЕ В НАШИ ПРОЕКТЫ · С НАЛЕТОМ ТЕАТРАЛЬНОСТИ И ВОЛШЕБСТВА ·
            </textPath>
          </text>
        </svg>
        <span className="hero-badge-core" />
      </div>

      <div className="hero-cue u-mono">
        <span>scroll</span>
        <span className="hero-cue-line" />
        <img src='./arrow-blue.png' className="hero-arrow" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}
