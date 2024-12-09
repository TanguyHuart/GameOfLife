
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientOnlyWrapper from "@/context/ClientOnlyWrapper";
import { MusicProvider } from "@/context/MusicContext";
import Head from "next/head";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const pixelFont = localFont({
  src: "./fonts/PixelifySans-VariableFont_wght.ttf",
  variable : "--font-pixel-sans",
  weight : "400 700"
})

export const metadata: Metadata = {
  title: "Glowtopia",
  description: "Glowtopia is a remake of the game of life created by John Conway in 1970. Used to be originaly a mathematical simulation, this version purpose to have fun to create, test, and see how artificial life can pop in this neo-style environnement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon.ico" />  
      </Head>
            <body className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable}`}>
              <ClientOnlyWrapper>
                <MusicProvider>
                  {children}
                </MusicProvider>
              </ClientOnlyWrapper>
            </body>

    </html>
  );
}
