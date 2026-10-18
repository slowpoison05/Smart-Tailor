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
- Photo upload validation (JPG, PNG, WEBP; up to 12 MB) for person and garment photos. Photos stay in browser memory until the user explicitly starts AI try-on.
- FASHN AI virtual try-on integration with server-side API-key handling, optimized image payloads, async prediction polling and generated-result preview. Requires a FASHN API key and paid credits.
- A more detailed procedural female avatar with face, hair, hands, legs and measurement-responsive torso proportions.

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

## Enable AI virtual try-on

The app is integrated with the FASHN `tryon-max` API. To enable real generations:

1. Create an account at [FASHN](https://app.fashn.ai/) and enable API credits. Usage is paid; review current pricing before testing.
2. Create an API key in the FASHN developer dashboard.
3. For local development, copy `.env.example` to `.env.local` and set `FASHN_API_KEY=your_key`. In Vercel, add `FASHN_API_KEY` under Project Settings → Environment Variables for Preview and Production as needed, then redeploy.
4. In the app, upload a person photo and a clear garment reference photo, then choose **Generate realistic try-on**. The result is generated asynchronously and shown in the app.

The API key stays server-side. Images are resized in the browser before upload and are sent to FASHN only when the user starts generation. The integration requests base64 output to reduce long-lived provider output URLs, but source photos still leave the browser and are processed by FASHN. Review the provider's current [data retention and privacy terms](https://docs.fashn.ai/api-overview/data-retention-and-privacy) before using real client photos. The generated preview is illustrative; it does not guarantee exact fabric construction or real-world fit.

## Important limitations

- The 3D avatar is a more detailed procedural model, not a scanned or photorealistic human asset. The garment geometry is still a stylized preview without cloth physics, calibrated body scanning, production-ready sewing patterns, or a guarantee of fit.
- Client profiles and drafts are stored in the browser's localStorage. They do not sync between devices and are not a shared database. Do not use this prototype to store sensitive client data.
- The uploaded photo is not persisted with a saved profile.
- Authentication, cloud database, orders/payments, production sewing-pattern generation, and real AI try-on require additional integrations.

## Main files

- `app/page.tsx` — workspace UI, measurement controls, client profiles, CSV export.
- `components/Garment3D.tsx` — procedural 3D preview.
- `app/api/try-on/route.ts` — server-side FASHN submission and prediction status polling.
- `app/globals.css` — responsive styling.
