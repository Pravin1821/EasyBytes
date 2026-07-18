import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base flex flex-col items-center justify-center p-6 text-center">
      {/* Background blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-ember/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ember-dim border border-ember/30">
          <span className="font-display text-2xl font-bold text-ember">404</span>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Lost in transit
          </h1>
          <p className="mt-3 text-sm text-text-muted leading-relaxed">
            This space doesn't exist. It might have decayed, or it was never created in the first place. Nothing stays forever.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-ember px-6 text-base font-semibold text-bg-base shadow-lg shadow-ember/20 transition hover:brightness-110"
        >
          Return to safety
        </Link>
      </div>
    </div>
  );
}
