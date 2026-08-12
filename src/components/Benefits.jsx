import { useEffect, useRef } from 'react';
import { gsap, EASE, revealLines } from '../lib/anim';
import './Benefits.css';

const LEFT = [
  'Разбор вашего проекта, события или идеи «под лупой»',
  'Поиск сильной концепции или смыслового ядра — как из хаоса собрать чистый, понятный продукт',
  'Рекомендации по современным форматам, механикам и подаче идеи, от которых событие станет свежее, объёмнее и заметнее',
  'Советы по работе с командой, подрядчиками и таймингами',
  'Актуальные подходы к визуалу, атмосфере, сценографии и драматургии',
  'Новые локации, нестандартные решения и креативный взгляд на привычное',
];

const RIGHT = [
  'Разбор вашей подачи, кейса или проекта',
  'Поиск смыслов, которые действительно выделяют',
  'Помощь в формулировках, структуре и эмоциональной силе истории',
  'Рекомендации по визуальной и содержательной упаковке',
  'Подготовка к защите, презентации, выступлению',
  'Работа с образом, уверенностью, голосом и позицией',
];

export default function Benefits() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current.querySelector('.bnf-title'), { stagger: 0.09 });

      gsap.from('.bnf-arrow path, .bnf-arrow polyline', {
        drawSVG: '0%',
        duration: 1.3,
        stagger: 0.15,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.bnf-arrows', start: 'top 82%', once: true },
      });

      gsap.utils.toArray('.bnf-col').forEach((col, i) => {
        gsap.from(col.querySelectorAll('.bnf-item'), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.07,
          delay: i * 0.1,
          ease: EASE,
          scrollTrigger: { trigger: col, start: 'top 86%', once: true },
        });
        gsap.from(col.querySelector('.bnf-col-title'), {
          yPercent: 60,
          autoAlpha: 0,
          duration: 1,
          ease: EASE,
          scrollTrigger: { trigger: col, start: 'top 90%', once: true },
        });
      });

      gsap.from('.bnf-scribble path', {
        drawSVG: '0%',
        duration: 1.8,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: '.bnf-cols', start: 'top 80%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="benefits section" ref={root} data-theme="paper">
      <h2 className="bnf-title">
        Что вы получите
        <br />
        за эти <span className="accent">1,5 часа</span>
      </h2>

      <div className="bnf-arrows" aria-hidden="true">
        <svg className="bnf-arrow" viewBox="0 0 300 140" fill="none">
          <path
            d="M292 8 C 220 18, 120 34, 44 108"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polyline points="34,74 42,112 80,104" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="bnf-arrow" viewBox="0 0 300 140" fill="none">
          <path
            d="M8 8 C 80 18, 180 34, 256 108"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polyline points="266,74 258,112 220,104" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="bnf-cols">
        <svg className="bnf-scribble" viewBox="0 0 120 300" fill="none" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d={`M4 ${12 + i * 20} C 40 ${4 + i * 20}, 80 ${26 + i * 20}, 116 ${10 + i * 20}`}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div className="bnf-col">
          <h3 className="bnf-col-title u-meta">
            Польза для организаторов
            <br />и творческих специалистов
          </h3>
          <ol>
            {LEFT.map((t, i) => (
              <li className="bnf-item" key={t}>
                <span className="bnf-num u-mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="bnf-text">{t}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bnf-col">
          <h3 className="bnf-col-title u-meta">Польза для участников премий</h3>
          <ol>
            {RIGHT.map((t, i) => (
              <li className="bnf-item" key={t}>
                <span className="bnf-num u-mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="bnf-text">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
