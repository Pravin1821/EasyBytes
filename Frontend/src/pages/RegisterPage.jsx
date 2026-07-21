import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DecayPreview() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const runCycle = () => {
      el.style.transition = "none";
      el.style.width = "100%";
      void el.offsetWidth;
      el.style.transition = "width 6000ms linear";
      el.style.width = "0%";
    };
    runCycle();
    const loop = setInterval(runCycle, 6000);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-faint font-mono font-semibold">
        <span className="text-text-primary">you</span>
        <span className="h-1 w-1 rounded-full bg-cyan"></span>
        <span>just now</span>
      </div>
      <p className="mt-2 text-sm text-text-primary">
        This message disappears in a few seconds — try it.
      </p>
      <div className="mt-3.5 h-[3px] w-full overflow-hidden rounded-full bg-bg-base/60">
        <div ref={barRef} className="h-full rounded-full bg-ember shadow-[0_0_6px_var(--color-ember)]" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    displayName: "",
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
    <div className="relative min-h-screen overflow-hidden bg-bg-base flex items-center justify-center p-4">
      {/* Background blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-ember/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-border-subtle bg-bg-surface shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* Left Form Column */}
        <div className="flex flex-col p-8 sm:p-10 md:p-12 justify-between gap-8 min-h-[500px]">
          {/* Logo & Header Group */}
          <div className="flex flex-col gap-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember-dim border border-ember/25">
              <span className="font-display text-lg font-bold text-ember">E</span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-text-primary leading-tight">
                Create your space
              </h1>
              <p className="mt-1.5 text-sm text-text-muted">
                Join the conversation. Nothing here overstays its welcome.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 justify-center">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-xs text-danger"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-cyan/25 bg-cyan/10 px-4 py-3 text-xs text-cyan"
              >
                {success}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Username <span className="text-ember font-bold">*</span>
                </span>
                <input
                  required
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="pravin21"
                  className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition duration-150 focus:border-ember focus:ring-2 focus:ring-ember/10"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Display name
                </span>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  placeholder="Pravin"
                  className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition duration-150 focus:border-ember focus:ring-2 focus:ring-ember/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Email <span className="text-ember font-bold">*</span>
              </span>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition duration-150 focus:border-ember focus:ring-2 focus:ring-ember/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Password <span className="text-ember font-bold">*</span>
              </span>
              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="h-12 w-full rounded-xl border border-border-subtle bg-bg-base px-4 text-sm text-text-primary outline-none transition duration-150 focus:border-ember focus:ring-2 focus:ring-ember/10"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-12 rounded-xl bg-ember text-sm font-semibold text-bg-base shadow-lg shadow-ember/15 transition duration-150 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-faint disabled:shadow-none"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          {/* Form Footer Link */}
          <p className="text-xs text-text-muted">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-ember hover:brightness-110 underline decoration-ember/30 underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Info Column */}
        <div className="hidden lg:flex flex-col p-8 sm:p-10 md:p-12 border-l border-border-subtle bg-bg-base/35">
          <div className="flex flex-col justify-center gap-6 flex-1">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary leading-tight">
                Every message has a lifespan
              </h2>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                No permanent history. No accidental paper trail. Messages burn
                down on their own schedule — set by you, not by us.
              </p>
            </div>
            <DecayPreview />
          </div>
        </div>
      </div>
    </div>
  );
}