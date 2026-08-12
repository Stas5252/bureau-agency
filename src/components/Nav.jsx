import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, ScrollSmoother, EASE, EASE_IO, magnetic, reduced } from '../lib/anim';
import './Nav.css';

const LINKS = [
  { id: 'manifesto', label: 'Манифест', num: '01', img: '/arch.png' },
  { id: 'services', label: 'Услуги', num: '02', img: '/key.png' },
  { id: 'process', label: 'Процесс', num: '03', img: '/sculpture.png' },
  { id: 'awards', label: 'Награды', num: '04', img: '/flower.png' },
  { id: 'consultation', label: 'Консультации', num: '05', img: '/wardrobe.png' },
  { id: 'gallery', label: 'Портфолио', num: '06', img: '/wedding.png' },
  { id: 'contact', label: 'Контакты', num: '07', img: '/portrait.png' },
];

function samaraTime() {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Samara',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

function TimeDisplay() {
  const [time, setTime] = useState(samaraTime);
  useEffect(() => {
    const id = setInterval(() => setTime(samaraTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

export default function Nav() {
  const root = useRef(null);
  const menu = useRef(null);
  const preview = useRef(null);
  const [open, setOpen] = useState(false);

  /* hide the bar going down, bring it back going up */
  useEffect(() => {
    /* normalise the panels' start state: CSS percentages land in gsap's `y`
       cache as pixels, which would make yPercent tweens no-ops */
    gsap.set('.menu-panel', { yPercent: -101, y: 0 });

    const ctx = gsap.context(() => {
      const bar = root.current.querySelector('.nav-bar');
      let hidden = false;
      ScrollTrigger.create({
        start: 'top -120',
        end: 'max',
        onUpdate: (self) => {
          if (self.direction === 1 && !hidden) {
            hidden = true;
            gsap.to(bar, { yPercent: -130, duration: 0.55, ease: 'power3.inOut' });
          } else if (self.direction === -1 && hidden) {
            hidden = false;
            gsap.to(bar, { yPercent: 0, duration: 0.55, ease: 'power3.inOut' });
          }
        },
      });
      /* without the loader there is nothing to wait for */
      gsap.from(bar, { yPercent: -130, duration: 1, delay: reduced() ? 0.1 : 2.9, ease: EASE });
    }, root);

    const cleanups = Array.from(root.current.querySelectorAll('[data-magnetic]')).map((el) =>
      magnetic(el, 0.4)
    );
    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  /* menu open / close choreography */
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.paused(open);
    else document.body.style.overflow = open ? 'hidden' : '';
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(el, { pointerEvents: 'auto' });
        const tl = gsap.timeline();
        tl.to('.menu-panel', {
          yPercent: 0,
          duration: 0.95,
          stagger: 0.05,
          ease: EASE_IO,
        })
          .from(
            '.menu-link-inner',
            { yPercent: 140, rotation: 5, duration: 0.9, stagger: 0.06, ease: EASE },
            '-=0.45'
          )
          .from('.menu-foot > *', { yPercent: 120, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: EASE }, '-=0.6');
      } else {
        gsap.to('.menu-panel', {
          yPercent: -101,
          duration: 0.75,
          stagger: { each: 0.04, from: 'end' },
          ease: EASE_IO,
          onComplete: () => gsap.set(el, { pointerEvents: 'none', clearProps: 'pointerEvents' }),
        });
      }
    }, menu);
    return () => ctx.revert();
  }, [open]);

  const go = (id) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    const smoother = ScrollSmoother.get();
    gsap.delayedCall(0.55, () => {
      if (smoother) smoother.scrollTo(target, true, 'top top');
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const hoverLink = (i, e) => {
    const label = e?.currentTarget?.querySelector('.menu-label');
    if (label) {
      gsap.to(label, {
        duration: 0.55,
        ease: 'none',
        scrambleText: {
          text: LINKS[i].label,
          chars: 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ',
          speed: 0.7,
        },
      });
    }
    if (!preview.current) return;
    const imgs = preview.current.querySelectorAll('img');
    gsap.to(imgs, { autoAlpha: 0, duration: 0.25 });
    gsap.to(imgs[i], { autoAlpha: 1, duration: 0.45, ease: EASE });
    gsap.fromTo(
      imgs[i],
      { scale: 1.18, filter: 'blur(14px)' },
      { scale: 1, filter: 'blur(0px)', duration: 0.9, ease: EASE }
    );
  };

  return (
    <div ref={root}>
      <div className="progress-bar" />

      <header className={`nav-bar${open ? ' is-menu' : ''}`}>
        <button className="nav-logo" data-magnetic onClick={() => go('hero')} aria-label="В начало">
          <span className="nav-logo-mark">Bureau</span>
          <span className="nav-logo-tm u-mono">[БЮРО]</span>
        </button>

        <div className="nav-center u-mono">
          <span className="dot" />
          Самара · <TimeDisplay />
        </div>

        <button
          className={`nav-toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          data-magnetic
          aria-expanded={open}
        >
          <span className="nav-toggle-lines">
            <i />
            <i />
          </span>
          <span className="nav-toggle-text u-mono">
            <span>{open ? 'закрыть' : 'меню'}</span>
          </span>
        </button>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} ref={menu}>
        <div className="menu-panels">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="menu-panel" key={i} />
          ))}
        </div>

        <div className="menu-inner">
          <nav className="menu-links">
            {LINKS.map((l, i) => (
              <button
                key={l.id}
                className="menu-link"
                onMouseEnter={(e) => hoverLink(i, e)}
                onClick={() => go(l.id)}
              >
                <span className="mask">
                  <span className="menu-link-inner mask-inner">
                    <span className="menu-num u-mono">{l.num}</span>
                    <span className="menu-label">{l.label}</span>
                  </span>
                </span>
              </button>
            ))}
          </nav>

          <div className="menu-preview" ref={preview} aria-hidden="true">
            {LINKS.map((l) => (
              <img key={l.id} src={l.img} alt="" className="bw" />
            ))}
          </div>

          <div className="menu-foot u-mono">
            <div>
              <div className="menu-foot-label">Связь</div>
              <a href="mailto:hello@bureau-events.ru">hello@bureau-events.ru</a>
              <a href="tel:+79000000000">+7 900 000 00 00</a>
            </div>
            <div>
              <div className="menu-foot-label">Соцсети</div>
              <a href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram*</a>
            </div>
            <div>
              <div className="menu-foot-label">География</div>
              <span>Самара · Москва</span>
              <span>Санкт-Петербург · Приволжье</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
