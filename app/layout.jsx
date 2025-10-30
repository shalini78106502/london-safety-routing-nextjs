import '../globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ClientWrapper from '../components/ClientWrapper'

export const metadata = {
  title: 'London Safety Routing System',
  description: 'Find safer routes across London with intelligent routing, community insights, and real-time hazard awareness.',
  icons: {
    icon: '/img/logo.png',
    shortcut: '/img/logo.png',
    apple: '/img/logo.png',
  },
  openGraph: {
    title: 'London Safety Routing System',
    description: 'Find safer routes across London with intelligent routing, community insights, and real-time hazard awareness.',
    images: ['/img/logo.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ClientWrapper>
          <main className="min-h-screen animate-fadeIn">{children}</main>
        </ClientWrapper>
        <Footer />
      </body>
    </html>
  )
}
