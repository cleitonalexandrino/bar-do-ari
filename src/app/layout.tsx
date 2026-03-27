import type { Metadata } from "next";
import { Karla, Playfair_Display_SC } from "next/font/google";
import "./globals.css";

const karla = Karla({ 
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display_SC({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bar do Ari | Delivery Premium",
  description: "O melhor da comida caseira da Vila Formosa, agora na sua mesa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${karla.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
