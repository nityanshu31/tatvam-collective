import "./globals.css";
import MobileMenu from "@/components/MobileMenu";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  title: "Tatva Collective",
  description: "Architect Portfolio",
};

export default function RootLayout({ children }) {
  const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "projects" },
    { name: "About", href: "about" },
    { name: "Contact", href: "contactUs" },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-(--white) text-(--black)">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-(--white) shadow-sm">
          <nav className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            {/* Logo */}
            <h5 className="text-lg sm:text-xl font-semibold text-(--black)">
              Tatvam Collective
            </h5>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-4 lg:gap-6 text-(--black)">
              {links.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="hover:text-(--accent) transition text-sm lg:text-base"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </nav>
        </header>

        {/* Main */}
        <main className="flex-1 pt-15 sm:pt-17">
          {children}

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
