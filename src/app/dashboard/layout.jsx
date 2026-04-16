"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { label: "Overview", href: "/dashboard" },
    { label: "Hero Section", href: "/dashboard/hero" },
    { label: "Projects", href: "/dashboard/projects" },
    { label: "Contact Queries", href: "/dashboard/queries" },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/adminLogin");
  };

  return (
    <div className="min-h-screen bg-[var(--white)] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-full w-72 bg-[var(--black)] text-[var(--white)]
          transform transition-transform duration-300 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Tatvam Admin</h2>
          <p className="text-sm text-white/60 mt-1">Content Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-white/10 transition"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-red-500/20 text-left transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--white)] sticky top-0 z-30">
          <button
            className="lg:hidden text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-lg font-semibold text-[var(--black)]">
            Dashboard
          </h1>

          <div className="text-sm text-[var(--muted)]">Admin Panel</div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}   