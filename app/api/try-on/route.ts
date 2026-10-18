import { NextResponse } from "next/server";

// Provider integration boundary. This endpoint deliberately does not fake a generated result.
export async function POST() {
  if (!process.env.TRYON_PROVIDER_URL || !process.env.TRYON_PROVIDER_API_KEY) {
    return NextResponse.json({
      error: "AI try-on is not configured yet.",
      detail: "Choose a provider and implement its validated server-side request adapter before processing photos."
    }, { status: 501 });
  }
  return NextResponse.json({
    error: "Provider adapter required.",
    detail: "Credentials are present, but provider-specific request handling and privacy controls must be implemented."
  }, { status: 501 });
}
