import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";
import CartSidebar from "@/components/cart/CartSidebar";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Rooftop Restaurant | Dining Under the Stars",
  description: "Experience the best rooftop dining in Kahalgaon. Authentic cuisine, stunning views, and an unforgettable evening ambiance.",
};

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ReduxProvider>
          <LanguageProvider>
            <SettingsProvider>
              {children}
              <CartSidebar />
            </SettingsProvider>
          </LanguageProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
