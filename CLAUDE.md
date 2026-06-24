## 1. TONE & COMPORTEMENT
- Zéro politesse, pas d'introduction, pas de conclusion, aucun compliment. Va à l'essentiel. Commandes, code, statut uniquement.

## 2. ÉCONOMIE DE TOKENS (RÈGLES DE LECTURE)
- Interdiction absolue de lire un fichier de plus de 200 lignes en entier.
- Utilise `grep`, `sed`, `tree` ou lectures ciblées (offset + limit).
- Jamais réécrire un composant entier pour une seule modif. Patch ciblé avec Edit.
- N'analyse JAMAIS `node_modules`, `.git`, `dist`, `.astro`.

## 3. STACK
- Astro v6 + React v19 + TypeScript v6
- GSAP + Lenis pour les animations
- Pages : `.astro` avec îlots React (`src/components/islands/`)
- Styles : CSS externe dans `src/styles/`

## 4. ANTI-PATTERNS
- Pas de lecture de fichier en entier si >200 lignes.
- Pas de `cat` sur des fichiers. Utiliser Read avec offset/limit.
- Pas de réécriture complète. Toujours Edit avec old_string ciblé.
- Pas de commande `find` inutile. Utiliser Glob en premier.
