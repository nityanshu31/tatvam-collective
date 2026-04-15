"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "projects" },
    { name: "About", href: "about" },
    { name: "Contact", href: "contactUs" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden flex flex-col gap-1.25 cursor-pointer z-50"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-(--black) transition-all duration-300 ${
            open ? "rotate-45 translate-y-1.75" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-(--black) transition-all duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-(--black) transition-all duration-300 ${
            open ? "-rotate-45 -translate-y-1.75" : ""
          }`}
        />
      </button>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-(--white) overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 border-b border-(--border)" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 pb-4 pt-2 gap-1 text-(--black)">
          {links.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="hover:text-(--accent) transition py-2 border-b border-(--border) last:border-0 text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}