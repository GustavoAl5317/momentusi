import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Momenta - Linha do Tempo de Momentos Especiais',
  description: 'Crie e compartilhe linhas do tempo de momentos importantes. Presente digital permanente.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-slate-950 text-gray-100`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

