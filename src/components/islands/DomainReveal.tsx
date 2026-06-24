/**
 * Acte 2 — Hover reveal façon Casey.
 * Liste de domaines au centre, hover → image plein écran en fondu.
 * Manifeste apparaît après scroll out de la section.
 */
import { useState, useCallback } from 'react';

interface Domain {
  name: string;
  img: string;
  alt: string;
}

const DOMAINS: Domain[] = [
  { name: 'Art',       img: '/media/img-art-1.jpg',     alt: 'Art — composition picturale' },
  { name: 'Vivant',    img: '/media/img-vivant-1.jpg',  alt: 'Vivant — formes organiques' },
  { name: 'Humain',    img: '/media/img-humain-1.jpg',  alt: 'Humain — portrait en contexte' },
  { name: 'Société',   img: '/media/img-societe-1.jpg', alt: 'Société — espace urbain' },
  { name: 'Technique', img: '/media/img-tech-1.jpg',    alt: 'Technique — schéma, système' },
  { name: 'Design',    img: '/media/img-design-1.jpg',  alt: 'Design — croquis de produit' },
  { name: 'Monde',     img: '/media/img-monde-1.jpg',   alt: 'Monde — vue large' },
];

export default function DomainReveal() {
  const [active, setActive] = useState<number | null>(null);

  const handleEnter = useCallback((i: number) => setActive(i), []);
  const handleLeave = useCallback(() => setActive(null), []);

  return (
    <section className="domain-section" id="acte2" aria-label="Domaines de vision">

      {/* Images plein écran — une par domaine */}
      {DOMAINS.map((d, i) => (
        <div
          key={i}
          className="domain-bg"
          aria-hidden="true"
          style={{ opacity: active === i ? 1 : 0 }}
        >
          <img src={d.img} alt={d.alt} loading="lazy" />
        </div>
      ))}

      {/* Overlay sombre pour lisibilité du texte */}
      <div
        className="domain-overlay"
        aria-hidden="true"
        style={{ opacity: active !== null ? 1 : 0 }}
      />

      {/* Liste des domaines */}
      <div className="domain-list" role="list">
        {DOMAINS.map((d, i) => (
          <div
            key={i}
            role="listitem"
            className={`domain-item ${active === i ? 'is-active' : ''} ${active !== null && active !== i ? 'is-dimmed' : ''}`}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            onFocus={() => handleEnter(i)}
            onBlur={handleLeave}
            tabIndex={0}
            aria-label={d.name}
          >
            {d.name}
          </div>
        ))}
      </div>

      {/* Manifeste — visible sous la liste */}
      <div className="domain-manifeste">
        <p className="domain-manifeste-text">
          Dans un monde aussi complexe, on ne peut pas concevoir de solutions<br/>
          pour l'humain avec un regard étroit. Élargir sa vision,<br/>
          c'est la condition nécessaire pour créer des choses qui ont du sens.
        </p>
        <p className="domain-manifeste-text domain-manifeste-body">
          Dans ce contexte, le rôle de l'ingénieur-designer est crucial.
          Nous vivons dans un monde de technologies et d'interfaces,
          et l'interaction entre l'humain et la machine doit être pensée au mieux :
          depuis le requestionnement de la problématique à laquelle l'objet doit répondre,
          jusqu'à la solution technique qui le fait exister —
          sans jamais perdre de vue celui pour qui il est conçu.
        </p>
        <p className="domain-manifeste-text domain-manifeste-sig">
          Je m'appelle Alec Mignot. En troisième année d'un double cursus ingénieur et designer,
          j'apprends à tenir ces deux exigences à la fois : la rigueur de la machine,
          et le souci de l'humain. Ce site rassemble les objets, les logiciels et les produits
          que je conçois dans cet esprit.
        </p>
      </div>

      <style>{`
        .domain-section {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: var(--space-2xl) var(--space-lg);
        }

        /* Images plein écran */
        .domain-bg {
          position: absolute;
          inset: 0;
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity;
          pointer-events: none;
          z-index: 0;
        }
        .domain-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          /* Léger zoom sur l'image active */
          transform: scale(${1});
          transition: transform 6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .domain-bg[style*="opacity: 1"] img,
        .domain-bg[style*="opacity:1"] img {
          transform: scale(1.04);
        }

        /* Overlay sombre */
        .domain-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }

        /* Liste */
        .domain-list {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .domain-item {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 6vw, 5.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          color: var(--color-bg);
          cursor: default;
          padding: 0.15em 0;
          user-select: none;
          transition:
            opacity 0.3s ease,
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          mix-blend-mode: normal;
        }

        /* Quand aucun hover : texte sombre sur fond clair */
        .domain-list:not(:hover) .domain-item {
          color: var(--color-text);
        }

        /* Hover actif : item principal blanc, bien visible */
        .domain-item.is-active {
          color: #FFFFFF;
          transform: translateX(0.5rem);
        }

        /* Items non-actifs : atténués */
        .domain-item.is-dimmed {
          opacity: 0.25;
          color: #FFFFFF;
        }

        /* Manifeste */
        .domain-manifeste {
          position: relative;
          z-index: 2;
          margin-top: var(--space-2xl);
          text-align: center;
        }

        .domain-manifeste-text {
          font-family: var(--font-serif);
          font-size: clamp(0.95rem, 1.5vw, 1.2rem);
          line-height: 1.8;
          color: var(--color-muted);
          transition: color 0.4s ease;
        }

        /* Quand image active : texte manifeste en blanc */
        .domain-section:has(.domain-item.is-active) .domain-manifeste-text {
          color: rgba(255,255,255,0.6);
        }

        /* Mobile : désactiver hover, afficher images en grille */
        @media (max-width: 768px) {
          .domain-item {
            font-size: clamp(2rem, 10vw, 3.5rem);
          }
          .domain-bg { display: none; }
          .domain-overlay { display: none; }
          .domain-list:not(:hover) .domain-item {
            color: var(--color-text);
          }
        }

        .domain-manifeste-body {
          margin-top: var(--space-lg);
          font-family: var(--font-body);
          font-size: clamp(0.9rem, 1.3vw, 1.05rem);
          color: var(--color-muted);
          max-width: 60ch;
          margin-left: auto;
          margin-right: auto;
        }

        .domain-manifeste-sig {
          margin-top: var(--space-lg);
          font-family: var(--font-body);
          font-size: clamp(0.85rem, 1.2vw, 1rem);
          color: var(--color-muted);
          max-width: 60ch;
          margin-left: auto;
          margin-right: auto;
          font-style: italic;
        }

        .domain-section:has(.domain-item.is-active) .domain-manifeste-body,
        .domain-section:has(.domain-item.is-active) .domain-manifeste-sig {
          color: rgba(255,255,255,0.45);
        }

        @media (prefers-reduced-motion: reduce) {
          .domain-bg, .domain-overlay, .domain-item { transition: none; }
        }
      `}</style>
    </section>
  );
}
