export default function Footer({ links }) {
  return (
    <footer className="bg-[#0f0e0c] text-[#e8e3da] px-5 sm:px-8 lg:px-10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-14 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* ONLY HEADING = CORMORANT */}
            <h2 className="font-cormorant text-[3rem] sm:text-[3.6rem] font-light leading-none tracking-widest text-[#e8e3da] mb-5">
              Tatvam
              <br />
              Collective
            </h2>

            {/* DEFAULT FONT (bigger text) */}
            <p className="text-[#e8e3da]/60 text-[15px] leading-[1.8] max-w-70">
              Designing timeless architectural experiences through thoughtful
              spaces and modern aesthetics.
            </p>

            <div className="w-10 h-px bg-white/25 my-6" />

            <div className="inline-flex items-center gap-3 border border-white/15 px-4 py-2.5">
              <span className="w-2 h-2 bg-white/30 inline-block" />
              <span className="text-[11px] tracking-[0.16em] uppercase text-white/30">
                Est. XXXX · Vadodara, India
              </span>
            </div>

            <div className="flex gap-4 mt-6">
              {["Ig", "Ln", "Pt", "Bh"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9.5 h-9.5 border border-white/20 flex items-center justify-center text-[13px] text-white/50 hover:border-white/70 hover:text-white transition-all duration-300"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-6">
              Navigation
            </p>

            <div className="flex flex-col gap-4">
              {["Home", "Projects", "Studio", "About", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[15px] text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-[12px] tracking-[0.2em] uppercase text-white/35 mb-6">
              Services
            </p>

            <div className="flex flex-col gap-4">
              {[
                "Residential",
                "Commercial",
                "Interior Design",
                "Urban Planning",
                "Consultation",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
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
              { label: "Email", val: "hello@tatvacollective.com" },
              { label: "Phone", val: "+91 XXXX XXXX" },
              {
                label: "Studio",
                val: "Navrangpura, Ahmedabad\nGujarat 380009",
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
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-white/30 tracking-wider">
            © {new Date().getFullYear()} Tatva Collective. All rights reserved.
          </p>

          <div className="flex gap-8">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] text-white/30 hover:text-white/70 tracking-wider transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
