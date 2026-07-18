import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-bg-surface/85 backdrop-blur-md border-b border-border-subtle sticky top-0 z-45 w-full shrink-0">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ember-dim border border-ember/25">
            <span className="font-display text-base font-bold text-ember">E</span>
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-text-primary">
              Ephemeral
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              Signed in as{" "}
              <span className="font-semibold text-text-primary">
                {user?.displayName || user?.username}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-text-primary">
              {user?.displayName || user?.username}
            </span>
            <span className="text-[10px] text-text-faint font-mono">
              {user?.email}
            </span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-bg-elevated px-3.5 py-1.5 text-xs font-semibold text-text-primary border border-border-subtle transition hover:bg-danger/10 hover:text-danger hover:border-danger/25 active:scale-[0.96] cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}