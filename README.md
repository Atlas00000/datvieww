# Dataviz Proto – Vibrant Analytics Dashboard

A light, modern analytics dashboard with a Professional Business style, vibrant colors, and interactive D3 visualizations. Built with Next.js, Tailwind CSS, D3, and Zustand. Deployed on Vercel.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8" alt="Tailwind" />
  <img src="https://img.shields.io/badge/D3-7-F97316" alt="D3" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Zustand-Store-16A34A" alt="Zustand" />
</p>

## Features
- Clean, bright theme with glass surfaces and soft gradients
- Interactive charts: histograms, pies/donuts, stacked bars, heatmaps, treemap, sunburst, scatter, gauge, density lines and more
- Rich interactivity: tooltips, crosshairs, hover outlines, animated transitions
- Modular D3 components designed for readability and extension
- Mock data generator with realistic correlations
- Data view with filtering, sorting, column selection and CSV export

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS 3 (+ Typography plugin)
- D3 v7
- Zustand for client state
- TypeScript, ESLint, Prettier

## Quick Start
```bash
# Install (pnpm recommended)
pnpm install

# Run dev
pnpm dev

# Production build
pnpm build && pnpm start
```

- Local dev: http://localhost:3000
- Data View: http://localhost:3000/dataview

## Project Structure
```
src/
  app/
    page.tsx         # Homepage dashboard
    dataview/        # Data table view
    layout.tsx       # App layout, global styles
  components/
    visualization/   # D3 chart components
    ui/              # Small UI helpers
  data/
    mockData.ts      # Mock dataset generator
  stores/
    visualizationStore.ts # Zustand store
```

## Theming
- Palette: light, bright surfaces; primary/secondary/info/accent tokens
- Effects: glass backgrounds, soft shadows, ambient gradient orbs
- Motion: smooth fades/slide/scale; chart transitions 600–900ms (easeCubic)

## Key Pages
- Homepage: curated sections (Demographics & Lifestyle, Digital Behavior & Technology, Consumer Behavior & Shopping, Health & Wellness Patterns, etc.)
- Data View: searchable, sortable table; column toggles and CSV export

## Scripts
```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # Lint
pnpm type-check    # TypeScript check
pnpm clean         # Remove .next/out
```

## Deployment (Vercel)
- Repo is ready for Vercel zero-config
- Build command: pnpm build
- Output: .next

## Screenshots (Optional)
- Add screenshots or a short GIF of the homepage and key charts

## Contributing
- Keep changes simple and within scope
- Prefer small, focused PRs
- Maintain clarity and readability over cleverness

## License
MIT
