import { useEffect, useRef } from 'react';
import { gsap, ScrollSmoother, SplitText, EASE, revealLines, magnetic } from '../lib/anim';
import './Footer.css';

export default function Footer() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current.querySelector('.ftr-claim'), { stagger: 0.1, start: 'top 88%' });

      const mark = root.current.querySelector('.ftr-mark');
      SplitText.create(mark, {
        type: 'chars',
        mask: 'chars',
        charsClass: 'ftr-char',
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 138,
            rotation: 5,
            duration: 1.3,
            stagger: 0.06,
            ease: EASE,
            scrollTrigger: { trigger: mark, start: 'top 95%', once: true },
          }),
      });

      gsap.from('.ftr-line', {
        scaleX: 0,
        duration: 1.4,
        ease: EASE,
        scrollTrigger: { trigger: '.ftr-line', start: 'top 95%', once: true },
      });

      gsap.from('.ftr-col', {
        yPercent: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: EASE,
        scrollTrigger: { trigger: '.ftr-cols', start: 'top 92%', once: true },
      });
    }, root);

    const cleanups = Array.from(root.current.querySelectorAll('[data-magnetic]')).map((el) =>
      magnetic(el, 0.4, 1.04)
    );

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const toTop = () => {
    const s = ScrollSmoother.get();
    if (s) s.scrollTo(0, true);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="contact" ref={root} data-theme="blue">
      <div className="ftr-inner">
        <div className="ftr-top">
          <h2 className="ftr-claim">
            О вашем событии
            <br />
            будут слагать легенды
          </h2>

          <a className="ftr-cta" href="mailto:hello@bureau-events.ru" data-magnetic data-cursor="hide">
            <span className="ftr-cta-label">Обсудить событие</span>
            <span className="ftr-cta-arrow">↗</span>
          </a>
        </div>

        <div className="ftr-line" />

        <div className="ftr-cols">
          <div className="ftr-col">
            <span className="ftr-col-label u-mono">Связаться</span>
            <a href="mailto:hello@bureau-events.ru" className="ftr-link">hello@bureau-events.ru</a>
            <a href="tel:+79000000000" className="ftr-link">+7 900 000 00 00</a>
          </div>

          <div className="ftr-col">
            <span className="ftr-col-label u-mono">Соцсети</span>
            <a href="https://t.me/" target="_blank" rel="noreferrer" className="ftr-link">Telegram</a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="ftr-link">Instagram*</a>
            <a href="https://pinterest.com/" target="_blank" rel="noreferrer" className="ftr-link">Pinterest</a>
          </div>

          <div className="ftr-col">
            <span className="ftr-col-label u-mono">География</span>
            <span className="ftr-text">Самара · Самарская область</span>
            <span className="ftr-text">Москва · Санкт-Петербург</span>
            <span className="ftr-text">Приволжье</span>
          </div>

          <div className="ftr-col">
            <span className="ftr-col-label u-mono">Бюро</span>
            <span className="ftr-text">Event-агентство полного цикла</span>
            <span className="ftr-text">Работаем с 2018 года</span>
            <button className="ftr-top-btn" onClick={toTop} data-magnetic>
              Наверх ↑
            </button>
          </div>
        </div>

        <div className="ftr-mark-wrap" aria-hidden="true">
          <h3 className="ftr-mark">Bureau</h3>
        </div>

        <div className="ftr-fine u-mono">
          <span>© {new Date().getFullYear()} BUREAU [БЮРО]. Все права защищены.</span>
          <span>Протагонисты event-сцены</span>
          <span>Сделано с налётом театральности</span>
        </div>
      </div>
    </footer>
  );
}
