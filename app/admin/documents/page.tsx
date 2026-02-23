"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DocRow = {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  file_path: string;
  created_at: string;
};

const CATEGORIES = ["General", "Policies", "Forms", "Minutes", "Reports", "Safeguarding", "Other"] as const;

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("General");
  const [pinned, setPinned] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDocs() {
    const { data, error } = await supabase
      .from("club_documents")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }
    setDocs((data as DocRow[]) || []);
  }

  useEffect(() => {
    loadDocs();
  }, []);

  const canUpload = useMemo(() => title.trim() && file, [title, file]);

  async function uploadPdf() {
    if (!file) return alert("Choose a PDF file.");
    if (file.type !== "application/pdf") return alert("Please upload a PDF only.");
    if (!title.trim()) return alert("Enter a title.");

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        alert("You are not logged in. Go to /admin and log in.");
        return;
      }

      const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
      const filePath = `${category.toLowerCase()}/${Date.now()}-${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("club-documents")
        .upload(filePath, file, { contentType: "application/pdf" });
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase.from("club_documents").insert({
        title: title.trim(),
        category,
        pinned,
        file_path: filePath,
      });
      if (dbErr) throw dbErr;

      setTitle("");
      setCategory("General");
      setPinned(false);
      setFile(null);

      await loadDocs();
      alert("Document uploaded ✅");
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function deleteDoc(doc: DocRow) {
    if (!confirm(`Delete "${doc.title}"?`)) return;

    setLoading(true);
    try {
      const { error: delFileErr } = await supabase.storage
        .from("club-documents")
        .remove([doc.file_path]);
      if (delFileErr) throw delFileErr;

      const { error: delRowErr } = await supabase
        .from("club_documents")
        .delete()
        .eq("id", doc.id);
      if (delRowErr) throw delRowErr;

      await loadDocs();
      alert("Deleted ✅");
    } catch (e: any) {
      alert(e.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function togglePinned(doc: DocRow) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("club_documents")
        .update({ pinned: !doc.pinned })
        .eq("id", doc.id);

      if (error) throw error;

      await loadDocs();
    } catch (e: any) {
      alert(e.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-[#0B2A6F]">Club Documents</h1>
      <p className="mt-2 text-slate-600">Upload PDFs, set categories, and pin important documents.</p>

      <div className="mt-6 bg-white border rounded-xl p-6 space-y-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Document title (e.g. Club Constitution)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-sm font-bold text-[#0B2A6F]">
          Category
          <select
            className="border p-2 rounded w-full mt-1"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 font-bold text-[#0B2A6F]">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
          Pin this document (shows at top)
        </label>

        <input
          className="border p-2 rounded w-full"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          className="w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
          onClick={uploadPdf}
          disabled={loading || !canUpload}
        >
          {loading ? "Working..." : "Upload PDF"}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-extrabold text-[#0B2A6F]">Uploaded Documents</h2>

        <div className="mt-3 space-y-3">
          {docs.map((d) => (
            <div
              key={d.id}
              className="bg-white border rounded-xl p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-extrabold text-[#0B2A6F]">
                  {d.title}{" "}
                  {d.pinned && (
                    <span className="ml-2 text-[11px] px-2 py-1 rounded-full bg-yellow-100 text-[#0B2A6F] font-extrabold">
                      PINNED
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {d.category} • {new Date(d.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="underline font-bold text-[#0B2A6F]"
                  onClick={() => togglePinned(d)}
                  disabled={loading}
                  type="button"
                >
                  {d.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  className="underline font-bold text-red-600"
                  onClick={() => deleteDoc(d)}
                  disabled={loading}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {docs.length === 0 && <p className="text-slate-600">No documents uploaded yet.</p>}
        </div>
      </div>
    </main>
  );
}