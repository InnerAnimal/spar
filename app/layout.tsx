import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { ModalProvider } from "@/contexts/ModalContext"
import ModalManager from "@/components/ModalManager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Southern Pets Animal Rescue | Every Animal Deserves a Loving Home | Acadia Parish",
  description: "Southern Pets Animal Rescue serving Acadia Parish, Louisiana. Help us rescue, rehabilitate, and rehome dogs and cats in need. Adoption and TNR services available.",
  keywords: "Southern Pets Animal Rescue, animal rescue, Acadia Parish, dog adoption, cat adoption, rescue dogs, rescue cats, Louisiana animal rescue, TNR services",
  openGraph: {
    type: "website",
    url: "https://www.southernpetsanimalrescue.org/",
    title: "Southern Pets Animal Rescue | Every Animal Deserves a Loving Home",
    description: "Southern Pets Animal Rescue serving Acadia Parish. Help us rescue, rehabilitate, and rehome animals in need.",
    siteName: "Southern Pets Animal Rescue",
  },
  twitter: {
    card: "summary_large_image",
    title: "Southern Pets Animal Rescue",
    description: "Animal rescue serving Acadia Parish",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ModalManager />
        </ModalProvider>
      </body>
    </html>
  )
}
