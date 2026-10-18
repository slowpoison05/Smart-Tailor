import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.fashn.ai/v1";
const MAX_IMAGE_CHARS = 3_500_000;
type TryOnBody = { modelImage?: unknown; garmentImage?: unknown; garment?: unknown };
type FashnError = { name?: string; message?: string } | string | null;

function validImageData(value: unknown): value is string {
  return typeof value === "string" && value.length <= MAX_IMAGE_CHARS
    && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
}
function errorMessage(error: FashnError, fallback: string) {
  if (typeof error === "string") return error.slice(0, 300);
  if (error && typeof error.message === "string") return error.message.slice(0, 300);
  return fallback;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) return NextResponse.json({
    error: "AI try-on is not configured.",
    detail: "Add FASHN_API_KEY in Vercel Project Settings → Environment Variables, then redeploy. No image was sent to a provider."
  }, { status: 503 });

  let body: TryOnBody;
  try { body = await request.json() as TryOnBody; }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!validImageData(body.modelImage) || !validImageData(body.garmentImage)) {
    return NextResponse.json({
      error: "Please provide a valid person photo and garment photo.",
      detail: "Use JPG, PNG or WEBP images. Optimized image payload must be under about 2.5 MB per image."
    }, { status: 400 });
  }

  const garment = typeof body.garment === "string" ? body.garment : "outfit";
  const prompt = "Apply the supplied " + garment + " design to the person. Preserve the person's identity, face, body shape, pose and skin tone. Keep garment construction, neckline, sleeves, fabric texture and color as faithful as possible. Fashion catalogue photography, realistic cloth drape.";
  try {
    const response = await fetch(API_BASE + "/run", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: {
          model_image: body.modelImage, product_image: body.garmentImage, prompt,
          generation_mode: "balanced", resolution: "1k", num_images: 1,
          output_format: "jpeg", return_base64: true
        }
      }),
      signal: AbortSignal.timeout(25_000)
    });
    const result = await response.json() as { id?: string; error?: FashnError; message?: string };
    if (!response.ok || !result.id) return NextResponse.json({
      error: "The AI provider could not start the try-on.",
      detail: errorMessage(result.error ?? result.message ?? null, "Provider returned HTTP " + response.status + ".")
    }, { status: 502 });
    return NextResponse.json({ predictionId: result.id, provider: "FASHN", status: "processing" });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({
      error: timedOut ? "The AI provider took too long to respond." : "Could not reach the AI try-on provider.",
      detail: "Check the FASHN API status and server logs, then try again."
    }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI try-on is not configured. Add FASHN_API_KEY to server environment variables." }, { status: 503 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^[A-Za-z0-9_-]{8,160}$/.test(id)) return NextResponse.json({ error: "A valid prediction ID is required." }, { status: 400 });
  try {
    const response = await fetch(API_BASE + "/status/" + encodeURIComponent(id), {
      headers: { Authorization: "Bearer " + apiKey }, cache: "no-store",
      signal: AbortSignal.timeout(12_000)
    });
    const result = await response.json() as { status?: string; output?: string[]; error?: FashnError; message?: string };
    if (!response.ok) return NextResponse.json({ error: errorMessage(result.error ?? result.message ?? null, "Could not check try-on status.") }, { status: 502 });
    if (result.status === "completed" && result.output?.[0]) return NextResponse.json({ status: "completed", image: result.output[0] });
    if (result.status === "failed") return NextResponse.json({ status: "failed", error: errorMessage(result.error, "The provider could not generate this try-on. Try clearer photos.") });
    return NextResponse.json({ status: result.status ?? "processing" });
  } catch {
    return NextResponse.json({ error: "Could not check AI generation status. Please retry." }, { status: 502 });
  }
}
