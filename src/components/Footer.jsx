import Link from "next/link";

import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import { Brush } from "lucide-react";

export default function Footer({ links }) {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contactUs" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: InstagramLogoIcon,
      link: "https://www.instagram.com/tattvam_collective/",
    },
    {
      name: "LinkedIn",
      icon: LinkedInLogoIcon,
      link: "https://www.linkedin.com/company/tattvam-collective",
    },
   

   
  ];

  return (
    <footer className="bg-[#0f0e0c] text-[#e8e3da] px-5 sm:px-8 lg:px-10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-14 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-para-regular text-[3rem] sm:text-[3.6rem] font-light leading-none tracking-widest text-[#e8e3da] mb-5">
              Tattvam
              <br />
              Collective
            </h2>

            <p className="text-[#e8e3da]/60 text-[15px] leading-[1.8] max-w-70">
              Manifesting the essence of thoughtful design through architectural
              expression.
            </p>

            <div className="w-10 h-px bg-white/25 my-6" />

            <div className="inline-flex items-center gap-3 border border-white/15 px-4 py-2.5">
              <span className="w-2 h-2 bg-white/30 inline-block" />

              <span className="text-[11px] tracking-[0.16em] uppercase text-white/30">
                Est. 2017 · Vadodara, India
              </span>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="
                      w-10 h-10
                      border border-white/15
                      flex items-center justify-center
                      text-white/45
                      hover:text-white
                      hover:border-white/60
                      hover:bg-white/[0.03]
                      transition-all duration-300
                    "
                  >
                    {social.lucide ? (
                      <Icon size={17} strokeWidth={1.7} />
                    ) : (
                      <Icon className="w-[17px] h-[17px]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-6">
              Navigation
            </p>

            <div className="flex flex-col gap-4">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[15px] text-white/70 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-6">
              Services
            </p>

            <div className="flex flex-col gap-4">
              {[
                "Architecture & Interior Design",
                "BIM Consultancy & Visualization",
                "Tendering & Liaising",
                "Project Management",
                "Urban & City Planning",
              ].map((item) => (
                <a
                  key={item}
                  className="text-[15px] text-white/70 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-6">
              Get in Touch
            </p>

            {[
              {
                label: "Email",
                val: "hello@tatvacollective.com",
              },
              {
                label: "Phone",
                val: "+91 XXXX XXXX",
              },
              {
                label: "Studio",
                val: "Vadodara , Gujarat , India - 390001",
              },
            ].map(({ label, val }) => (
              <div key={label} className="mb-6">
                <span className="block text-[11px] tracking-[0.18em] uppercase text-white/35 mb-1">
                  {label}
                </span>

                <span className="text-[15px] text-white/65 whitespace-pre-line">
                  {val}
                </span>
              </div>
            ))}

            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-3">
              Newsletter
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-white/5 border border-white/15 text-[#e8e3da] text-[14px] px-4 py-3 placeholder:text-white/25 focus:outline-none focus:border-white/40"
              />

              <button className="bg-[#e8e3da] text-[#0f0e0c] text-[12px] tracking-[0.15em] uppercase px-5 py-3 font-medium hover:bg-white transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-white/30 tracking-wider">
              © {new Date().getFullYear()} Tattvam Collective. All rights reserved.
            </p>

            <div className="flex gap-8">
              {[
                { name: "Privacy", href: "/privacy" },
                { name: "Terms", href: "/terms" },
                { name: "Sitemap", href: "/sitemap" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[12px] text-white/30 hover:text-white/70 tracking-wider transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 border-t border-white/5">
            <a
              href="https://www.centrionyx.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-cormorant italic text-[14px] text-white/25 hover:text-white/60 tracking-widest transition duration-300 font-light"
            >
              Powered by Centrionyx
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}