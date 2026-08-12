import { useEffect, useRef } from 'react';
import { gsap, EASE, revealLines } from '../lib/anim';
import './Awards.css';

const PRIVOLZHE = [
  ['2018', 'Финалисты', 'Лучшее свадебное агентство'],
  ['2019', 'Победители', 'Лучшее свадебное событие до 800 000 ₽'],
  ['2021', 'Победители', 'Лучшее детское событие'],
  ['2021', 'Финалисты', 'Лучшее частное событие'],
  ['2021', 'Финалисты', 'Лучший свадебный координатор'],
  ['2022', 'Финалисты', 'Лучший координатор'],
  ['2022', 'Финалисты', 'Лучшее свадебное агентство'],
  ['2022', 'Победители', 'Лучший детский праздник'],
  ['2022', 'Победители', 'Лучший свадебный проект свыше 4 000 000 ₽'],
  ['2023', 'Победители', 'Лучшее частное мероприятие'],
  ['2023', 'Финалисты', 'Лучшее корпоративное мероприятие'],
  ['2024', 'Победители', 'Лучший частный проект'],
  ['2025', 'Победители', 'Лучшая творческая съёмка'],
];

const RUSSIA = [
  ['2018', 'Шорт-лист', 'Wedding Awards Россия'],
  ['2022', 'Шорт-лист', 'Wedding Awards Россия'],
];

const JURY = [
  'Wedding Awards Приволжье',
  'Wedding Awards Урал',
  'Wedding Awards Сибирь и Дальний Восток',
  'Wedding Awards Юг',
  'Wedding Awards Россия',
  'Члены жюри Top 100',
];

const STATS = [
  { v: 15, l: 'наград и номинаций', suffix: '' },
  { v: 7, l: 'первых мест', suffix: '' },
  { v: 6, l: 'премий в составе жюри', suffix: '' },
  { v: 2018, l: 'год основания бюро', plain: true },
];

export default function Awards() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Custom 3D animation for glitch parts
      gsap.from('.awd-glitch-part', {
        yPercent: 120,
        rotationX: -90,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        transformOrigin: '50% 100%',
        scrollTrigger: { trigger: '.awd-glitch', start: 'top 85%', once: true },
      });

      /* stat counters */
      gsap.utils.toArray('.awd-stat').forEach((stat) => {
        const el = stat.querySelector('.awd-stat-num');
        const end = Number(el.dataset.value);
        const plain = el.dataset.plain === 'true';
        const obj = { v: plain ? end - 40 : 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: stat, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = plain
              ? Math.round(obj.v)
              : String(Math.round(obj.v)).padStart(2, '0');
          },
        });
        gsap.from(stat, {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1,
          ease: EASE,
          scrollTrigger: { trigger: stat, start: 'top 90%', once: true },
        });
      });

      /* rows wipe in */
      gsap.utils.toArray('.awd-group').forEach((group) => {
        gsap.from(group.querySelectorAll('.awd-row'), {
          yPercent: 55,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.045,
          ease: EASE,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      gsap.from('.awd-flower', {
        scale: 0.6,
        rotation: -25,
        autoAlpha: 0,
        duration: 1.8,
        ease: EASE,
        scrollTrigger: { trigger: '.awd-jury', start: 'top 80%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="awards section" id="awards" ref={root} data-theme="blue">
      <div className="sec-head awd-head">
        <h2 className="sec-title awd-glitch">
          <div className="mask"><span className="awd-glitch-part" data-text="НАГРАДЫ">НАГРАДЫ</span></div>
          <div className="mask"><span className="awd-glitch-part" data-text="И">И</span></div>
          <div className="mask"><span className="awd-glitch-part" data-text="ДОСТИЖЕНИЯ">ДОСТИЖЕНИЯ</span></div>
        </h2>
        <span className="idx">(04) / Профессиональная сфера</span>
      </div>

      <div className="awd-stats">
        {STATS.map((s) => (
          <div className="awd-stat" key={s.l}>
            <span className="awd-stat-num" data-value={s.v} data-plain={String(!!s.plain)}>
              {s.plain ? s.v : '00'}
            </span>
            <span className="awd-stat-label u-mono">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="awd-cols">
        <div className="awd-group">
          <h3 className="awd-group-title u-meta">
            Wedding Awards Приволжье<br />
            <span>Коллекция наград</span>
          </h3>
          <ul>
            {PRIVOLZHE.map(([y, s, t], i) => (
              <li className={`awd-row ${s === 'Победители' ? 'is-win' : ''}`} key={i}>
                <span className="awd-year u-mono">{y}</span>
                <span className="awd-status u-mono">{s}</span>
                <span className="awd-name">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="awd-side">
          <div className="awd-group">
            <h3 className="awd-group-title u-meta">
              Wedding Awards Россия<br />
              <span>Коллекция наград</span>
            </h3>
            <ul>
              {RUSSIA.map(([y, s, t], i) => (
                <li className="awd-row" key={i}>
                  <span className="awd-year u-mono">{y}</span>
                  <span className="awd-status u-mono">{s}</span>
                  <span className="awd-name">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="awd-group awd-jury">
            <h3 className="awd-group-title u-meta">
              Наши регалии<br />
              <span>Организаторы церемонии Wedding Awards Приволжье 2024</span>
            </h3>
            <ul>
              {JURY.map((j) => (
                <li className="awd-row awd-row-jury" key={j}>
                  <span className="awd-name">{j}</span>
                </li>
              ))}
            </ul>
            <img className="awd-flower" src="/flower.png" alt="" data-speed="1.12" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
