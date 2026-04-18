"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Mail Sent Successfully")
        

        setFormData({
          name: "",
          email: "",
          projectType: "",
          message: "",
        });
      } else {
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--white)] text-[var(--black)] px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left Content */}
        <div>
          <p className="text-[var(--accent)] uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Contact Us
          </p>

          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            Let’s Design Something Timeless Together
          </h1>

          <p className="text-[var(--muted)] text-lg leading-relaxed max-w-xl mb-10">
            Whether you're planning a residential masterpiece, commercial
            landmark, or interior transformation — we’d love to hear about your
            vision.
          </p>

          <div className="space-y-5">
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-[var(--muted)]">hello@tatvacollective.com</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Phone</h4>
              <p className="text-[var(--muted)]">+91 XXXXX XXXXX</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Studio</h4>
              <p className="text-[var(--muted)]">
                 Vadodara, Gujarat, India
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[var(--white)] border border-[var(--border)] p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full border border-[var(--border)] px-4 py-3 rounded-lg outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-[var(--border)] px-4 py-3 rounded-lg outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project Type
              </label>
              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="Residential / Commercial / Interior"
                required
                className="w-full border border-[var(--border)] px-4 py-3 rounded-lg outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                required
                className="w-full border border-[var(--border)] px-4 py-3 rounded-lg outline-none focus:border-[var(--accent)] transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--black)] text-[var(--white)] py-3 rounded-lg hover:bg-[var(--accent)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}