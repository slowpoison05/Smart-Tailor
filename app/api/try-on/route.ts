import { NextResponse } from "next/server";

// Paid FASHN API calls are intentionally disabled in this free-first build.
function disabled() {
  return NextResponse.json({
    error: "Paid AI API integration disabled.",
    detail: "Smart Tailor no longer sends requests to FASHN's paid API. Configure NEXT_PUBLIC_FREE_TRYON_SPACE_URL to open your own free Hugging Face ZeroGPU Space. See free-tryon-space/README.md."
  }, { status: 410 });
}
export async function POST() { return disabled(); }
export async function GET() { return disabled(); }
