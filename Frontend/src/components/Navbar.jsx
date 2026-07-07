import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-bg-surface border-b border-border-subtle">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember-dim border border-ember/30">
            <span className="font-display text-lg font-semibold text-ember">E</span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-text-primary">
              Ephemeral
            </p>
            <p className="text-xs text-text-muted">
              Signed in as{" "}
              <span className="font-medium text-text-primary">
                {user?.displayName || user?.username}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-text-primary">
              {user?.displayName || user?.username}
            </span>
            <span className="text-xs text-text-faint">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-bg-elevated px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-danger/20 hover:text-danger border border-border-subtle"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}