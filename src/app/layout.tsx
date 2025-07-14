import { ThemeProvider } from "@/app/_components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { type Metadata, type Viewport } from "next";
import { Providers } from "./(frontend)/auth/providers";

// Enhanced metadata for better SEO and social sharing
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://replivity.com"),
  title: {
    default: "Replivity - AI Social Media Replier",
    template: "%s | Replivity",
  },
  description: "AI-powered social media response generator. Create engaging replies across platforms with advanced AI models, browser extensions, and real-time analytics.",
  keywords: [
    "AI social media",
    "automated replies",
    "social media management",
    "AI content generation",
    "browser extension",
    "social media automation",
  ],
  authors: [{ name: "Replivity Team" }],
  creator: "Replivity",
  publisher: "Replivity",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://replivity.com",
    siteName: "Replivity",
    title: "Replivity - AI Social Media Replier",
    description: "AI-powered social media response generator with multi-platform support and advanced analytics.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Replivity - AI Social Media Replier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Replivity - AI Social Media Replier",
    description: "AI-powered social media response generator with multi-platform support and advanced analytics.",
    images: ["/twitter-image.png"],
    creator: "@replivity",
  },
  alternates: {
    canonical: "https://replivity.com",
  },
};

// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Root layout component with enhanced accessibility and performance
/**
 * Defines the root layout for the application, including HTML structure and provider wrappers.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={GeistSans.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for common external resources */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Skip to main content
        </a>
        
        <TRPCReactProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="replivity-theme"
            >
              <main id="main-content" className="relative">
                {children}
              </main>
              
              {/* Toast notifications */}
              <Toaster
                position="bottom-right"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                  className: "font-sans",
                }}
              />
            </ThemeProvider>
          </Providers>
        </TRPCReactProvider>
        
        {/* Accessibility: Announce dynamic content changes */}
        <div
          id="announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  );
}
