import { useEffect, useRef, useState } from 'react';
import { gsap, reduced, isTouch } from '../lib/anim';
import './Manifesto.css';

const SLIDES = [
  { img: './arch.png', a: 'Частные', b: 'события', place: 'Самара', craft: 'Режиссура' },
  { img: './dinner.png', a: 'Свадьбы', b: 'и юбилеи', place: 'Москва', craft: 'Сценография' },
  { img: './sculpture.png', a: 'Корпора', b: 'тивные', place: 'Санкт-Петербург', craft: 'Продакшн' },
  { img: './wedding.png', a: 'Кино', b: 'и медиа', place: 'Приволжье', craft: 'Контент' },
];

export default function Manifesto() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cleanups = [];
    const ctx = gsap.context(() => {
      const media = gsap.utils.toArray('.mf-media');
      const words = gsap.utils.toArray('.mf-words');
      const n = SLIDES.length;

      gsap.set(media.slice(1), { autoAlpha: 0, scale: 1.15 });
      gsap.set(words.slice(1), { autoAlpha: 0 });
      gsap.set(
        words.slice(1).map((w) => w.querySelectorAll('.mf-word-inner')),
        { yPercent: 130, autoAlpha: 0 }
      );

      if (reduced()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: `+=${n * (isTouch() ? 80 : 100)}%`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.floor(self.progress * n));
            setActive(idx);
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(media[i - 1], { autoAlpha: 0, scale: 0.94, duration: 0.75, ease: 'power2.inOut' }, at)
          .to(
            words[i - 1].querySelectorAll('.mf-word-inner'),
            { yPercent: -130, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'power3.in' },
            at
          )
          .to(media[i], { autoAlpha: 1, scale: 1, duration: 0.75, ease: 'power2.inOut' }, at + 0.2)
          .to(words[i], { autoAlpha: 1, duration: 0.1 }, at + 0.2)
          .fromTo(
            words[i].querySelectorAll('.mf-word-inner'),
            { yPercent: 130, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.55, stagger: 0.04, ease: 'power3.out' },
            at + 0.25
          );
      }

      /* the stage drifts under the pointer for depth */
      if (!isTouch()) {
        const px = gsap.quickTo('.mf-stage', 'x', { duration: 1.2, ease: 'power3' });
        const py = gsap.quickTo('.mf-stage', 'y', { duration: 1.2, ease: 'power3' });
        const onMove = (e) => {
          px((e.clientX / window.innerWidth - 0.5) * -28);
          py((e.clientY / window.innerHeight - 0.5) * -18);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        cleanups.push(() => window.removeEventListener('mousemove', onMove));
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section className="manifesto" id="manifesto" ref={root} data-theme="ink">
      <div className="mf-stage">
        {SLIDES.map((s) => (
          <div className="mf-media" key={s.img}>
            <img src={s.img} alt="" className="bw" />
          </div>
        ))}
        <div className="mf-veil" />
      </div>

      <div className="mf-type">
        {SLIDES.map((s) => (
          <div className="mf-words" key={s.a}>
            <div className="mask">
              <div className="mf-word-inner">{s.a}</div>
            </div>
            <div className="mask">
              <div className="mf-word-inner mf-word-b">{s.b}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mf-cols">
        <ul className="mf-col u-mono">
          <li className="mf-col-label">География</li>
          {SLIDES.map((s, i) => (
            <li key={s.place} className={i === active ? 'is-on' : ''}>
              {s.place}
            </li>
          ))}
        </ul>

        <ul className="mf-col mf-col-r u-mono">
          <li className="mf-col-label">Ремесло</li>
          {SLIDES.map((s, i) => (
            <li key={s.craft} className={i === active ? 'is-on' : ''}>
              {s.craft}
            </li>
          ))}
        </ul>
      </div>

      <div className="mf-index u-mono">
        <span>{String(active + 1).padStart(2, '0')}</span>
        <span className="mf-index-track">
          <i style={{ transform: `scaleX(${(active + 1) / SLIDES.length})` }} />
        </span>
        <span>{String(SLIDES.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}
