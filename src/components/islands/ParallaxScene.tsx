/**
 * POV / parallaxe au curseur.
 * Conteneur en perspective, chaque enfant pivote selon la position de la souris.
 *
 * Paramètres réglables :
 *   MAX_ROTATION — amplitude maximale de rotation en degrés (défaut 8°)
 */
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

const MAX_ROTATION = 8;

interface Props {
  children: ReactNode;
  className?: string;
}

export default function ParallaxScene({ children, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const targetRef    = useRef({ rx: 0, ry: 0 });
  const currentRef   = useRef({ rx: 0, ry: 0 });

  useEffect(() => {
    // skip si reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = containerRef.current;
    const scene = sceneRef.current;
    if (!el || !scene) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  * 2 - 1;
      const y = (e.clientY - rect.top)  / rect.height * 2 - 1;
      targetRef.current = { rx: -y * MAX_ROTATION, ry: x * MAX_ROTATION };
    };

    const onLeave = () => { targetRef.current = { rx: 0, ry: 0 }; };

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      // lerp 0.08 = smooth follow
      c.rx += (t.rx - c.rx) * 0.08;
      c.ry += (t.ry - c.ry) * 0.08;
      scene.style.transform = `rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`parallax-container ${className}`} style={{ perspective: '1000px' }}>
      <div ref={sceneRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
