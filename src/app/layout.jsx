import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./Providers";
import Script from "next/script";
import "./globals.css";
import Schemas from "./Schemas";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: {
    default: "BerlinGonzalez Shop",
    template: "%s - BerlinGonzalez Shop",
  },
  description: "Buy Fortnite vbucks on BerlinGonzalez Shop",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon/favicon-16x16.png"
        />
        <link rel="manifest" href="/icon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/icon/safari-pinned-tab.svg"
          color="#000000"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.webp`}
        />
        <meta property="og:type" content="website" />
        <meta name="cryptomus" content="0be6b7a2" />
        <Schemas />
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Organization",
            name: "BerlinGonzalez Shop",
            url: process.env.NEXT_PUBLIC_APP_URL,
            logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.webp`,
            sameAs: [
              "https://www.twitch.tv/berlingonzalezs",
              "https://www.tiktok.com/@berlingonzalezz",
              "https://www.youtube.com/channel/UCOZatRE8I2AsF8NXaQwCiqA",
            ],
          })}
        </Script>
      </head>

      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
