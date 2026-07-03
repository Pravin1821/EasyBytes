import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ usernameOrEmail, password });
      navigate("/chat");
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_transparent_60%)]"></div>
  <div className="relative z-10 flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-12 shadow-2xl shadow-blue-500/10 backdrop-blur">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-2xl shadow-lg">
            💬
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-100">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to continue the conversation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <label className="flex flex-col gap-2 text-base text-slate-300">
            Username or email
            <input
              required
              value={usernameOrEmail}
              onChange={(event) => setUsernameOrEmail(event.target.value)}
              placeholder="pravin@email.com"
              className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label className="flex flex-col gap-2 text-base text-slate-300">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full h-14 rounded-2xl border border-slate-800 bg-slate-950 px-8 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-base font-semibold text-white shadow-lg transition hover:from-blue-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
