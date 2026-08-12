import { useEffect, useRef } from 'react';
import { gsap, isTouch, reduced } from '../lib/anim';

/**
 * Difference-blend cursor: a dot that tracks 1:1 and a ring that lags.
 * Elements opt into states with data-cursor="view | drag | arrow | hide"
 * and an optional data-cursor-label.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (isTouch() || reduced()) return;
    document.body.classList.add('has-cursor');

    const xD = gsap.quickTo(dot.current, 'x', { duration: 0.09, ease: 'power2' });
    const yD = gsap.quickTo(dot.current, 'y', { duration: 0.09, ease: 'power2' });
    const xR = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' });
    const yR = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' });

    const onMove = (e) => {
      xD(e.clientX);
      yD(e.clientY);
      xR(e.clientX);
      yR(e.clientY);
    };

    const setState = (el) => {
      const type = el?.dataset?.cursor;
      const text = el?.dataset?.cursorLabel;
      if (type === 'hide') {
        gsap.to([dot.current, ring.current], { scale: 0, duration: 0.3, ease: 'power3' });
        return;
      }
      const big = type === 'view' || type === 'drag' || !!text;
      gsap.to(ring.current, {
        scale: big ? 2.1 : el ? 1.5 : 1,
        borderColor: big ? 'rgba(242,223,206,0.9)' : 'rgba(242,223,206,0.55)',
        backgroundColor: big ? 'rgba(242,223,206,0.12)' : 'rgba(242,223,206,0)',
        duration: 0.45,
        ease: 'power3',
      });
      gsap.to(dot.current, { scale: big ? 0 : 1, duration: 0.3, ease: 'power3' });
      if (label.current) {
        label.current.textContent = text || (type === 'view' ? 'смотреть' : type === 'drag' ? 'drag' : '');
        gsap.to(label.current, {
          autoAlpha: label.current.textContent ? 1 : 0,
          scale: label.current.textContent ? 0.5 : 0.4,
          duration: 0.35,
          ease: 'power3',
        });
      }
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor], input, textarea');
      setState(el);
    };
    const onDown = () => gsap.to(ring.current, { scale: '-=0.35', duration: 0.18 });
    const onUp = () => gsap.to(ring.current, { scale: '+=0.35', duration: 0.3 });
    const onLeaveWin = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.25 });
    const onEnterWin = () => gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.25 });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeaveWin);
    document.addEventListener('mouseenter', onEnterWin);

    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeaveWin);
      document.removeEventListener('mouseenter', onEnterWin);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}>
        <span className="cursor-label" ref={label} />
      </div>
    </div>
  );
}
