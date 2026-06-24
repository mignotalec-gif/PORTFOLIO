import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function SonScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Lenis smooth scroll ──────────────────────────────
    const lenis = new Lenis({ lerp: 0.08 });
    lenis.on('scroll', ScrollTrigger.update);
    const lenisRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    // ── Curseur custom (toujours actif) ─────────────────
    const dot = document.getElementById('cursorDot');
    let tickCursor: (() => void) | null = null;
    let onMove: ((e: MouseEvent) => void) | null = null;
    const ac = new AbortController();

    if (dot) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
      document.addEventListener('mousemove', onMove);
      tickCursor = () => {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        gsap.set(dot, { x: cx, y: cy });
      };
      gsap.ticker.add(tickCursor);
      const hoverEls = document.querySelectorAll('a, button, .--magnet');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hovering'), { signal: ac.signal });
        el.addEventListener('mouseleave', () => dot.classList.remove('hovering'), { signal: ac.signal });
      });
    }

    const cleanup = () => {
      lenis.destroy();
      gsap.ticker.remove(lenisRaf);
      if (tickCursor) gsap.ticker.remove(tickCursor);
      if (onMove) document.removeEventListener('mousemove', onMove);
      ac.abort();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

    // Sortie anticipée si reduced motion (curseur reste actif)
    if (prefersReduced) {
      return cleanup;
    }

    // ── 10. Header hide/show ─────────────────────────────
    const header = document.getElementById('sonHeader');
    if (header) {
      let lastScroll = 0;
      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        if (scroll > 100 && scroll > lastScroll) {
          gsap.to(header, { yPercent: -100, duration: 0.4, ease: 'power2.inOut', overwrite: true });
        } else {
          gsap.to(header, { yPercent: 0, duration: 0.4, ease: 'power2.inOut', overwrite: true });
        }
        lastScroll = scroll;
      });
    }

    // ── 1. Hero title — lignes montent du bas ────────────
    const heroTitleInners = document.querySelectorAll<HTMLElement>('#heroTitle .word__inner');
    if (heroTitleInners.length) {
      gsap.from(heroTitleInners, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
      });
    }

    // ── 2. Hero meta spans ────────────────────────────────
    const metaSpans = document.querySelectorAll<HTMLElement>('#heroMeta span');
    if (metaSpans.length) {
      gsap.from(metaSpans, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.6,
      });
    }

    // ── 3. Hero description ───────────────────────────────
    const heroDesc = document.getElementById('heroDesc');
    if (heroDesc) {
      gsap.from(heroDesc, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.5,
      });
    }

    // ── 4. Work-info colonnes ─────────────────────────────
    const workCols = document.querySelectorAll<HTMLElement>('.work-info__col');
    if (workCols.length) {
      gsap.from(workCols, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#workInfo', start: 'top 85%' },
      });
    }

    // ── 5. Texte sections — per-word stagger ─────────────
    document.querySelectorAll<HTMLElement>('.component--text .text__body p').forEach(p => {
      const original = p.innerText;
      p.innerHTML = original
        .split(/\s+/)
        .map(w => `<span class="word">${w}</span>`)
        .join(' ');
      gsap.from(p.querySelectorAll<HTMLElement>('.word'), {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.015,
        scrollTrigger: { trigger: p, start: 'top 85%' },
      });
    });

    // ── 6. Collages — fadeUp ──────────────────────────────
    document.querySelectorAll<HTMLElement>(
      '.component--collage .collage__top, .component--collage .collage__bottom'
    ).forEach(el => {
      if (!el.children.length) return;
      gsap.from(el, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    // ── 7. Sticky items — fadeUp ──────────────────────────
    document.querySelectorAll<HTMLElement>('.sticky__item').forEach(item => {
      gsap.from(item, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%' },
      });
    });

    // ── 8. Image grid — pin + fadeIn + overlay parallax ──
    const imageGrid = document.getElementById('imageGrid');
    if (imageGrid) {
      const pinDuration = () => window.innerHeight * 2.5;

      ScrollTrigger.create({
        trigger: imageGrid,
        start: 'top top',
        end: () => `+=${pinDuration()}`,
        pin: true,
        anticipatePin: 1,
      });

      imageGrid.querySelectorAll<HTMLElement>('.grid__item').forEach(item => {
        gsap.from(item, {
          opacity: 0,
          scale: 0.95,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageGrid,
            start: 'top top',
            end: () => `+=${pinDuration()}`,
            scrub: 1,
          },
        });
      });

      const overlay = imageGrid.querySelector<HTMLElement>('.image-grid__overlay');
      if (overlay) {
        gsap.to(overlay, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: imageGrid,
            start: 'top top',
            end: () => `+=${pinDuration()}`,
            scrub: 1.5,
          },
        });
      }
    }

    // ── 9. Credits — per-word stagger ────────────────────
    const creditsWords = document.querySelectorAll<HTMLElement>('#creditsNames .word');
    if (creditsWords.length) {
      gsap.from(creditsWords, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.025,
        scrollTrigger: { trigger: '#creditsNames', start: 'top 85%' },
      });
    }

    // ── 11. Magnet effect ─────────────────────────────────
    document.querySelectorAll<HTMLElement>('.--magnet').forEach(el => {
      const onMagnetMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.min(Math.max((e.clientX - cx) * 0.15, -20), 20);
        const dy = Math.min(Math.max((e.clientY - cy) * 0.15, -20), 20);
        gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'elastic.out(1,0.4)', overwrite: true });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.4)', overwrite: true });
      };
      el.addEventListener('mousemove', onMagnetMove, { signal: ac.signal });
      el.addEventListener('mouseleave', onLeave, { signal: ac.signal });
    });

    return cleanup;
  }, []);

  return null;
}
