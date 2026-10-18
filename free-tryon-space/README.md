---
title: Smart Tailor Free AI Try-On
emoji: 👗
colorFrom: pink
colorTo: purple
sdk: gradio
sdk_version: 5.20.1
app_file: app.py
pinned: false
---
# Smart Tailor Free AI Try-On Space

This companion app runs the open-source FASHN VTON v1.5 model using Hugging Face ZeroGPU where eligible.

## Deploy on Hugging Face

1. Create a Hugging Face account and a new Gradio Space.
2. Select ZeroGPU hardware if it is available to your account. Free GPU access is quota-limited and eligibility can change.
3. Upload these files (app.py, requirements.txt, and this README.md) to the Space.
4. Wait for the Space to build. On first launch, the app clones the official model source, installs its dependencies and downloads about 2 GB of weights. This may take several minutes or fail if the Space startup limit is reached.
5. Once the Space is running, copy its public HTTPS URL ending in hf.space and set it as NEXT_PUBLIC_FREE_TRYON_SPACE_URL in Vercel for Smart Tailor.

## Costs and limits

No paid FASHN API key is used. ZeroGPU is a shared, quota-limited service, not unlimited free inference. Queue time, account eligibility, daily GPU quota, and cold starts may prevent use at some times. Do not upgrade to paid hardware if you need to keep the project entirely free.

## License and privacy

The FASHN VTON v1.5 model repository states Apache-2.0 licensing. Review its current LICENSE and third-party component notices before commercial use; not every dependency or auxiliary model necessarily has identical terms. Images uploaded here are processed by the hosted Space. Do not upload client photographs without their informed consent and review of the host's current privacy/retention terms.

The model generates illustrative images and is not a sewing pattern, body scan, or guarantee of fit. It can alter garment construction, patterns, color, and body details.
