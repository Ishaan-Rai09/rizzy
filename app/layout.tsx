import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { AppSessionProvider } from "@/components/session-provider"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RIZZ AI — Dating Reply Assistant",
  description: "Generate confident, human replies, openers, and bios in seconds.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased flex flex-col min-h-screen`}>
        <AppSessionProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AppSessionProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#141414",
              color: "#f4f4f5",
              border: "1px solid #242424",
            },
          }}
        />
      </body>
    </html>
  )
}
