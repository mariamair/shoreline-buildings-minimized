/**
 * Defines the layout for the home page.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { Geist, Geist_Mono } from 'next/font/google'
import Footer from '@/components/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Shoreline buildings',
  description: 'Visualization of shoreline buildings in Sweden',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  )
}
