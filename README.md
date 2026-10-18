# Meow-Gop

**Meow-Gop** is an interactive celebration of cat sounds — boop the cat, play the
meow board, and run the gop gop machine. Built with React, Vite, Tailwind CSS and
Framer Motion.

## Live site

**Live:** <https://meow-gop.vercel.app>

Deployed on Vercel (Vite preset, auto-deploys from `main`).

## Tech stack

- React 19 + TypeScript
- Vite 7 (`vite-plugin-singlefile` production build)
- Tailwind CSS 4
- Framer Motion + Lenis
- Web Audio API for synthesized meows

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## Deploying to Vercel

This repository is Vercel-ready (`vercel.json` pins the Vite framework preset,
`npm run build`, and the `dist` output directory):

```bash
npm i -g vercel
vercel --prod
```

Or import the GitHub repository at [vercel.com/new](https://vercel.com/new) —
Vercel will detect Vite automatically.

## Repository

<https://github.com/HassanDev-git/Meow-site>
