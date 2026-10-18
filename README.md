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

## Free AI virtual try-on (Android-friendly)

This project no longer calls the paid FASHN API. The Next.js site can run on Vercel without a paid AI key. For AI image generation, deploy the companion app in `free-tryon-space/` as your own Hugging Face Gradio Space using the open-source FASHN VTON v1.5 model.

### Set up the free hosted model

1. Sign in to [Hugging Face](https://huggingface.co/). A free account can use eligible ZeroGPU Spaces with a limited daily quota; availability and eligibility may vary.
2. Create a new **Gradio Space**. Use ZeroGPU for free GPU inference if available to your account. Copy the files from `free-tryon-space/` into that Space's repository and let it build.
3. Wait for the first model download and startup. The weights are around 2 GB and the app may take time to become ready.
4. Copy the Space's public HTTPS URL ending in `hf.space`.
5. In Vercel, set `NEXT_PUBLIC_FREE_TRYON_SPACE_URL` to that URL, then redeploy. The app opens your Space in a new tab.
6. Re-upload the person photo and garment photo in the Space. Photos are deliberately not passed between sites automatically.

### Cost, hardware and licensing

- No FASHN paid API key or paid API call is used by this project.
- This is **not unlimited free compute**: ZeroGPU access has a limited quota, queues, cold starts and eligibility rules. The Space can sleep between uses. If free GPU access is unavailable, do not switch to paid hardware unless you choose to.
- The Android phone is only the browser/client. AI inference runs on Hugging Face's hosted GPU, not on the phone. Local inference on an Android phone is not a realistic target for this model.
- FASHN VTON v1.5 model is published under Apache-2.0, but review the model repository's third-party component notices and licenses before commercial use. Do not assume every dependency or weight has identical terms.
- Generated previews can alter garment details and do not guarantee exact tailoring fit.

### Privacy

The Smart Tailor website does not send uploaded photos to the model automatically. When you open your own Space and upload photos there, those images are sent to Hugging Face's hosted runtime for processing. Review Hugging Face's terms and Space visibility settings, and use client photos only with informed consent.

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
