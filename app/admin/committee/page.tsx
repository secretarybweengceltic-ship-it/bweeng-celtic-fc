"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export default function AdminCommitteePage() {
  const [user, setUser] = useState<any>(null);

  // form
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [sortOrder, setSortOrder] = useState("100");
  const [active, setActive] = useState(true);

  // list/edit
  const [members, setMembers] = useState<Member[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setRole("");
    setEmail("");
    setSortOrder("100");
    setActive(true);
  }

  async function loadMembers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    setLoading(false);

    if (error) {
      console.log("loadMembers error:", error);
      alert(error.message);
      return;
    }

    setMembers((data ?? []) as Member[]);
  }

  useEffect(() => {
    if (user) loadMembers();
  }, [user]);

  async function addMember() {
    if (!name.trim() || !role.trim() || !email.trim()) {
      return alert("Please fill Name, Role and Email.");
    }

    const so = Number(sortOrder);
    if (Number.isNaN(so)) return alert("Sort order must be a number.");

    const { error } = await supabase.from("committee_members").insert({
      name,
      role,
      email,
      sort_order: so,
      active,
    });

    if (error) {
      console.log("addMember error:", error);
      alert(error.message);
      return;
    }

    resetForm();
    loadMembers();
    alert("Added!");
  }

  function startEdit(m: Member) {
    setEditingId(m.id);
    setName(m.name);
    setRole(m.role);
    setEmail(m.email);
    setSortOrder(String(m.sort_order ?? 100));
    setActive(!!m.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit() {
    if (!editingId) return;

    if (!name.trim() || !role.trim() || !email.trim()) {
      return alert("Please fill Name, Role and Email.");
    }

    const so = Number(sortOrder);
    if (Number.isNaN(so)) return alert("Sort order must be a number.");

    const { error } = await supabase
      .from("committee_members")
      .update({
        name,
        role,
        email,
        sort_order: so,
        active,
      })
      .eq("id", editingId);

    if (error) {
      console.log("saveEdit error:", error);
      alert(error.message);
      return;
    }

    resetForm();
    loadMembers();
    alert("Saved!");
  }

  async function deleteMember(id: string) {
    if (!confirm("Delete this committee member?")) return;

    const { error } = await supabase.from("committee_members").delete().eq("id", id);

    if (error) {
      console.log("deleteMember error:", error);
      alert(error.message);
      return;
    }

    loadMembers();
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-2">Committee Admin</h1>
          <p className="text-slate-600">Please log in on the main Admin page first.</p>

          <Link href="/admin" className="mt-4 inline-block underline font-bold text-[#0B2A6F]">
            Back to Admin Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-[#0B2A6F]">Committee</h1>
            <Link href="/admin" className="text-sm font-bold underline text-[#0B2A6F]">
              Back to Dashboard
            </Link>
          </div>

          <p className="mt-1 text-slate-600">Add, edit, and update committee contacts.</p>
        </div>

        <button className="underline font-bold" onClick={loadMembers}>
          Refresh
        </button>
      </div>

      {/* Form */}
      <div className="mt-6 bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-extrabold text-[#0B2A6F]">
          {editingId ? "Edit Member" : "Add Member"}
        </h2>

        <div className="mt-4 grid gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Role (Chairperson, Secretary...)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">
                Sort order (lower = higher)
              </label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="10"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>

            <label className="text-sm font-bold text-[#0B2A6F] flex items-center gap-2 mt-6 md:mt-0">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
              Active (show on website)
            </label>
          </div>

          <div className="flex gap-3">
            {!editingId ? (
              <button
                className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                onClick={addMember}
              >
                Add
              </button>
            ) : (
              <>
                <button
                  className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                  onClick={saveEdit}
                >
                  Save
                </button>
                <button className="underline font-bold" onClick={resetForm}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 bg-white border rounded-2xl p-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#0B2A6F]">Members</h2>
          {loading && <span className="text-slate-600 text-sm">Loading…</span>}
        </div>

        <div className="mt-4 grid gap-3">
          {members.map((m) => (
            <div key={m.id} className="border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-extrabold text-[#0B2A6F]">{m.name}</div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
                    {m.role}
                  </div>
                  <div className="mt-2 text-sm text-slate-700 break-all">{m.email}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Sort: {m.sort_order} • {m.active ? "Active" : "Hidden"}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="underline font-bold" onClick={() => startEdit(m)}>
                    Edit
                  </button>
                  <button
                    className="underline font-bold text-red-600"
                    onClick={() => deleteMember(m.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!members.length && !loading && <div className="text-slate-600">No members yet.</div>}
        </div>
      </div>
    </main>
  );
}