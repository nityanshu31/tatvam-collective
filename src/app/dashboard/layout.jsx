"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image, 
  FolderKanban, 
  MessageSquare,
  LogOut,
  X
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Scalable navigation config
  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Hero Section", href: "/dashboard/hero", icon: Image },
    { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { label: "Contact Queries", href: "/dashboard/queries", icon: MessageSquare },
  ];

  // ✅ Page titles (scalable)
  const pageTitles = {
    "/dashboard": "Overview",
    "/dashboard/hero": "Hero Section",
    "/dashboard/projects": "Projects",
    "/dashboard/queries": "Contact Queries",
  };

  const getTitle = () => {
    // Exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }
    
    // Check for dynamic routes (e.g., /dashboard/projects/123)
    const match = Object.keys(pageTitles).find(
      (route) => pathname !== route && pathname.startsWith(`${route}/`)
    );
    
    return pageTitles[match] || "Dashboard";
  };

  // ✅ Correct active route logic - fixed for root dashboard
  const isActiveRoute = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // ✅ Logout with better error handling and state management
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Logout failed");
      }

      // Clear any client-side storage if needed
      localStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminAuth");
      
      // Redirect to login page
      router.push("/adminLogin");
      router.refresh(); // Force refresh to clear any server-side state
    } catch (err) {
      console.error("Logout error:", err);
      alert(err.message || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ✅ ESC key support
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    // Prevent body scroll when sidebar is open on mobile
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // ✅ Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex bg-[var(--white,#fff)]">
      {/* 🔹 Overlay - improved with better accessibility */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          role="button"
          tabIndex={-1}
        />
      )}

      {/* 🔹 Sidebar - improved accessibility */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-72
          bg-[var(--black,#000)] text-[var(--white,#fff)]
          transform transition-transform duration-300 ease-in-out will-change-transform
          flex flex-col shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        aria-label="Sidebar navigation"
      >
        {/* Logo and Close Button */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tatvam</h2>
            <p className="text-sm opacity-60 mt-1">Dashboard</p>
          </div>
          
          {/* Close button - only visible on mobile */}
          <button
            aria-label="Close sidebar"
            className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-[var(--accent,#6366f1)] text-white shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            aria-label="Logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${isLoggingOut 
                ? "text-white/40 cursor-not-allowed" 
                : "text-white/70 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Fixed at top */}
        <header className="h-16 border-b border-gray-200 flex items-center px-4 md:px-6 bg-[var(--white,#fff)] flex-shrink-0 shadow-sm">
          {/* Mobile Menu Button - improved styling */}
          <button
            aria-label="Open sidebar"
            className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800">
              {getTitle()}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">Admin Panel</span>
             
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable area */}
        <main className="flex-1 overflow-y-auto p-0 md:p-0 lg:p-0 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}