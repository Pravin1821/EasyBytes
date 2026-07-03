import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    displayName: "pravin",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await register(form);
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.details?.username ||
        err?.response?.data?.details?.email ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#0f172a,_transparent_60%)]"></div>
  <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-14 shadow-2xl shadow-emerald-500/10 backdrop-blur">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-2xl shadow-lg">
            ✨
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-100">
            Create your space
          </h1>
          <p className="text-sm text-slate-500">
            Join the conversation with a shiny new profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-base text-slate-300">
              Username
              <input
                required
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder=""
                className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="flex flex-col gap-2 text-base text-slate-300">
              Display name (optional)
              <input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                placeholder=""
                className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-base text-slate-300">
            Email
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <label className="flex flex-col gap-2 text-base text-slate-300">
            Password
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-base font-semibold text-white shadow-lg transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already a member?{" "}
          <Link
            to="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
