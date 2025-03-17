import type { Metadata } from "next";
import { Inter, Merriweather, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotificacaoCarrinho from './components/NotificacaoCarrinho';
import FloatingCartButton from './components/FloatingCartButton';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-merriweather',
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: "Livraria JessyKaroline | Sua Jornada Literária Começa Aqui",
  description: "Descubra uma seleção cuidadosa dos melhores livros nacionais e internacionais, com curadoria para todos os gostos literários.",
  keywords: "livraria, livros, literatura, leitura, comprar livros, ebooks, livros online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable} ${playfairDisplay.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-background text-primary-900 min-h-screen flex flex-col relative selection:bg-primary-200 selection:text-primary-900 overflow-x-hidden">
        <AuthProvider>
          <CarrinhoProvider>
            <ToastProvider>
              {/* Efeito decorativo */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-400 z-50"></div>
              
              <Navbar />
              <NotificacaoCarrinho />
              <main className="pt-20 flex-grow">
                {children}
              </main>
              <Footer />
              <FloatingCartButton />
            </ToastProvider>
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}