import type { Metadata } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Recorrido Virtual 360° | Nuevo Imperial',
  description: 'Explora los sitios turísticos de Nuevo Imperial en un recorrido virtual 360°.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
