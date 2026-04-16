"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      router.push(data.redirect);
    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--white)] flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-[var(--border)] rounded-2xl p-8 shadow-sm bg-[var(--white)]">
        <div className="mb-8 text-center">
          <p className="text-[var(--accent)] uppercase tracking-[0.2em] text-sm mb-2">
            Tatvam Collective
          </p>

          <h1 className="text-3xl font-semibold text-[var(--black)]">
            Admin Login
          </h1>

          <p className="text-[var(--muted)] mt-2 text-sm">
            Access the content management dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--black)]">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@tatvam.com"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[var(--black)]">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--black)] text-[var(--white)] py-3 rounded-lg hover:bg-[var(--accent)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}