import { Pacifico } from "next/font/google"
import "./globals.css"
import Appbar from "@/components/Appbar"
import { Toaster } from "sonner"
import AuthProvider from "@/components/providers/SessionProviders"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
})

export const metadata = {
  title: "DevHub",
  description: "Developer community platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${pacifico.variable} antialiased`}>
        <AuthProvider>
        <Appbar />
        {children}
        <Toaster richColors position="top-right"/>
        </AuthProvider>
      </body>
    </html>
  )
}
