import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/anim';
import './Ticker.css';

const ROW_A = ['Протагонисты event-сцены', 'Креаторы', 'Новаторы', 'Авторы'];
const ROW_B = ['Wedding Awards', 'Победители', 'Финалисты', 'Члены жюри', 'С 2018 года'];

function Row({ items, reverse, speed }) {
  const track = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(track.current, { xPercent: reverse ? -50 : 0 });
      const loop = gsap.to(track.current, {
        xPercent: reverse ? 0 : -50,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });

      /* scroll velocity drives speed and direction */
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const v = self.getVelocity();
          /* ignore the noise around a stop so the row does not stutter */
          if (Math.abs(v) < 40) return;
          const dir = v > 0 ? 1 : -1;
          gsap.to(loop, {
            timeScale: (reverse ? -dir : dir) * gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 420),
            duration: 0.6,
            overwrite: true,
          });
        },
      });
    }, track);
    return () => ctx.revert();
  }, [reverse, speed]);

  const content = [...items, ...items, ...items, ...items];

  return (
    <div className="ticker-row">
      <div className="ticker-track" ref={track}>
        {content.map((t, i) => (
          <span className="ticker-item" key={i}>
            {t}
            <i className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Ticker() {
  return (
    <section className="ticker" data-theme="blue" aria-hidden="true">
      <Row items={ROW_A} speed={26} />
      <Row items={ROW_B} speed={34} reverse />
    </section>
  );
}
