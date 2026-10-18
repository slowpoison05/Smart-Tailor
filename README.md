# Smart Tailor — Virtual Atelier

A responsive tailoring workspace for women's blouses, salwar suits, dresses and gowns, built with Next.js, TypeScript, React Three Fiber and Three.js.

## Current features

- Responsive fitting-studio dashboard.
- Four garment silhouettes with color and fabric selection.
- Interactive 3D preview; rotate and zoom the scene.
- Live bust, waist, hips, shoulder, sleeve and garment-length controls.
- Inches/centimetres display conversion and slim/regular/loose fit selection.
- Save/restore the active draft in the current browser.
- Save up to 50 named client profiles locally; load or remove profiles.
- Export a CSV measurement sheet.
- Photo upload validation (JPG, PNG, WEBP; up to 12 MB). The selected photo is kept in page memory and is not uploaded by this prototype.
- Server route reserved for a provider-specific AI try-on adapter; it returns a clear 501 until the adapter is implemented.

## Run locally

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To check a production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Import the GitHub repository `slowpoison05/Smart-Tailor` in Vercel.
2. Keep the framework preset as **Next.js** and the root directory as `./`.
3. Leave build and install commands at their defaults.
4. Deploy from the `main` branch. New commits should trigger deployments when Git integration is enabled.

## AI try-on integration

AI try-on is not active yet. Choose a provider that explicitly supports image editing/virtual try-on, review its image-retention and privacy terms, then implement its request/response format in `app/api/try-on/route.ts`. Store credentials only as server-side Vercel environment variables; never expose secret keys in `NEXT_PUBLIC_*` variables. The current endpoint deliberately does not return a fake generated image.

## Important limitations

- The 3D garment is a stylized procedural preview, not a calibrated body scan, realistic cloth simulation, production-ready sewing pattern, or guarantee of garment fit.
- Client profiles and drafts are stored in the browser's localStorage. They do not sync between devices and are not a shared database. Do not use this prototype to store sensitive client data.
- The uploaded photo is not persisted with a saved profile.
- Authentication, cloud database, orders/payments, production sewing-pattern generation, and real AI try-on require additional integrations.

## Main files

- `app/page.tsx` — workspace UI, measurement controls, client profiles, CSV export.
- `components/Garment3D.tsx` — procedural 3D preview.
- `app/api/try-on/route.ts` — safe integration boundary for AI try-on.
- `app/globals.css` — responsive styling.
