import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Smart Tailor — Virtual Fitting Studio",
  description: "A digital fitting workspace for women's blouses, salwar suits, dresses and gowns."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
