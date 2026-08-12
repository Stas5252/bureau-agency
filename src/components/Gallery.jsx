import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, Flip, ScrollSmoother, EASE, revealLines, velocitySkew, reduced, SplitText } from '../lib/anim';
import './Gallery.css';

const SHOTS = [
  { src: '/flower.png', c: 'Флористика · деталь', span: 'col-4' },
  { src: '/dinner.png', c: 'Ужин на 40 персон · закат', span: 'col-4' },
  { src: '/wardrobe.png', c: 'Объект · портал', span: 'col-4' },
  
  { src: '/people.png', c: 'Первый танец', span: 'col-12' },
  
  { src: '/portrait.png', c: 'Портрет гостя · вечер премии', span: 'col-12' },
  
  { src: '/wedding.png', c: 'Свадебная церемония', span: 'col-6' },
  { src: '/arch.png', c: 'Сет-дизайн · пустынная арка', span: 'col-6' },
];

export default function Gallery() {
  const root = useRef(null);
  const lbRef = useRef(null);
  const lbImg = useRef(null);
  const originRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const splitTitle = new SplitText(root.current.querySelectorAll('.gal-title-part'), { type: 'chars' });
      gsap.from(splitTitle.chars, {
        yPercent: 120,
        rotationX: -90,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.04,
        ease: 'back.out(1.5)',
        transformOrigin: '50% 100%',
        scrollTrigger: { trigger: '.gal-title-split', start: 'top 85%', once: true },
      });

      gsap.utils.toArray('.gal-item').forEach((item) => {
        gsap.from(item, {
          yPercent: 30,
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: item, start: 'top 96%', once: true },
        });
        gsap.from(item.querySelector('img'), {
          scale: 1.3,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 96%', once: true },
        });
      });

      /* infinite scrolling marquee */
      gsap.to('.gal-word-inner', {
        xPercent: -50,
        ease: 'none',
        duration: 20,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const openAt = useCallback((i, el) => {
    originRef.current = el;
    setIndex(i);
    setOpen(true);

    const box = lbRef.current;
    const img = lbImg.current;
    img.src = SHOTS[i].src;
    gsap.set(box, { autoAlpha: 1, pointerEvents: 'auto' });
    gsap.set('.lb-shade', { autoAlpha: 0 });
    gsap.to('.lb-shade', { autoAlpha: 1, duration: 0.5, ease: 'power2.out' });

    if (reduced()) return;
    const target = Flip.getState(img);
    Flip.fit(img, el, { scale: true });
    Flip.to(target, { duration: 0.85, ease: 'power3.inOut', scale: true });
    gsap.from('.lb-bar', { yPercent: 120, autoAlpha: 0, duration: 0.7, delay: 0.25, ease: EASE });
  }, []);

  const close = useCallback(() => {
    const img = lbImg.current;
    const box = lbRef.current;
    const done = () => {
      gsap.set(box, { autoAlpha: 0, pointerEvents: 'none' });
      gsap.set(img, { clearProps: 'all' });
      setOpen(false);
    };
    gsap.to('.lb-bar', { yPercent: 120, autoAlpha: 0, duration: 0.35 });
    gsap.to('.lb-shade', { autoAlpha: 0, duration: 0.5, delay: 0.15 });
    if (originRef.current && !reduced()) {
      Flip.fit(img, originRef.current, {
        scale: true,
        duration: 0.65,
        ease: 'power3.inOut',
        onComplete: done,
      });
    } else done();
  }, []);

  const step = useCallback(
    (dir) => {
      const next = (index + dir + SHOTS.length) % SHOTS.length;
      setIndex(next);
      gsap.to(lbImg.current, {
        autoAlpha: 0,
        duration: 0.22,
        onComplete: () => {
          lbImg.current.src = SHOTS[next].src;
          gsap.to(lbImg.current, { autoAlpha: 1, duration: 0.4 });
        },
      });
      originRef.current = document.querySelector(`.gal-item[data-i="${next}"] img`) || originRef.current;
    },
    [index]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.paused(true);
    else document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      if (smoother) smoother.paused(false);
      else document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <section className="gallery" id="gallery" ref={root} data-theme="ink">
      <div className="gal-head section">
        <div className="sec-head">
          <h2 className="sec-title gal-title-split" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="mask"><div className="gal-title-part gal-title-cream">ПОРТ</div></div>
            <div className="mask"><div className="gal-title-part gal-title-blue">ФОЛИО</div></div>
          </h2>
          <span className="idx">(07) / Избранные кадры</span>
        </div>
      </div>

      <div className="gal-word" aria-hidden="true">
        <div className="gal-word-inner">
          события · как искусство · события · как искусство · события · как искусство · события · как искусство ·
        </div>
      </div>

      <img src="/shust.png" className="gal-shust" alt="" aria-hidden="true" data-speed="1.1" />

      <div className="gal-grid">
        {SHOTS.map((shot, i) => (
          <button
            className={`gal-item ${shot.span}`}
            key={`${shot.src}-${i}`}
            data-i={i}
            data-cursor="view"
            onClick={(e) => openAt(i, e.currentTarget.querySelector('img'))}
          >
            <img src={shot.src} alt={shot.c} className="bw" loading="lazy" />
            <span className="gal-cap u-mono">{shot.c}</span>
          </button>
        ))}
      </div>

      {/* lightbox lives on <body>: position:fixed breaks inside the smoother's
          transformed content */}
      {createPortal(
        <div className="lb" ref={lbRef} onClick={close}>
          <div className="lb-shade" />
          <img className="lb-img" ref={lbImg} alt="" />
          <div className="lb-bar u-mono" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => step(-1)} aria-label="Предыдущий">←</button>
            <span>
              {String(index + 1).padStart(2, '0')} / {String(SHOTS.length).padStart(2, '0')}
            </span>
            <span className="lb-cap">{SHOTS[index].c}</span>
            <button onClick={() => step(1)} aria-label="Следующий">→</button>
            <button onClick={close} aria-label="Закрыть">✕</button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
