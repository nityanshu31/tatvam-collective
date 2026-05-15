// app/layout.js
import "./globals.css";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-cormorant",
});

export const metadata = {
  title: "Tattvam Collective",
  description: "Architect Portfolio",
};

const myFont = localFont({
  src: "../fonts/AbadiMT-Light.woff2",
 
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body
  className={`${myFont.className} min-h-full flex flex-col bg-(--white) text-(--black)`}
>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}