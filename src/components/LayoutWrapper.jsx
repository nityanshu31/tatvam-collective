// components/LayoutWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./Footer";
import { Menu, X, Home, FolderKanban, User, Mail } from "lucide-react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "About", href: "/about", icon: User },
    { name: "Contact", href: "/contactUs", icon: Mail },
  ];

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Routes that should NOT show header/footer
  const noLayoutRoutes = ['/dashboard', '/adminLogin'];
  const shouldHideLayout = noLayoutRoutes.some(route => 
    pathname?.startsWith(route)
  );

  // If it's a dashboard route, only render children
  if (shouldHideLayout) {
    return <>{children}</>;
  }

  // Public routes get full layout with header and footer
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-(--white) shadow-sm">
        <nav className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-semibold text-(--black)">
            Tatvam Collective
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 lg:gap-6 text-(--black)">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 hover:text-(--accent) transition text-sm lg:text-base"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-(--black)"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-(--white) border-t border-(--border)">
            <div className="px-4 py-4 space-y-3">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-(--black) hover:text-(--accent) transition py-2"
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 pt-15 sm:pt-17">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}