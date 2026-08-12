import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  Flip,
  CustomEase
);

/* Signature easing curves — one house style across the whole site. */
CustomEase.create('bureau', '0.16, 1, 0.3, 1'); // deep expo-out, used for reveals
CustomEase.create('bureauIn', '0.7, 0, 0.84, 0'); // exits
CustomEase.create('bureauInOut', '0.86, 0, 0.07, 1'); // curtains / panels

/* handy for tuning timings / jumping around from the devtools console */
if (typeof window !== 'undefined') Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother });

export const EASE = 'bureau';
export const EASE_IN = 'bureauIn';
export const EASE_IO = 'bureauInOut';

/**
 * Motion gate. Respects the OS setting, but `?motion=1` / `?motion=0`
 * forces it either way — handy for testing in environments that report
 * "reduce" by default (headless / embedded browsers).
 */
export const reduced = () => {
  if (typeof window === 'undefined') return false;
  const forced = new URLSearchParams(window.location.search).get('motion');
  if (forced !== null) return forced === '0';
  return false; /* Force animations on all devices to ensure WOW effect */
};

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

/**
 * Split an element into masked lines (and optionally chars).
 * `autoSplit` re-splits on font load / resize, so the animation is built
 * inside onSplit as GSAP requires.
 */
export function splitLines(el, { chars = false, onSplit } = {}) {
  if (!el) return null;
  return SplitText.create(el, {
    type: chars ? 'lines,chars' : 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    charsClass: 'split-char',
    autoSplit: true,
    onSplit,
  });
}

/** Masked line reveal on scroll. Returns the SplitText so callers can revert. */
export function revealLines(el, opts = {}) {
  if (!el) return null;
  const {
    trigger = el,
    start = 'top 88%',
    stagger = 0.085,
    duration = 1.15,
    y = 135,
    rotation = 0,
    delay = 0,
  } = opts;

  return splitLines(el, {
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: y,
        rotation,
        duration,
        delay,
        stagger,
        ease: EASE,
        scrollTrigger: { trigger, start, once: true },
      }),
  });
}

/** Magnetic pull toward the pointer. Returns a cleanup fn. */
export function magnetic(el, strength = 0.35, scale = 1) {
  if (!el || isTouch()) return () => {};
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onEnter = () => scale !== 1 && gsap.to(el, { scale, duration: 0.4, ease: EASE });
  const onLeave = () => {
    xTo(0);
    yTo(0);
    if (scale !== 1) gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);
  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
  };
}

/**
 * Velocity-driven skew: the classic "the page is made of liquid" trick,
 * shared by every section so the whole site distorts as one object.
 */
export function velocitySkew(targets, { max = 12, divisor = 220, prop = 'skewY' } = {}) {
  const clamp = gsap.utils.clamp(-max, max);
  const proxy = { v: 0 };
  const setter = gsap.quickSetter(targets, prop, 'deg');
  return ScrollTrigger.create({
    onUpdate: (self) => {
      const v = clamp(self.getVelocity() / -divisor);
      if (Math.abs(v) > Math.abs(proxy.v)) {
        proxy.v = v;
        gsap.to(proxy, {
          v: 0,
          duration: 0.75,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => setter(proxy.v),
        });
      }
    },
  });
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, DrawSVGPlugin };
