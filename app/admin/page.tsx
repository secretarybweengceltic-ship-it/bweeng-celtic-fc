"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Admin() {
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function post() {
    const { error } = await supabase.from("announcements").insert({
      title,
      content,
      category,
      published: true,
    });

    if (error) return alert(error.message);

    alert("Posted!");
    setTitle("");
    setContent("");
    setCategory("General");
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-4">Admin Login</h1>

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
            className="w-full rounded-lg px-4 py-2 font-extrabold"
            style={{ background: "var(--club-yellow)", color: "var(--club-blue-dark)" }}
            onClick={signIn}
          >
            Log In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-2xl bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--club-blue-dark)" }}>
            Admin Panel
          </h1>
          <button className="underline" onClick={signOut}>Log out</button>
        </div>

        <div className="text-sm text-slate-600 mb-6">
          Logged in as <b>{user.email}</b>
        </div>

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full mb-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="border p-2 rounded w-full mb-3"
          placeholder="Content"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="rounded-lg px-4 py-2 font-extrabold"
          style={{ background: "var(--club-yellow)", color: "var(--club-blue-dark)" }}
          onClick={post}
        >
          Post Announcement
        </button>
      </div>
    </main>
  );
}
