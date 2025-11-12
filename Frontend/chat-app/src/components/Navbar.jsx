import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-xl font-semibold shadow-lg">
            💬
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight">Vibe Chat</p>
            <p className="text-xs text-slate-400">
              Connected as{" "}
              <span className="font-medium text-slate-200">
                {user?.displayName || user?.username}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-slate-200">
              {user?.displayName || user?.username}
            </span>
            <span className="text-xs text-slate-500">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
