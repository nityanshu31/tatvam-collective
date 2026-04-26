// components/LayoutWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "./Footer";
import { Menu, X, Home, FolderKanban, User, Mail } from "lucide-react";
import Image from "next/image";

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
  const noLayoutRoutes = ["/dashboard", "/adminLogin"];
  const shouldHideLayout = noLayoutRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  // If it's a dashboard route, only render children
  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Header - Enhanced with depth and glass effect */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_-1px_rgba(0,0,0,0.03)] border-b border-gray-100">
        <nav className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo - Added subtle hover effect */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold text-(--black) transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Image
              src="/logos/tatvam-logo-rectangle-noBg.png"
              alt="Tatvam Logo"
              width={120}
              height={40}
              className="transition-opacity duration-200 hover:opacity-90"
              priority
            />
          </Link>

          {/* Desktop Nav - Enhanced with premium hover effects */}
          <div className="hidden md:flex gap-1 lg:gap-2 text-(--black)">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative group flex items-center gap-2 px-3 lg:px-4 py-2 
                    text-sm lg:text-base font-medium
                    transition-all duration-200 ease-out
                    rounded-lg
                    ${isActive 
                      ? "text-(--accent)" 
                      : "text-(--black) hover:text-(--accent)"
                    }
                  `}
                >
                  <Icon className={`
                    w-4 h-4 transition-all duration-200 
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                  `} />
                  <span className="relative pb-0.5">
                    {item.name}
                    {/* Animated underline - now positioned at bottom */}
                    <span className={`
                      absolute -bottom-0.5 left-0 w-full h-0.5 
                      bg-(--accent) rounded-full
                      transition-all duration-200 ease-out
                      ${isActive 
                        ? "scale-x-100 opacity-100" 
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                      }
                    `} />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - Enhanced with hover effect */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-(--black) rounded-lg transition-all duration-200 hover:bg-(--accent)/5 hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-200 rotate-0" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu - Full screen overlay with animations */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300 ease-out
          ${mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`
            absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl
            transition-transform duration-300 ease-out
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Image
              src="/logos/tatvam-logo-rectangle-noBg.png"
              alt="Tatvam Logo"
              width={100}
              height={34}
              className="opacity-90"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-(--black) rounded-lg transition-all duration-200 hover:bg-(--accent)/5 hover:scale-105 active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Links with animations */}
          <div className="flex flex-col p-6 space-y-2">
            {links.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    group flex items-center gap-4 px-4 py-4
                    text-lg font-medium rounded-xl
                    transition-all duration-300 ease-out
                    transform
                    ${mobileMenuOpen 
                      ? "translate-x-0 opacity-100" 
                      : "translate-x-8 opacity-0"
                    }
                    ${isActive 
                      ? "text-(--accent) bg-(--accent)/10" 
                      : "text-(--black) hover:text-(--accent) hover:bg-(--accent)/5 hover:pl-6"
                    }
                  `}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms"
                  }}
                >
                  <Icon className={`
                    w-6 h-6 transition-all duration-200 
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                  `} />
                  <span className="font-semibold">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-(--accent)" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main - Adjusted padding for smoother experience */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <Footer />
    </>
  );
}