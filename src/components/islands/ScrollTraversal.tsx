/**
 * Acte 2 — Effet tunnel auto-play.
 * L'animation se déclenche toute seule à l'arrivée sur la section (IntersectionObserver).
 * 98 images dispersées en désordre, foncent vers le spectateur sur 5 secondes.
 */
import { useEffect, useRef } from 'react';

const EXPONENT       = 1.6;
const TUNNEL_TRAVEL  = 3200;
const MAX_ROT        = 8;
const HERO_FADE_END  = 0.18;
const IMG_FADE_START = 0.82;
const IDLE_AMP       = 10;
const IDLE_SPEED     = 0.00035;

function r(i: number, s: number) {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const N     = 196;
const IMG_W = 200;
const IMG_H = 133;

const SOURCES = [
  '/media/scroll-1.jpg',
  '/media/scroll-2.jpg',
  '/media/scroll-3.jpg',
  '/media/scroll-4.jpg',
  '/media/scroll-5.jpg',
  '/media/scroll-6.jpg',
  '/media/scroll-7.webp',
  '/media/scroll-8.jpg',
];

interface Img {
  src:    string;
  x:      number;
  y:      number;
  startZ: number;
  speed:  number;
  tilt:   number;
  scale:  number;
}

const IMAGES: Img[] = Array.from({ length: N }, (_, i) => {
  const angle  = r(i, 1) * Math.PI * 2;
  const radius = r(i, 2) * 0.75 + 0.25;
  return {
    src:    SOURCES[i % SOURCES.length],
    x:      Math.cos(angle) * radius * 720 + (r(i, 7) - 0.5) * 200,
    y:      Math.sin(angle) * radius * 440 + (r(i, 8) - 0.5) * 130,
    startZ: -(r(i, 3) * 2000 + 350),
    speed:  r(i, 4) * 0.55 + 0.75,
    tilt:   (r(i, 5) - 0.5) * 34,
    scale:  r(i, 6) * 0.70 + 0.65,
  };
});

const PHASES = Array.from({ length: N }, (_, i) => (i * 0.73) % (Math.PI * 2));

export default function ScrollTraversal() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const sceneRef    = useRef<HTMLDivElement>(null);
  const imgsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef       = useRef<HTMLDivElement>(null);
  const manifestRef = useRef<HTMLDivElement>(null);

  const state  = useRef({
    p: 0, ep: 0,
    mx: 0, my: 0, rx: 0, ry: 0,
    t: 0,
    manifestStart: 0,
  });
  const rafRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const scene   = sceneRef.current;
    if (!section || !scene) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouse = (e: MouseEvent) => {
      if (reduced) return;
      state.current.mx = (e.clientX / window.innerWidth)  * 2 - 1;
      state.current.my = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = (ts: number) => {
      const s = state.current;
      s.t = ts;

      // Progression scroll-driven : p = position dans la section
      const rect = section.getBoundingClientRect();
      const scrollableH = section.offsetHeight - window.innerHeight;
      const rawP = scrollableH > 0 ? Math.max(0, Math.min(1, -rect.top / scrollableH)) : 0;
      s.p  = rawP;
      s.ep = Math.pow(rawP, EXPONENT);

      // Cache le manifeste si on remonte significativement
      if (s.ep < 0.95 && s.manifestStart > 0) {
        s.manifestStart = 0;
      }

      s.rx += (-s.my * MAX_ROT - s.rx) * 0.06;
      s.ry += ( s.mx * MAX_ROT - s.ry) * 0.06;

      scene.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;

      if (bgRef.current) {
        bgRef.current.style.opacity = String(Math.max(0, 1 - s.p / HERO_FADE_END));
      }

      imgsRef.current.forEach((el, i) => {
        if (!el) return;
        const img = IMAGES[i];

        const tz = img.startZ + s.ep * TUNNEL_TRAVEL * img.speed;

        const idleS = Math.max(0, 1 - s.ep * 4);
        const idleX = Math.sin(s.t * IDLE_SPEED + PHASES[i]) * IDLE_AMP * idleS;
        const idleY = Math.cos(s.t * IDLE_SPEED * 0.7 + PHASES[i]) * IDLE_AMP * 0.6 * idleS;

        const tx = img.x + s.ry * img.speed * 14 + idleX;
        const ty = img.y - s.rx * img.speed * 14 + idleY;

        const approach = Math.max(0, Math.min(1, (tz - img.startZ) / TUNNEL_TRAVEL));
        const rotZ     = img.tilt * (1 - approach * 0.65);

        const closeness = Math.max(0, (tz + 500) / 500);
        const stretchY  = 1 + closeness * 0.3;

        const alphaClose = tz > -100 ? Math.max(0, -tz / 100) : 1;
        const alphaFade  = s.ep > IMG_FADE_START
          ? 1 - (s.ep - IMG_FADE_START) / (1 - IMG_FADE_START)
          : 1;

        el.style.transform = `translate3d(${tx}px,${ty}px,${tz}px) rotateZ(${rotZ}deg) scaleY(${stretchY}) scale(${img.scale})`;
        el.style.opacity   = String(alphaClose * alphaFade);
      });

      if (s.ep >= 1 && s.manifestStart === 0) {
        s.manifestStart = ts;
      }

      if (manifestRef.current) {
        const MANIFEST_DURATION = 1500;
        const mP = s.manifestStart > 0
          ? Math.min(1, (ts - s.manifestStart) / MANIFEST_DURATION)
          : 0;
        manifestRef.current.style.opacity    = String(mP);
        manifestRef.current.style.transform  = `translateY(${(1 - mP) * 24}px)`;
        manifestRef.current.style.pointerEvents = mP > 0.05 ? 'auto' : 'none';
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={sectionRef} className="traversal-section" id="acte2">

      <div ref={bgRef} className="traversal-bg" aria-hidden="true" />

      <div className="traversal-sticky">
        <div ref={sceneRef} className="traversal-scene">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              ref={el => { imgsRef.current[i] = el; }}
              className="traversal-img-wrap"
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                width={IMG_W}
                height={IMG_H}
              />
            </div>
          ))}
        </div>

        <div ref={manifestRef} className="traversal-manifeste" aria-label="Mes Convictions">
          <p className="tm-p1">
            Dans un monde aussi complexe, on ne peut pas concevoir de solutions
            pour l'humain avec un regard étroit. Élargir sa vision, c'est la condition
            nécessaire pour créer des choses qui ont du sens.
          </p>
          <p className="tm-p2">
            Dans ce contexte, le rôle de l'ingénieur-designer est crucial. Nous vivons
            dans un monde de technologies et d'interfaces, et l'interaction entre l'humain
            et la machine doit être pensée au mieux : depuis le requestionnement de la
            problématique à laquelle l'objet doit répondre, jusqu'à la solution technique
            qui le fait exister — sans jamais perdre de vue celui pour qui il est conçu.
          </p>
        </div>
      </div>

      <style>{`
        .traversal-section {
          position: relative;
          height: 300vh;
        }

        .traversal-bg {
          position: absolute;
          inset: 0;
          background: var(--color-bg);
          z-index: -1;
          pointer-events: none;
          will-change: opacity;
        }

        .traversal-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 650px;
          z-index: 1;
        }

        .traversal-scene {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .traversal-img-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -${IMG_W / 2}px;
          margin-top: -${IMG_H / 2}px;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .traversal-img-wrap img {
          width: ${IMG_W}px;
          height: ${IMG_H}px;
          object-fit: cover;
          display: block;
          border-radius: 2px;
          pointer-events: none;
        }

        .traversal-manifeste {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl) var(--space-lg);
          text-align: center;
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
          z-index: 2;
        }

        .tm-label {
          font-size: var(--text-sm);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-muted);
          margin-bottom: var(--space-lg);
        }

        .tm-p1 {
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          line-height: 1.75;
          color: var(--color-text);
          max-width: 38rem;
          margin-bottom: var(--space-xl);
        }

        .tm-p2 {
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          line-height: 1.75;
          color: var(--color-muted);
          max-width: 38rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .traversal-img-wrap, .traversal-scene { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
