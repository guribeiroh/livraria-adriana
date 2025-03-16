import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livraria Adriana",
  description: "Sua livraria online com os melhores títulos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CarrinhoProvider>
          <Navbar />
          <div className="pt-20 min-h-screen">
            {children}
          </div>
          <Footer />
        </CarrinhoProvider>
      </body>
    </html>
  );
}
