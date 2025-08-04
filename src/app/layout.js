import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import Cart from './components/Cart'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'

export const metadata = {
  title: 'E-Commerce Catalog',
  description: 'A modern e-commerce product catalog built with Next.js',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
}

function HeaderWrapper() {
  return <Header />
}

function FooterWrapper() {
  return <Footer />
}

function LoadingWrapper() {
  return <LoadingScreen />
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get saved theme from localStorage immediately
                  var savedTheme = localStorage.getItem('theme');
                  // Default to light mode (only use saved theme if explicitly set)
                  var theme = savedTheme || 'light';
                  
                  // Apply theme to html element immediately
                  var html = document.documentElement;
                  if (theme === 'dark') {
                    html.className = 'dark';
                    html.style.colorScheme = 'dark';
                    html.style.backgroundColor = 'rgb(3, 7, 18)';
                  } else {
                    html.className = '';
                    html.style.colorScheme = 'light';
                    html.style.backgroundColor = 'rgb(239, 246, 255)';
                  }
                  
                  // Store the theme
                  localStorage.setItem('theme', theme);
                } catch (e) {
                  // Fallback to light theme
                  document.documentElement.className = '';
                  document.documentElement.style.colorScheme = 'light';
                  document.documentElement.style.backgroundColor = 'rgb(239, 246, 255)';
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
        <ThemeProvider>
          <LoadingProvider>
            <AppProvider>
              <LoadingWrapper />
              <HeaderWrapper />
              <main>
                {children}
              </main>
              <FooterWrapper />
              <Cart />
            </AppProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}