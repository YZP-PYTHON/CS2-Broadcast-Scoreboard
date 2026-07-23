
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`min-h-full antialiased`}
    >
      <body className="w-screen h-screen flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
