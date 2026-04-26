import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ChatbotWidget from "./components/ChatbotWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodAI – Your Smart Food Guide",
  description:
    "Discover Cameroonian dishes, get personalised meal recommendations powered by AI, and chat with your food assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <ChatbotWidget />
        </body>
      </html>
    </ClerkProvider>
  );
}
