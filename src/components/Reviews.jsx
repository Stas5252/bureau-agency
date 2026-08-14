import { useEffect, useRef } from 'react';
import { gsap, EASE, revealLines } from '../lib/anim';
import './Reviews.css';

const REVIEWS = [
  {
    a: 'Марина',
    r: 'организатор',
    t: 'После консультации я переписала весь сценарный план. BUREAU, и лично Анна, помогли мне увидеть логику, которой не хватало. Клиент сказал, что это самое цельное событие, которое я ему делала.',
  },
  {
    a: 'Артём',
    r: 'декоратор',
    t: 'Я пришёл с одной идеей, а вышел с тремя концептами, каждый из которых можно продавать. Спасибо за вдохновение и за очень честный, профессиональный взгляд со стороны.',
  },
  {
    a: 'Влада',
    r: 'координатор',
    t: 'Анна структурировала мой проект так, будто она внутри моей головы навела порядок. Я впервые почувствовала уверенность.',
  },
  {
    a: 'Дима',
    r: 'участник премий',
    t: 'Я думал, что у меня сильный проект, но он «не звучал». После консультации появилась история, смысл, глубина — и меня наконец заметили. Это был правильный момент и правильный человек.',
  },
];

export default function Reviews() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current.querySelector('.rvw-statement'), { stagger: 0.1, start: 'top 85%' });
      revealLines(root.current.querySelector('.rvw-sub'), { start: 'top 92%' });

      const cards = gsap.utils.toArray('.rvw-card');
      cards.forEach((card) => {
        gsap.from(card, {
          yPercent: 24,
          autoAlpha: 0,
          duration: 0.9,
          ease: EASE,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="reviews section" ref={root} data-theme="ink">
      <div className="rvw-grid">
        <div className="rvw-left">
          <div className="rvw-left-inner">
            <span className="idx u-mono">(06) / Отзывы о консультациях</span>
            <h2 className="rvw-statement">
              Возможно, именно эти 1,5 часа продвинут вас вперёд
            </h2>
            <p className="rvw-sub u-meta">
              О вашем событии
              <br />
              будут слагать легенды
            </p>
          </div>
        </div>

        <div className="rvw-stack">
          {REVIEWS.map((r) => (
            <article className="rvw-card" key={r.a}>
              <span className="rvw-quote" aria-hidden="true">«</span>
              <p className="rvw-text">{r.t}</p>
              <footer className="rvw-foot">
                <span className="rvw-author">{r.a}</span>
                <span className="rvw-role u-mono">{r.r}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
