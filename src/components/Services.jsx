import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, ScrollTrigger, EASE, revealLines, isTouch } from '../lib/anim';
import './Services.css';

const SERVICES = [
  {
    t: 'Свадебный сервис',
    d: 'Режиссура чувств, где у любви есть сценография, свет и драматургия.',
    img: '/wedding.png',
  },
  {
    t: 'Громкие дни рождения',
    d: 'Сильные концепции, личные истории и вау-финалы.',
    img: '/dinner.png',
  },
  {
    t: 'Кулуарные события',
    d: 'Камерные ужины, закрытые показы, частные завтраки — когда тишина звучит громче любого шоу.',
    img: '/flower.png',
  },
  {
    t: 'Корпоративные проекты',
    d: 'Культурные события для команд и брендов.',
    img: '/people.png',
  },
  {
    t: 'Федеральные заказчики',
    d: 'Масштаб, логистика, продакшн полного цикла и язык, понятный большому бизнесу.',
    img: '/arch.png',
  },
  {
    t: 'Проекты для кино и медиа',
    d: 'Премьеры, светские события, фестивальная драматургия и работа с индустрией.',
    img: '/portrait.png',
  },
  {
    t: 'Видео-контент',
    d: 'От идеи до финального кадра: сценарий, стиль, съёмка, постпродакшн.',
    img: '/sculpture.png',
  },
];

export default function Services() {
  const root = useRef(null);
  const float = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current.querySelector('.sec-title'), { stagger: 0.1 });
      revealLines(root.current.querySelector('.srv-lead'), { start: 'top 90%' });

      /* rows rise and un-blur one after another */
      gsap.utils.toArray('.srv-row').forEach((row) => {
        gsap.from(row, {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1.15,
          ease: EASE,
          scrollTrigger: { trigger: row, start: 'top 92%', once: true },
        });
        gsap.from(row.querySelector('.srv-rule'), {
          scaleX: 0,
          duration: 1.3,
          ease: EASE,
          scrollTrigger: { trigger: row, start: 'top 92%', once: true },
        });
      });

      /* the key object drifts and turns with the scroll */
      gsap.to('.srv-key', {
        rotation: 26,
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });

      if (isTouch()) return;

      /* floating preview follows the pointer with inertia + velocity skew */
      const el = float.current;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.75, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.75, ease: 'power3' });
      const rTo = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' });
      let last = 0;
      let lastT = 0;

      const onMove = (e) => {
        const now = performance.now();
        const dt = Math.max(now - lastT, 1);
        const vx = (e.clientX - last) / dt;
        last = e.clientX;
        lastT = now;
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-16, 16, vx * 6));
      };
      window.addEventListener('mousemove', onMove, { passive: true });

      const imgs = el.querySelectorAll('img');
      const hideFloat = () =>
        gsap.to(el, { scale: 0.75, autoAlpha: 0, duration: 0.4, ease: 'power3.out' });

      gsap.utils.toArray('.srv-row').forEach((row, i) => {
        row.addEventListener('mouseenter', () => {
          gsap.to(el, { scale: 1, autoAlpha: 1, duration: 0.6, ease: EASE });
          gsap.to(imgs, { autoAlpha: 0, duration: 0.2 });
          gsap.fromTo(
            imgs[i],
            { autoAlpha: 0, scale: 1.3, filter: 'blur(10px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: EASE }
          );
        });
        row.addEventListener('mouseleave', hideFloat);
      });

      /* never let the preview stay stranded when the section scrolls away */
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: hideFloat,
        onLeaveBack: hideFloat,
      });

      return () => window.removeEventListener('mousemove', onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services section" id="services" ref={root} data-theme="cream">
      <div className="sec-head">
        <h2 className="sec-title">
          Спектр <span className="accent">услуг</span>
        </h2>
        <span className="idx">(02) / Что мы делаем</span>
      </div>

      <p className="srv-lead u-body">
        Мы собираем событие как спектакль: смысл, визуальный код, драматургия и команда,
        которая держит ритм от первой встречи до последнего кадра.
      </p>

      <div className="srv-aside" aria-hidden="true">
        <img className="srv-key" src="/key.png" alt="" data-speed="0.86" />
        <img className="srv-pink-suit" src="/pink-suit.png" alt="" data-speed="1.1" />
        <img className="srv-pepper" src="/pepper.png" alt="" data-speed="0.9" />
        <p className="srv-laurel u-meta">Ежегодный победитель премии Wedding Awards</p>
      </div>

      <div className="srv-list">
        {SERVICES.map((s, i) => (
          <article className="srv-row" key={s.t} data-cursor="view">
            <div className="srv-rule" />
            <div className="srv-main">
              <span className="srv-num u-mono">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="srv-title">
                <span className="srv-title-fill">{s.t}</span>
                <span className="srv-title-ghost" aria-hidden="true">{s.t}</span>
              </h3>
              <p className="srv-desc u-body">{s.d}</p>
              <span className="srv-arrow" aria-hidden="true">↗</span>
            </div>
          </article>
        ))}
        <div className="srv-rule" />
      </div>

      {/* portalled to <body> so position:fixed survives the smoother transform */}
      {createPortal(
        <div className="srv-float" ref={float} aria-hidden="true">
          {SERVICES.map((s) => (
            <img key={s.img} src={s.img} alt="" className="bw" />
          ))}
        </div>,
        document.body
      )}
    </section>
  );
}
