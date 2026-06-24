# Le son des matières — Page Case Study

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le `.mdx` placeholder du Projet 02 par une page de case study éditoriale style blit.studio — fond blanc, Archivo, 11 sections, animations GSAP + scroll Lenis.

**Architecture:** Page Astro standalone (sans `Base.astro` pour éviter que `tokens.css` écrase le fond blanc). CSS importé en frontmatter. Toute l'interactivité GSAP + Lenis dans un React island `SonScroll.tsx` chargé `client:load`. Le titre hero est pré-wrappé en HTML pour éviter les conflits avec les `<br>` lors de l'animation.

**Tech Stack:** Astro 6, React 19, GSAP 3.15 (déjà installé), Lenis 1.x (à installer), Archivo via Google Fonts.

## Global Constraints

- Couleurs : `#000` / `#fff` / `#E8460A` (orange) / `#777` (gray) — aucune autre
- Police : Archivo 400/500/700/900 uniquement (Google Fonts)
- `cursor: none` sur `body` — scopé à cette page seulement (page standalone)
- `prefers-reduced-motion` : sauter toutes les animations GSAP, garder le contenu visible
- GSAP importé depuis npm, jamais depuis CDN
- Lenis importé depuis npm (`lenis` package)
- Tous les médias sont des placeholders : `<div class="placeholder">` avec `aspect-ratio` + couleur + `<span>` label

---

### Task 1 : Installer Lenis et supprimer l'ancien .mdx

**Files:**
- Modify: `package.json` (via npm)
- Delete: `src/pages/projets/son-des-matieres.mdx`

- [ ] **Step 1 : Installer Lenis**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
npm install lenis
```

Expected: `added 1 package`, pas d'erreur.

- [ ] **Step 2 : Supprimer l'ancien .mdx**

```bash
rm "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio/src/pages/projets/son-des-matieres.mdx"
```

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
git add package.json package-lock.json
git commit -m "deps: add lenis for smooth scroll on son-des-matieres"
```

---

### Task 2 : Créer le CSS

**Files:**
- Create: `src/styles/son-des-matieres.css`

**Interfaces:**
- Produces: toutes les classes CSS utilisées par `son-des-matieres.astro` et animées par `SonScroll.tsx`

- [ ] **Step 1 : Créer `src/styles/son-des-matieres.css`**

```css
/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: auto; }
body {
  font-family: 'Archivo', Helvetica, Arial, sans-serif;
  background: #fff; color: #000;
  cursor: none; overflow-x: hidden;
}
img, video { display: block; width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* ── VARIABLES ── */
:root {
  --black: #000;
  --white: #fff;
  --orange: #E8460A;
  --gray: #777;
  --gap: clamp(4px, 0.4vw, 8px);
  --px: clamp(16px, 2.5vw, 30px);
}

/* ── CURSEUR ── */
.cursor__dot {
  position: fixed; top: 0; left: 0;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--orange);
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width .25s, height .25s;
  will-change: transform;
}
.cursor__dot.hovering { width: 28px; height: 28px; }

/* ── HEADER ── */
.son-header {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(4px);
}
.son-header__inner {
  display: flex; align-items: center;
  padding: 18px var(--px);
}
.son-header__back {
  font-size: clamp(12px, 1vw, 14px);
  letter-spacing: -0.01em;
  display: flex; align-items: center; gap: 8px;
  color: var(--black);
  transition: opacity .2s;
  margin-right: auto;
}
.son-header__back:hover { opacity: .4; }
.son-header__title {
  font-size: clamp(11px, 0.85vw, 13px);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--gray);
}
.son-header__dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--orange);
  flex-shrink: 0;
  margin-left: clamp(20px, 4vw, 60px);
}

/* ── PLACEHOLDER ── */
.placeholder {
  position: relative; width: 100%;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.placeholder span {
  position: absolute;
  font-size: 10px; font-family: monospace;
  color: rgba(0,0,0,0.3);
  text-align: center; padding: 8px;
  pointer-events: none; max-width: 80%;
}
.placeholder--dark span { color: rgba(255,255,255,0.25); }

/* ── HERO ── */
.hero-single-work {
  min-height: 100svh;
  display: flex; flex-direction: column;
  padding-top: 56px;
}
.hero__container {
  flex: 1; display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 0 var(--px) clamp(30px, 5vh, 60px);
}
.hero__text-group { display: flex; flex-direction: column; }
.hero__title {
  font-size: clamp(52px, 9.5vw, 128px);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.04em;
  margin-bottom: clamp(24px, 4vh, 48px);
}
.hero__title .word { display: inline-block; overflow: hidden; vertical-align: bottom; }
.hero__title .word__inner { display: inline-block; }
.hero__meta {
  display: flex; flex-direction: column; gap: 2px;
  font-size: clamp(11px, 0.85vw, 13px);
  font-family: 'Courier New', monospace;
  line-height: 1.6; margin-bottom: clamp(20px, 3vh, 40px);
}
.hero__description { max-width: 520px; margin-left: auto; }
.hero__description p {
  font-size: clamp(16px, 1.6vw, 22px);
  line-height: 1.35; letter-spacing: -0.025em;
}

/* ── WORK-INFO ── */
.work-info {
  border-top: 1px solid rgba(0,0,0,.15);
  padding: clamp(12px, 2vh, 18px) var(--px);
  background: #fff;
  position: sticky; top: 0; z-index: 100;
}
.work-info__inner { display: flex; }
.work-info__col {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 3px;
  padding-right: clamp(10px, 2vw, 20px);
  border-right: 1px solid rgba(0,0,0,.1);
  padding-left: clamp(8px, 1.5vw, 16px);
}
.work-info__col:first-child { padding-left: 0; }
.work-info__col:last-child { border-right: none; }
.work-info__label { font-size: clamp(9px, 0.7vw, 11px); color: var(--gray); text-transform: lowercase; }
.work-info__value { font-size: clamp(11px, 0.9vw, 13px); font-weight: 700; }

/* ── COLLAGE ── */
.component--collage { padding: var(--gap) 0; }
.collage__wrap {
  display: flex; flex-direction: column; gap: var(--gap);
  padding: 0 clamp(6px, 0.6vw, 10px);
}
.collage__wrap--reverse { flex-direction: column-reverse; }
.collage__top, .collage__bottom { width: 100%; }
.collage__duo { display: flex; gap: var(--gap); }
.collage__duo .placeholder { flex: 1; }

/* ── TEXTE ── */
.component--text { padding: clamp(60px, 10vh, 140px) 0; }
.component--text--dark { background: var(--black); color: var(--white); }
.text__container { padding: 0 clamp(30px, 10vw, 140px); }
.text__body { max-width: 620px; margin-left: auto; }
.text__body p { font-size: clamp(13px, 1.05vw, 15px); line-height: 1.72; letter-spacing: -0.02em; }
.text__body p + p { margin-top: clamp(16px, 2.5vh, 28px); }
.text__body .word { display: inline; }

/* ── TEXT STICKY ── */
.component--text-sticky { padding: 0; }
.sticky__container {
  display: flex; gap: clamp(24px, 4vw, 60px);
  align-items: flex-start;
  padding: 0 clamp(20px, 4vw, 60px);
}
.sticky__sidebar {
  flex: 0 0 clamp(200px, 22vw, 300px);
  position: sticky;
  top: clamp(80px, 14vh, 130px);
  padding: clamp(30px, 5vh, 60px) 0;
}
.sticky__sidebar p { font-size: clamp(11px, 0.9vw, 13px); line-height: 1.75; letter-spacing: -0.015em; }
.sticky__sidebar p + p { margin-top: clamp(14px, 2.5vh, 28px); }
.sticky__content {
  flex: 1; display: flex; flex-direction: column;
  gap: clamp(16px, 2.5vw, 32px);
  padding: clamp(30px, 5vh, 60px) 0;
}
.sticky__item { width: 100%; overflow: hidden; }

/* ── IMAGE GRID ── */
.component--image-grid {
  background: var(--black);
  position: relative;
  padding: clamp(8px, 0.6vw, 12px);
}
.image-grid__items {
  display: grid;
  grid-template-columns: 33fr 16fr 16fr 33fr;
  grid-template-rows: repeat(3, minmax(200px, 26vh));
  gap: clamp(4px, 0.4vw, 8px);
}
.grid__item { overflow: hidden; }
.grid__item.pos-1 { grid-column: 1; grid-row: 1; }
.grid__item.pos-2 { grid-column: 2; grid-row: 1; }
.grid__item.pos-3 { grid-column: 4; grid-row: 1; }
.grid__item.pos-4 { grid-column: 1; grid-row: 2; }
.grid__item.pos-5 { grid-column: 3; grid-row: 2; }
.grid__item.pos-6 { grid-column: 4; grid-row: 2; }
.grid__item.pos-7 { grid-column: 1; grid-row: 3; }
.grid__item.pos-8 { grid-column: 3; grid-row: 3; }
.grid__item.pos-9 { grid-column: 4; grid-row: 3; }
.image-grid__overlay {
  position: absolute;
  left: clamp(20px, 3vw, 50px);
  top: 50%; transform: translateY(-50%);
  color: var(--white); pointer-events: none; z-index: 10; line-height: 1;
}
.overlay__number {
  display: block;
  font-size: clamp(40px, 6vw, 90px);
  font-weight: 900; letter-spacing: -0.04em;
}
.overlay__label {
  display: block;
  font-size: clamp(30px, 4.5vw, 68px);
  font-weight: 900; letter-spacing: -0.04em;
}

/* ── CREDITS ── */
.component--credits { padding: clamp(60px, 10vh, 130px) 0; }
.credits__container { padding: 0 clamp(30px, 10vw, 140px); }
.credits__label {
  font-size: clamp(10px, 0.8vw, 12px);
  color: var(--gray); font-family: monospace;
  margin-bottom: clamp(30px, 5vh, 60px);
}
.credits__names { font-size: clamp(26px, 4.5vw, 64px); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
.credits__faded { color: rgba(0,0,0,.22); }
.credits__names .word { display: inline-block; }

/* ── FOOTER ── */
.son-footer { border-top: 1px solid rgba(0,0,0,.1); }
.son-footer__inner {
  display: flex; justify-content: space-between; align-items: center;
  padding: clamp(40px, 6vh, 80px) var(--px);
}
.son-footer__back { font-size: clamp(12px, 1vw, 15px); letter-spacing: -0.02em; transition: opacity .2s; }
.son-footer__back:hover { opacity: .4; }
.son-footer__copy { font-size: clamp(10px, 0.75vw, 12px); color: var(--gray); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero__description { margin-left: 0; }
  .work-info__inner { flex-wrap: wrap; gap: 12px; }
  .work-info__col {
    flex: 1 1 45%; border-right: none;
    border-bottom: 1px solid rgba(0,0,0,.1); padding-bottom: 10px;
  }
  .sticky__container { flex-direction: column; }
  .sticky__sidebar { position: static; }
  .collage__duo { flex-direction: column; }
  .image-grid__items {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  .grid__item.pos-1,
  .grid__item.pos-4,
  .grid__item.pos-7 { grid-column: span 2; }
  .grid__item.pos-2,
  .grid__item.pos-3,
  .grid__item.pos-5,
  .grid__item.pos-6,
  .grid__item.pos-8,
  .grid__item.pos-9 { grid-column: span 1; }
  .image-grid__overlay { display: none; }
  .credits__names { font-size: clamp(20px, 6vw, 36px); }
}
```

- [ ] **Step 2 : Vérifier**

```bash
wc -l "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio/src/styles/son-des-matieres.css"
```

Expected: ~200 lignes.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
git add src/styles/son-des-matieres.css
git commit -m "style: add son-des-matieres blit-style CSS"
```

---

### Task 3 : Créer la page Astro

**Files:**
- Create: `src/pages/projets/son-des-matieres.astro`

**Interfaces:**
- Consumes: `src/styles/son-des-matieres.css`, `src/components/islands/SonScroll.tsx`
- Produces: route `/projets/son-des-matieres` avec les 11 sections complètes

Note: page **standalone** — pas de `Base.astro` pour éviter que `tokens.css` (fond sombre du portfolio) écrase le fond blanc de cette page.

Note: le `<h1 class="hero__title">` pré-wrappe chaque ligne dans `.word > .word__inner` pour que GSAP puisse animer ligne par ligne malgré les `<br>`.

- [ ] **Step 1 : Créer `src/pages/projets/son-des-matieres.astro`**

```astro
---
import '../../styles/son-des-matieres.css';
import SonScroll from '../../components/islands/SonScroll.tsx';
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Le son des matières — Alec Mignot</title>
  <meta name="description" content="Un synthétiseur sensoriel — chaque matériau touché a sa voix." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>

<div class="cursor__dot" id="cursorDot"></div>

<header class="son-header" id="sonHeader">
  <div class="son-header__inner">
    <a href="/#projets" class="son-header__back">← Tous les projets</a>
    <span class="son-header__title">Le son des matières</span>
    <span class="son-header__dot"></span>
  </div>
</header>

<main>

  <!-- S1 : HERO -->
  <section class="component hero-single-work">
    <div class="hero__container">
      <div class="hero__text-group">
        <h1 class="hero__title" id="heroTitle">
          <span class="word"><span class="word__inner">Le son</span></span><br>
          <span class="word"><span class="word__inner">des</span></span><br>
          <span class="word"><span class="word__inner">matières</span></span>
        </h1>
        <div class="hero__meta" id="heroMeta">
          <span>2023</span>
          <span>Objet électronique</span>
          <span>Synthèse sonore</span>
          <span>Design sensoriel</span>
        </div>
        <div class="hero__description" id="heroDesc">
          <p>Un synthétiseur sensoriel — chaque matériau touché a sa voix.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- WORK-INFO BAR -->
  <div class="work-info" id="workInfo">
    <div class="work-info__inner">
      <div class="work-info__col">
        <span class="work-info__label">type</span>
        <span class="work-info__value">Objet interactif</span>
      </div>
      <div class="work-info__col">
        <span class="work-info__label">matériaux</span>
        <span class="work-info__value">Bois, métal, tissu</span>
      </div>
      <div class="work-info__col">
        <span class="work-info__label">outils</span>
        <span class="work-info__value">Arduino, Max/MSP</span>
      </div>
      <div class="work-info__col">
        <span class="work-info__label">capteurs</span>
        <span class="work-info__value">Capacitifs</span>
      </div>
      <div class="work-info__col">
        <span class="work-info__label">année</span>
        <span class="work-info__value">2023</span>
      </div>
    </div>
  </div>

  <!-- S2 : COLLAGE 1 (reverse) -->
  <section class="component component--collage">
    <div class="collage__wrap collage__wrap--reverse">
      <div class="collage__top">
        <div class="placeholder" style="aspect-ratio:16/9;background:#1a1a1a;">
          <span>Photo : vue d'ensemble du prototype sur table de bois</span>
        </div>
      </div>
      <div class="collage__bottom">
        <div class="placeholder" style="aspect-ratio:200/47;background:#c8c0b4;">
          <span>Photo : détail surface textile — panoramique</span>
        </div>
      </div>
    </div>
  </section>

  <!-- S3 : TEXTE INTRO -->
  <section class="component component--text">
    <div class="text__container">
      <div class="text__body">
        <p>En 2023, partant du constat que les matériaux ont une présence silencieuse, j'ai voulu leur donner une voix. Le son des matières est un synthétiseur sensoriel : chaque surface — bois brut, métal brossé, tissu tendu — déclenche, par simple contact, une fréquence qui lui ressemble. Le projet questionne la frontière entre l'objet quotidien et l'instrument de musique.</p>
      </div>
    </div>
  </section>

  <!-- S4 : COLLAGE 2 -->
  <section class="component component--collage">
    <div class="collage__wrap">
      <div class="collage__top">
        <div class="collage__duo">
          <div class="placeholder" style="aspect-ratio:16/9;background:#e8e0d4;">
            <span>Photo : capteur capacitif sur bois — gros plan</span>
          </div>
          <div class="placeholder" style="aspect-ratio:16/9;background:#2a2a2a;">
            <span>Photo : circuit Arduino — filaments cuivre sur fond sombre</span>
          </div>
        </div>
      </div>
      <div class="collage__bottom">
        <div class="placeholder" style="aspect-ratio:200/47;background:#111;">
          <span>Photo : spectre sonore visualisé — panoramique sombre</span>
        </div>
      </div>
    </div>
  </section>

  <!-- S5 : COLLAGE 3 (vidéo full-width) -->
  <section class="component component--collage">
    <div class="collage__wrap">
      <div class="collage__top"></div>
      <div class="collage__bottom">
        <div class="placeholder placeholder--dark" style="aspect-ratio:16/9;background:#0a0a0a;">
          <span>Vidéo : démonstration — main effleurant les surfaces, sons en réponse</span>
        </div>
      </div>
    </div>
  </section>

  <!-- S6 : TEXT STICKY -->
  <section class="component component--text-sticky">
    <div class="sticky__container">
      <div class="sticky__sidebar" id="stickySidebar">
        <p>L'approche créative repose sur l'idée que chaque matériau a une identité sonore qui lui est propre — rugosité, résonance, température perçue.</p>
        <p>La première contrainte était technique : les capteurs capacitifs doivent détecter un contact sans pression mécanique. L'Arduino lit les variations de charge électrique induites par la peau humaine, traduites ensuite en paramètres sonores dans Max/MSP.</p>
        <p>La deuxième contrainte était sensorielle : le mapping son-matière ne devait pas être arbitraire. Le bois donne des fréquences graves et chaudes. Le métal, des harmoniques cristallines. Le tissu, des textures bruitées et douces.</p>
        <p>Le résultat est un objet qui joue au croisement de la lutherie et de l'électronique — un instrument qu'on n'apprend pas, qu'on explore.</p>
      </div>
      <div class="sticky__content" id="stickyContent">
        <div class="sticky__item --magnet">
          <div class="placeholder" style="aspect-ratio:593/835;background:#f0ece6;">
            <span>Photo : prototype — portrait format, fond clair</span>
          </div>
        </div>
        <div class="sticky__item --magnet">
          <div class="placeholder" style="aspect-ratio:960/479;background:#2a2a2a;">
            <span>Schéma : diagramme des capteurs et connexions Arduino</span>
          </div>
        </div>
        <div class="sticky__item --magnet">
          <div class="placeholder" style="aspect-ratio:2/1;background:#f5f0ea;">
            <span>Photo : les 6 matériaux côte à côte</span>
          </div>
        </div>
        <div class="sticky__item --magnet">
          <div class="placeholder" style="aspect-ratio:5/3;background:#e0e0e0;">
            <span>Schéma : patch Max/MSP — routage signal</span>
          </div>
        </div>
        <div class="sticky__item --magnet">
          <div class="placeholder" style="aspect-ratio:2/1;background:#1a0a08;">
            <span>Photo : test utilisateur — main sur objet, ambiance lumière basse</span>
          </div>
        </div>
        <div class="sticky__item --magnet">
          <div class="placeholder placeholder--dark" style="aspect-ratio:2.29/1;background:#111;">
            <span>Vidéo : performance live — 3 matériaux joués simultanément</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- S7 : COLLAGE 4 -->
  <section class="component component--collage">
    <div class="collage__wrap">
      <div class="collage__top">
        <div class="collage__duo">
          <div class="placeholder placeholder--dark" style="aspect-ratio:16/9;background:#111;">
            <span>Photo : détail métal brossé — reflets dramatiques</span>
          </div>
          <div class="placeholder placeholder--dark" style="aspect-ratio:16/9;background:#333;">
            <span>Photo : fil de cuivre sur circuit imprimé</span>
          </div>
        </div>
      </div>
      <div class="collage__bottom">
        <div class="placeholder placeholder--dark" style="aspect-ratio:16/9;background:#0a0a0a;">
          <span>Photo : objet final posé sur table — lumière rasante</span>
        </div>
      </div>
    </div>
  </section>

  <!-- S8 : COLLAGE 5 -->
  <section class="component component--collage">
    <div class="collage__wrap">
      <div class="collage__top">
        <div class="placeholder placeholder--dark" style="aspect-ratio:16/9;background:#0d0d0d;">
          <span>Photo : vue d'ambiance — objet dans son contexte d'usage</span>
        </div>
      </div>
      <div class="collage__bottom"></div>
    </div>
  </section>

  <!-- S9 : TEXTE DARK -->
  <section class="component component--text component--text--dark">
    <div class="text__container">
      <div class="text__body">
        <p>Six matériaux. Six voix. Un seul objet à la croisée de la lutherie et de l'électronique embarquée.</p>
        <p>Le son des matières interroge notre rapport au quotidien : quand la table de travail devient instrument, quand le tissu de sa veste devient mélodie, l'environnement change de nature. Ce projet m'a appris que le design n'est pas que visuel — il est aussi auditif, tactile, sensoriel.</p>
      </div>
    </div>
  </section>

  <!-- S10 : IMAGE GRID PINNÉE -->
  <section class="component component--image-grid" id="imageGrid">
    <div class="image-grid__items">
      <div class="grid__item pos-1" style="aspect-ratio:16/9;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#111;">
          <span>Photo : surface bois — gros plan texture</span>
        </div>
      </div>
      <div class="grid__item pos-2" style="aspect-ratio:0.924;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#1a1a1a;">
          <span>Photo : capteur sur métal — portrait</span>
        </div>
      </div>
      <div class="grid__item pos-3" style="aspect-ratio:0.924;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#1c0808;">
          <span>Photo : tissu rouge — portrait</span>
        </div>
      </div>
      <div class="grid__item pos-4" style="aspect-ratio:0.924;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#0a1a0a;">
          <span>Photo : LED verte sur circuit</span>
        </div>
      </div>
      <div class="grid__item pos-5" style="aspect-ratio:2.55;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#111;">
          <span>Vidéo : oscilloscope — onde sonore ultra-wide</span>
        </div>
      </div>
      <div class="grid__item pos-6" style="aspect-ratio:2.29;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#1a0000;">
          <span>Vidéo : spectre audio — rouge/orange</span>
        </div>
      </div>
      <div class="grid__item pos-7" style="aspect-ratio:16/9;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#0a0a0a;">
          <span>Vidéo : main sur surface — contact lent</span>
        </div>
      </div>
      <div class="grid__item pos-8" style="aspect-ratio:0.924;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#1a1a2e;">
          <span>Photo : objet — lumière bleue froide</span>
        </div>
      </div>
      <div class="grid__item pos-9" style="aspect-ratio:0.924;">
        <div class="placeholder placeholder--dark" style="height:100%;background:#3d0a1a;">
          <span>Photo : tissu violet — grain textile gros plan</span>
        </div>
      </div>
    </div>
    <div class="image-grid__overlay">
      <span class="overlay__number">6</span>
      <span class="overlay__label">matières<br>1 voix</span>
    </div>
  </section>

  <!-- S11 : CREDITS -->
  <section class="component component--credits">
    <div class="credits__container">
      <p class="credits__label">Ce projet</p>
      <p class="credits__names" id="creditsNames">
        Conception & réalisation /
        <span class="word">Alec</span>
        <span class="word">Mignot</span>
        /
        <span class="credits__faded">Encadrement pédagogique</span>
      </p>
    </div>
  </section>

</main>

<footer class="son-footer">
  <div class="son-footer__inner">
    <a href="/#projets" class="son-footer__back">← Retour aux projets</a>
    <p class="son-footer__copy">Alec Mignot — 2023</p>
  </div>
</footer>

<SonScroll client:load />

</body>
</html>
```

- [ ] **Step 2 : Lancer le dev server et vérifier la page**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
npm run dev
```

Ouvrir http://localhost:4321/projets/son-des-matieres — attendre : fond blanc, typo Archivo, 11 sections visibles, curseur caché (pas encore de JS). Vérifier qu'aucun style du portfolio (fond noir, variables `--color-bg`) ne s'applique.

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
git add src/pages/projets/son-des-matieres.astro
git commit -m "feat(son): add blit-style case study page structure"
```

---

### Task 4 : React island SonScroll — GSAP + Lenis

**Files:**
- Create: `src/components/islands/SonScroll.tsx`

**Interfaces:**
- Consumes (DOM par ID/classe) :
  - `#cursorDot` — point curseur orange
  - `#sonHeader` — header à cacher/montrer
  - `#heroTitle .word__inner` — 3 éléments, animation entrée
  - `#heroMeta span` — 4 spans méta
  - `#heroDesc` — description hero
  - `.work-info__col` — 5 colonnes work-info
  - `.component--text .text__body p` — paragraphes texte (per-word)
  - `.component--collage .collage__top`, `.collage__bottom` — fadeUp
  - `.sticky__item` — 6 items section sticky
  - `#imageGrid` — section grille pinnée
  - `#imageGrid .grid__item` — 9 items grille
  - `#imageGrid .image-grid__overlay` — texte overlay parallax
  - `#creditsNames .word` — mots credits
  - `.--magnet` — 6 items effet magnet
- Produces: Lenis smooth scroll, toutes les animations GSAP

- [ ] **Step 1 : Créer `src/components/islands/SonScroll.tsx`**

```tsx
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
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // ── Curseur custom (toujours actif) ─────────────────
    const dot = document.getElementById('cursorDot');
    if (dot) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
      document.addEventListener('mousemove', onMove);
      const tickCursor = () => {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        gsap.set(dot, { x: cx, y: cy });
      };
      gsap.ticker.add(tickCursor);
      const hoverEls = document.querySelectorAll('a, button, .--magnet');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
        el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
      });
    }

    // Sortie anticipée si reduced motion (curseur reste actif)
    if (prefersReduced) {
      return () => {
        lenis.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
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
      const onMove = (e: MouseEvent) => {
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
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
```

- [ ] **Step 2 : Vérifier — pas d'erreur console**

```bash
npm run dev
```

Ouvrir http://localhost:4321/projets/son-des-matieres, DevTools console → attendre : zéro erreur. Vérifier :
- curseur orange suit la souris avec lag
- titre hero s'anime à l'arrivée (3 lignes montent)
- scroll smooth (Lenis)
- sections text et collages fadent au scroll
- sidebar S6 reste sticky pendant le scroll du contenu droite
- image grid S10 pinsée (la section ne bouge pas pendant 2.5× viewport de scroll)
- items grid fadent pendant le pin
- overlay "6 / matières 1 voix" fait un léger parallax vers le haut
- header se cache en scrollant vers le bas, réapparaît en remontant

- [ ] **Step 3 : Vérifier prefers-reduced-motion**

DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" → recharger. Attendre : contenu visible immédiatement, pas d'animation, curseur orange toujours présent.

- [ ] **Step 4 : Vérifier responsive 375px**

DevTools → device toolbar → iPhone SE. Attendre : pas de scroll horizontal, work-info en 2 colonnes, sidebar S6 en mode static (non sticky), grille S10 en 2 colonnes, overlay masqué.

- [ ] **Step 5 : Commit**

```bash
cd "/Users/alecmignot/Documents/MERGEFINAL/RENDU DATABASE/portfolio"
git add src/components/islands/SonScroll.tsx
git commit -m "feat(son): GSAP + Lenis scroll animations island"
```

---

## Self-Review

**Couverture spec :**
- [x] Curseur 12px orange lerp 0.12 → Task 4 (ticker `cx += (mx-cx)*0.12`)
- [x] Lenis lerp 0.08 → Task 4
- [x] Hero title yPercent:110 stagger 0.08 → Task 4 anim #1
- [x] Meta stagger 0.1 delay 0.6 → Task 4 anim #2
- [x] Desc delay 0.5 → Task 4 anim #3
- [x] Work-info x:-20 stagger 0.08 → Task 4 anim #4
- [x] Texte per-word stagger 0.015 → Task 4 anim #5
- [x] Collages y:60 fadeUp → Task 4 anim #6
- [x] Sticky items fadeUp → Task 4 anim #7
- [x] Grid pinned 2.5× viewport → Task 4 anim #8
- [x] Grid items scale 0.95→1 scrub:1 → Task 4 anim #8
- [x] Overlay parallax y:-80 scrub:1.5 → Task 4 anim #8
- [x] Credits per-word stagger 0.025 → Task 4 anim #9
- [x] Header hide/show lenis scroll → Task 4 anim #10
- [x] Magnet ±20px elastic 0.4s → Task 4 anim #11
- [x] prefers-reduced-motion → Task 4 (early return après curseur)
- [x] 11 sections HTML → Task 3
- [x] CSS complet + responsive → Task 2
- [x] `npm install lenis` → Task 1
- [x] Supprimer .mdx → Task 1

**Cohérence types :** `Lenis` callback `{ scroll: number }` — cohérent Task 4. IDs et classes correspondent entre Task 2, 3, 4. `#heroTitle .word__inner` pré-créé dans Task 3 (HTML), lu dans Task 4 (JS).

**Pas de placeholder dans le plan :** tous les steps ont du code complet.
