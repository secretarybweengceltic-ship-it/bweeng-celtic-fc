"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

const ADMIN_EMAILS = ["pro.bweeng.celtic@gmail.com"];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // forgot password
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Keep user state updated (session persists automatically)
  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabaseBrowser().auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // ✅ Allow-list admins only
  useEffect(() => {
    if (!user) return;

    const userEmail = (user.email || "").toLowerCase();
    const allowed = ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(userEmail);

    if (!allowed) {
      supabaseBrowser().auth.signOut();
      setUser(null);
      alert("Access denied: this account is not an admin.");
    }
  }, [user]);

  async function signIn() {
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    setUser(null);
  }

  async function sendResetEmail() {
    const emailToUse = (resetEmail || email).trim();
    if (!emailToUse) return alert("Enter your email first.");

    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(emailToUse, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) return alert(error.message);

    setResetSent(true);
    alert("Password reset email sent. Check your inbox (and spam).");
  }

  // Show login if not signed in
  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-4">Admin Login</h1>

          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full mb-4"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
            onClick={signIn}
          >
            Log In
          </button>

          {/* Forgot password */}
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-bold text-[#0B2A6F]">Forgot your password?</p>

            <input
              className="mt-2 border p-2 rounded w-full"
              placeholder="Email for reset link"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button
              className="mt-2 w-full rounded-lg px-4 py-2 font-extrabold bg-[#0B2A6F] text-white"
              onClick={sendResetEmail}
            >
              Send Reset Email
            </button>

            {resetSent && (
              <p className="mt-2 text-xs text-slate-600">
                Reset email sent. Open the link in the email to set a new password.
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Dashboard
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Admin Dashboard</h2>
          <p className="mt-1 text-slate-600">Manage website content.</p>
          <p className="mt-1 text-xs text-slate-500">
            Logged in as <b>{user.email}</b>
          </p>
        </div>

        <button onClick={signOut} className="underline font-bold">
          Log out
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/gallery"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Gallery</h3>
          <p className="mt-2 text-slate-600">Upload, edit captions, and delete photos.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        <Link
          href="/admin/fixtures"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Fixtures</h3>
          <p className="mt-2 text-slate-600">Create, edit, and delete fixtures & results.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        <Link
          href="/admin/announcements"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Announcements</h3>
          <p className="mt-2 text-slate-600">Create, edit, and delete news posts.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        <Link
          href="/admin/committee"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Committee</h3>
          <p className="mt-2 text-slate-600">Add, edit, and update committee contacts.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

  <Link
  href="/admin/sponsors"
  className="bg-white border rounded-xl p-6 hover:shadow-md transition block"
>
  <h3 className="text-xl font-extrabold text-[#0B2A6F]">Sponsors</h3>
  <p className="mt-2 text-slate-600">
    Add / remove sponsor logos for the homepage bar.
  </p>
</Link>
      
<Link
  href="/admin/documents"
  className="bg-white border rounded-xl p-6 hover:shadow-md transition"
>
  <h3 className="text-lg font-extrabold text-[#0B2A6F]">Documents</h3>
  <p className="mt-2 text-slate-600">Upload PDF club documents.</p>
  <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
</Link>
        {/* ✅ NEW: Invoices */}
        <Link
          href="/admin/invoices"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Invoices</h3>
          <p className="mt-2 text-slate-600">Create and email PDF invoices.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        {/* ✅ NEW: Receipts (optional - add later) */}
        <Link
          href="/admin/receipts"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-lg font-extrabold text-[#0B2A6F]">Receipts</h3>
          <p className="mt-2 text-slate-600">Create and email PDF receipts.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>
      </div>
    </main>
  );
}