// src/app/login/layout.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login", // Nanti di browser jadinya: "Login | OSD Projects"
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
