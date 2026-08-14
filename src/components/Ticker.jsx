import { useEffect, useRef } from 'react';
import { gsap } from '../lib/anim';
import './Ticker.css';

const ROW_A = ['Протагонисты event-сцены', 'Креаторы', 'Новаторы', 'Авторы'];
const ROW_B = ['Wedding Awards', 'Победители', 'Финалисты', 'Члены жюри', 'С 2018 года'];

function Row({ items, reverse, speed }) {
  const track = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(track.current, { xPercent: reverse ? -50 : 0 });
      gsap.to(track.current, {
        xPercent: reverse ? 0 : -50,
        duration: speed,
        ease: 'none',
        repeat: -1,
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
