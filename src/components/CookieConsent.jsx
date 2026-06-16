// components/CookieConsent.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent-accepted");
    if (!consent) {
      // Show banner with a small delay for a smooth user experience
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-accepted", "true");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent-accepted", "false");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 rounded-2xl flex flex-col gap-4 text-[#111111]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            <h4 className="font-semibold text-base tracking-wide uppercase text-xs text-[#6B7280]">
              Cookie Consent
            </h4>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6B7280] leading-relaxed font-light">
          We use cookies to improve your browsing experience, analyze site traffic, and support our marketing efforts. By clicking "Accept", you agree to our use of cookies as outlined in our{" "}
          <Link href="/privacy" className="text-[#C6A77D] hover:underline font-medium">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-medium tracking-wider uppercase text-gray-500 hover:text-black transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 bg-black hover:bg-[#C6A77D] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Accept
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
