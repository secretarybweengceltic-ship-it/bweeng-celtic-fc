"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [saving, setSaving] = useState(false);

  async function updatePassword() {
    if (pw1.length < 8) return alert("Password must be at least 8 characters.");
    if (pw1 !== pw2) return alert("Passwords do not match.");

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setSaving(false);

    if (error) return alert(error.message);

    alert("Password updated! You can now log in.");
    window.location.href = "/admin";
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="bg-white border rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-2">Reset Password</h1>
        <p className="text-sm text-slate-600">
          Enter a new password below. (You must have opened this page from the reset email.)
        </p>

        <input
          className="mt-4 border p-2 rounded w-full"
          type="password"
          placeholder="New password (min 8 characters)"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
        />

        <input
          className="mt-2 border p-2 rounded w-full"
          type="password"
          placeholder="Confirm new password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />

        <button
          className="mt-4 w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
          onClick={updatePassword}
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Password"}
        </button>

        <Link href="/admin" className="mt-4 block text-center underline font-bold">
          Back to Admin Login
        </Link>
      </div>
    </main>
  );
}
