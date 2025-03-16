import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Livraria JessyKaroline",
  description: "Sua livraria online com os melhores títulos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-background text-primary-900 min-h-screen flex flex-col">
        <AuthProvider>
          <CarrinhoProvider>
            <Navbar />
            <div className="pt-20 flex-grow">
              {children}
            </div>
            <Footer />
          </CarrinhoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
