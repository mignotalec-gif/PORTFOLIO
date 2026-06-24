# Design Spec — Le son des matières (Projet 02)

**Date :** 2026-06-24
**Statut :** Approuvé

---

## Objectif

Recréer une page de case study style blit.studio (référence : BMW C3 Partner Convention) pour le projet "Le son des matières". Layout éditorial minimaliste noir/blanc avec scroll-driven animations GSAP.

---

## Design System

| Token | Valeur |
|---|---|
| Police | Archivo (Google Fonts, 400/500/700/900) |
| Background | `#FFFFFF` |
| Texte | `#000000` |
| Accent | `#E8460A` (orange) |
| Gris muted | `#777777` |
| Fond dark sections | `#000000` |

- Curseur custom : point orange 12px, lag lerp 0.12
- Smooth scroll : Lenis (à ajouter via npm)
- Animations : GSAP 3 + ScrollTrigger (déjà installé)
- Style : minimaliste éditorial, typographie massive, beaucoup d'air blanc

---

## Structure des fichiers

```
src/pages/projets/son-des-matieres.astro   ← remplace le .mdx, layout autonome
src/components/islands/SonScroll.tsx        ← React island client:load (GSAP + Lenis)
src/styles/son-des-matieres.css            ← styles spécifiques à la page
```

Le layout `Projet.astro` est bypassé. La page utilise `<Base>` directement.

---

## Structure des sections (11 blocs)

### Section 1 — Hero
- Titre géant H1 : "Le son — des — matières" (3 lignes, font-size clamp 56px→130px, weight 900)
- Métas : année, discipline, matériaux, lieu
- Description : pitch court ~1 phrase
- Work-info bar (barre horizontale en bas) : labels + valeurs (type projet, matériaux, outils, statut)
- Animation entrée : mots qui montent du bas (overflow hidden + translateY)

### Section 2 — Image Collage 1 (--reverse)
- Top : placeholder panoramique 16:9
- Bottom : placeholder ultra-wide 200/47

### Section 3 — Texte intro
- Paragraphe long aligné à droite
- Font 14-16px, line-height 1.7
- Animation : mots qui apparaissent au scroll (opacity + translateY stagger)

### Section 4 — Image Collage 2
- Top : duo d'images côte à côte (aspect 16:9 chacune)
- Bottom : placeholder ultra-wide panoramique

### Section 5 — Image Collage 3 (vidéo ou grande image)
- Full-width, aspect 16:9
- Placeholder sombre

### Section 6 — Text Sticky (section principale)
- Sidebar sticky gauche (~22vw) : 4 paragraphes sur la démarche du projet
- Contenu droite défilant : 6 médias (mix images portrait/paysage + vidéo)
- Items `.--magnet` : micro-animation au hover (translate vers curseur)
- GSAP : `ScrollTrigger` pin la sidebar

### Section 7 — Image Collage 4
- Top : duo d'images 16:9
- Bottom : image plein-largeur 16:9

### Section 8 — Image Collage 5
- Top : une image 16:9
- Bottom : vide

### Section 9 — Texte Dark
- Fond `#000000`, texte `#FFFFFF`
- Même layout que Section 3 (texte aligné à droite)
- 2 paragraphes

### Section 10 — Image Grid (pinnée)
- Fond noir, pinnée par ScrollTrigger (2.5× viewport height)
- Grille CSS 4 colonnes × 3 lignes, 9 médias
- Overlay texte en absolute : stat clé du projet (ex: "8 matières / 1 voix")
- grid-gap 8px

### Section 11 — Crédits
- Label "Ce projet" + liste des contributeurs/outils
- Typography légère, fond blanc

---

## Animations GSAP (SonScroll.tsx)

```
1. Curseur custom : lerp 0.12, point orange 12px, grossit au hover
2. Hero mots : gsap.from(words, { yPercent: 110, stagger: 0.07 }) au load
3. Texte scroll : ScrollTrigger per-word opacity+y animations sur .component--text
4. Sidebar sticky : ScrollTrigger.pin(.sidebar__inner) pendant scroll du .content
5. Image grid pinnée : ScrollTrigger.pin(.component--image-grid) avec scrub: 1.5
6. Magnet items : mousemove → gsap.to(el, { x, y, duration: 0.3 }) au hover
7. Lenis : smooth scroll initialisé avant GSAP, ticker connecté à gsap.ticker
```

---

## Placeholders visuels

Tous les médias = `<div class="media-block">` avec `aspect-ratio` + fond coloré + label `[Photo : description]` en monospace centré. Remplacés par de vraies images/vidéos quand le contenu sera prêt.

---

## Adaptations vs blit.studio original

| Blit original | Portfolio actuel |
|---|---|
| Liens nav : works / studio / raw stuff | Nav du portfolio (Base.astro) |
| Logo "blit." | Pas de logo dans le header |
| CDN GSAP/Lenis | Import npm (GSAP déjà installé, Lenis à ajouter) |
| Cursor `cursor: none` sur body | Scoped à `.son-page` uniquement |
| Contenu BMW | Contenu "Le son des matières" (Arduino, capteurs capacitifs, synthèse) |
| Footer blit. | Footer portfolio ou lien retour simple |

---

## Contraintes

- Pas de Framer Motion
- GSAP déjà dans `package.json` — importer depuis le package, pas CDN
- Lenis doit être ajouté : `npm install lenis`
- La page doit respecter `prefers-reduced-motion`
- Cursor custom scopé à la page (pas global)
