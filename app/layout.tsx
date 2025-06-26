import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portafolio',
  description: 'Desarrollado por Zelen',
  generator: 'Zelen',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="favicon_io\favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
