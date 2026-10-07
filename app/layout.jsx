import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'
import { AuthProvider } from '@/auth/components/AuthProvider'
import AppNavbar from '@/components/AppNavbar'
import { FRONTEND_URL } from '@/config/site'

export const metadata = {
  metadataBase: new URL(FRONTEND_URL),
  title: {
    default: 'Timebars Cloud – Dashboards, Pubsets and AI Help for Timebars Ltd. Customers',
    template: '%s | Timebars Cloud',
  },
  description:
    'Timebars Cloud is the customer site for Agilebars, Timebars and Costbars: the Enterprise Dashboard, published pubsets, text notifications and an AI help assistant that answers from the official documentation.',
  openGraph: {
    title: 'Timebars Cloud',
    description: 'Enterprise Dashboard, pubsets, notifications and AI help for Agilebars, Timebars and Costbars customers.',
    url: '/',
    siteName: 'Timebars Cloud',
    images: [{ url: '/images/timebars-ltd-logo-final.png', alt: 'Timebars Ltd.' }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Timebars Cloud',
    description: 'Enterprise Dashboard, pubsets, notifications and AI help for Timebars Ltd. customers.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <AuthProvider>
          <AppNavbar />
          <main>{children}</main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
