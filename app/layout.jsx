import './globals.css'

export const metadata = {
  title: 'Timebars Help Assistant',
  description: 'AI-powered help for Timebars, Agilebars, and Costbars — answers drawn from official documentation.',
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
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
