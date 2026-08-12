import { useEffect, useRef } from 'react';
import { gsap, EASE, revealLines, magnetic, isTouch, SplitText } from '../lib/anim';
import './Consultation.css';

const AUDIENCE = [
  'организаторы частных событий',
  'свадебные организаторы',
  'b2b / b2c продюсеры',
  'координаторы',
  'декораторы',
  'режиссёры',
  'креативщики',
  'дизайнеры',
  'творческие специалисты всех областей',
  'участники премий',
];

export default function Consultation() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitKicker = new SplitText(root.current.querySelectorAll('.cns-title-part'), { type: 'chars' });
      gsap.from(splitKicker.chars, {
        yPercent: 120,
        rotationX: -90,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.04,
        ease: 'back.out(1.5)',
        transformOrigin: '50% 100%',
        scrollTrigger: { trigger: '.cns-kicker', start: 'top 85%', once: true },
      });
      revealLines(root.current.querySelector('.cns-desc'), { start: 'top 90%' });

      /* the headline number scales up out of nothing */
      gsap.from('.cns-big', {
        yPercent: 138,
        skewY: 6,
        duration: 1.4,
        ease: EASE,
        scrollTrigger: { trigger: '.cns-big-wrap', start: 'top 85%', once: true },
      });

      /* wardrobe: curtain reveal + inner scale */
      gsap.from('.cns-figure', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.cns-figure', start: 'top 88%', once: true },
      });
      gsap.from('.cns-figure img', {
        scale: 1.35,
        duration: 1.9,
        ease: EASE,
        scrollTrigger: { trigger: '.cns-figure', start: 'top 88%', once: true },
      });

      gsap.from('.cns-aud li', {
        xPercent: 12,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: EASE,
        scrollTrigger: { trigger: '.cns-aud', start: 'top 88%', once: true },
      });

      /* pointer tilt on the object */
      if (!isTouch()) {
        const fig = root.current.querySelector('.cns-figure');
        const rx = gsap.quickTo(fig, 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo(fig, 'rotationY', { duration: 0.8, ease: 'power3' });
        const onMove = (e) => {
          const r = fig.getBoundingClientRect();
          ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 16);
          rx(((e.clientY - (r.top + r.height / 2)) / r.height) * -16);
        };
        const onLeave = () => {
          rx(0);
          ry(0);
        };
        fig.addEventListener('mousemove', onMove);
        fig.addEventListener('mouseleave', onLeave);
        const cleanup = magnetic(root.current.querySelector('.cns-cta'), 0.45, 1.06);
        return () => {
          fig.removeEventListener('mousemove', onMove);
          fig.removeEventListener('mouseleave', onLeave);
          cleanup();
        };
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="consultation section" id="consultation" ref={root} data-theme="paper">
      <div className="sec-head">
        <h2 className="sec-title cns-kicker" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="mask"><div className="cns-title-part cns-title-black">ИНДИВИД</div></div>
          <div className="mask"><div className="cns-title-part cns-title-blue">КОНСУЛЬ</div></div>
        </h2>
        <span className="idx">(05) / Личная работа</span>
      </div>

      <div className="cns-grid">
        <div className="cns-left">
          <div className="cns-left-inner">
          <div className="cns-big-wrap mask">
            <div className="cns-big mask-inner">
              1,5<span>часа</span>
            </div>
          </div>
          <p className="cns-desc u-body">
            Концентрированной пользы, без воды и копипасты. Только практический опыт,
            десятки реализованных событий разных форматов и личный путь участника премий.
          </p>
          <button className="cns-cta" data-cursor="hide">
            <span>Записаться</span>
            <i>→</i>
          </button>
          </div>
        </div>

        <div className="cns-figure" data-speed="0.94">
          <img src="/wardrobe.png" alt="Резной шкаф в пустыне" />
          <span className="cns-figure-cap u-mono">Открываем то, что было закрыто</span>
        </div>

        <div className="cns-aud">
          <h3 className="u-meta">
            Для кого
            <br />
            подходит
            <br />
            эта услуга?
          </h3>
          <ul>
            {AUDIENCE.map((a) => (
              <li key={a}>
                <i />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
