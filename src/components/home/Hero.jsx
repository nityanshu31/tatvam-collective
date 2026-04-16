"use client";

import { useState } from "react";

export default function Hero({
  imageUrl,
  title,
  subtitle,
}) {
  const [position, setPosition] = useState(50);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPosition(x);
  };

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Mobile */}
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />

      {/* Desktop Grayscale */}
      <img
        src={imageUrl}
        alt={title}
        className="hidden md:block absolute inset-0 w-full h-full object-cover grayscale"
      />

      {/* Desktop Hover Reveal */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: `linear-gradient(
            90deg,
            transparent ${Math.max(position - 20, 0)}%,
            black ${position}%,
            transparent ${Math.min(position + 20, 100)}%
          )`,
          WebkitMaskImage: `linear-gradient(
            90deg,
            transparent ${Math.max(position - 20, 0)}%,
            black ${position}%,
            transparent ${Math.min(position + 20, 100)}%
          )`,
          transition: "all 0.1s ease-out",
        }}
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 text-white max-w-5xl">
        <p className="text-[var(--accent)] uppercase tracking-[0.25em] text-sm mb-4">
          Tatvam Collective
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          {title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}