import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const metadata: Metadata = {
  title: "WM Duo™ — Premium CastleView Projector | #1 Fake Window",
  description: "CastleView™ Mini Projector with 210° rotation, 4K support & stunning castle window effect. #1 TikTok viral fake window projector. 12,000+ happy customers.",
  keywords: "castle projector, fake window projector, 210° rotating projector, mini smart projector, WM Duo, CastleView",
  openGraph: {
    title: "WM Duo™ — #1 CastleView Rotating Smart Projector",
    description: "Transform any room with the viral CastleView™ projector. 210° rotation, 4K support.",
    url: "https://wmduo.com",
    siteName: "WM Duo",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>🏰</text></svg>" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
