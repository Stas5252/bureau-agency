import { useEffect, useRef, useState } from 'react';
import { gsap, SplitText, EASE, reduced, isTouch } from '../lib/anim';
import './Process.css';

const STEPS = [
  { t: 'Идея', d: 'Считываем вас. Не тренды — а ДНК события.' },
  { t: 'Диагностика клиента', d: 'Характер, масштаб, амбиция, бюджет, контекст. Задаём вопросы, которые вам ещё никто не задавал.' },
  { t: 'Концепция', d: 'Собираем смысл. Визуальный код. Драматургию. Событие с внутренним сценарием.' },
  { t: 'Креатив & режиссура', d: 'Структура эмоций и опыт.' },
  { t: 'Дизайн & сет-дизайн', d: 'Пространства, в которых вы никогда не бывали.' },
  { t: 'Продакшн', d: 'Свет. Звук. Видео. Технологии. Команда no stress.' },
  { t: 'Кастинг людей', d: 'Ведущие, артисты, герои вечера. Правильная энергия в кадре и в зале.' },
  { t: 'Контент', d: 'Видео. Подкасты. Смыслы. То, что останется после.' },
  { t: 'Сервис & логистика', d: 'От пригласительного до последнего бокала. Невидимый уровень заботы.' },
  { t: 'День Х', d: 'Режиссура в реальном времени. Мы чувствуем зал — вы живёте момент.' },
  { t: 'Afterlife проекта', d: 'Фото. Фильмы. Подарочные форматы. Событие заканчивается — история остаётся.' },
];

export default function Process() {
  const root = useRef(null);
  const track = useRef(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    let swipeCleanup;
    const ctx = gsap.context(() => {
      /* heading letters drop in, each in its own mask so descenders survive */
      SplitText.create(root.current.querySelector('.prc-head'), {
        type: 'chars',
        mask: 'chars',
        charsClass: 'mark-char',
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 138,
            rotation: 6,
            duration: 1.1,
            stagger: 0.035,
            ease: EASE,
            scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
          }),
      });

      /* the hand-drawn underline writes itself */
      gsap.from('.prc-squiggle path', {
        drawSVG: '0%',
        duration: 1.6,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
      });

      if (reduced()) return;

      const distance = () => track.current.scrollWidth - window.innerWidth * 0.92;

      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setStep(Math.min(STEPS.length, Math.floor(self.progress * STEPS.length) + 1));
            gsap.set('.prc-bar-fill', { scaleX: self.progress });
          },
        },
      });

      /* cards react to their distance from the viewport centre */
      gsap.utils.toArray('.prc-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.25, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 88%',
              end: 'left 46%',
              scrub: true,
            },
          }
        );
        gsap.to(card.querySelector('.prc-num'), {
          yPercent: -22,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      });
    }, root);

    return () => {
      swipeCleanup?.();
      ctx.revert();
    };
  }, []);

  return (
    <section className="process" id="process" ref={root} data-theme="ink">
      <div className="prc-top">
        <h2 className="prc-head">Полный цикл</h2>

        <svg className="prc-squiggle" viewBox="0 0 900 40" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M2 24 C 60 6, 120 38, 190 22 S 320 6, 400 26 S 540 40, 630 18 S 780 4, 898 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="prc-meta u-mono">
          <span>(03) / Как устроена работа</span>
          <span>
            <b>{String(step).padStart(2, '0')}</b> / {STEPS.length}
          </span>
        </div>

        <div className="prc-bar">
          <div className="prc-bar-fill" />
        </div>
      </div>

      <div className="prc-viewport">
        <div className="prc-track" ref={track}>
          <img src="/stapler.png" className="prc-stapler" alt="" aria-hidden="true" />
          <img src="/paketa.png" className="prc-paketa" alt="" aria-hidden="true" />
          <img src="/tape-h.png" className="prc-tape-h" alt="" aria-hidden="true" />
          <img src="/tape-v.png" className="prc-tape-v" alt="" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <article className="prc-card" key={s.t}>
              <div className="prc-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="prc-title">{s.t}</h3>
              <p className="prc-desc u-body">{s.d}</p>
              <span className="prc-mark" aria-hidden="true">◤</span>
            </article>
          ))}
          <article className="prc-card prc-card-end">
            <h3 className="prc-title">
              О вашем событии
              <br />
              будут слагать
              <br />
              <em>легенды</em>
            </h3>
          </article>
        </div>
      </div>
    </section>
  );
}
