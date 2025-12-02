import React, { useState } from "react";
import { X, Lock, User } from "lucide-react";
import { ADMIN_CREDENTIALS } from "../data/adminConfig";

export default function AdminLoginModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, password } = ADMIN_CREDENTIALS;

    if (
      form.username.trim() === username &&
      form.password === password
    ) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("rr_admin_authed", "1");
      }
      onSuccess?.();
      onClose?.();
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Admin Login
              </h2>
              <p className="text-[11px] text-slate-500">
                Enter your admin credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30 text-sm"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="block w-full rounded-lg border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/30 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Login"}
          </button>

          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Frontend-only admin login (static credentials).
          </p>
        </form>
      </div>
    </div>
  );
}
