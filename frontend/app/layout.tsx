import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { SubmissionProvider } from "@/contexts/submission-context";
import { UnderDevelopmentProvider } from "@/components/ui/under-development";

/* ── Typography ──────────────────────────────────────────────
   Playfair Display  → headings (authoritative, academic)
   DM Sans           → body (clean, readable)
   Geist Mono        → code, IDs, hashes, encrypted strings
──────────────────────────────────────────────────────────── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vault",
    template: "%s · Vault",
  },
  description: "Zero-Trust Academic Submission System",
  keywords: ["academic", "submission", "encrypted", "zero-trust", "secure"],
  authors: [{ name: "Ismail" }],
  metadataBase: new URL("https://vault.edu"),
  openGraph: {
    title: "Vault",
    description: "Zero-Trust Academic Submission System",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AuthProvider>
          <SubmissionProvider>
            {" "}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              <UnderDevelopmentProvider>{children}</UnderDevelopmentProvider>
              <Toaster richColors closeButton />
            </ThemeProvider>
          </SubmissionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
