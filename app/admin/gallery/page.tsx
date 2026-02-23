"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type PhotoRow = {
  id: string;
  created_at: string;
  path: string;
  public_url: string;
  caption: string | null;
};

export default function AdminGalleryPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function requireAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setErrorMsg("You must be logged in to upload/delete photos.");
      return false;
    }
    return true;
  }

  async function loadPhotos() {
    setLoading(true);
    setErrorMsg("");

    // ✅ FIX: load from your actual DB table: gallery
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setErrorMsg(error.message);
    setPhotos((data as PhotoRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleUpload() {
    setErrorMsg("");
    if (!file) {
      setErrorMsg("Please choose an image first.");
      return;
    }

    const authed = await requireAuth();
    if (!authed) return;

    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const base = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
      const filePath = `${Date.now()}-${base}.${ext}`;

      // ✅ Storage bucket: gallery
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // ✅ FIX: insert into DB table: gallery
      const { error: insertError } = await supabase.from("gallery").insert({
        path: filePath,
        public_url: publicUrl,
        caption: caption.trim() || null,
      });

      if (insertError) throw insertError;

      setFile(null);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";

      await loadPhotos();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(photo: PhotoRow) {
    setErrorMsg("");
    const authed = await requireAuth();
    if (!authed) return;

    const ok = confirm("Delete this photo? This cannot be undone.");
    if (!ok) return;

    setBusy(true);
    try {
      const { error: storageError } = await supabase.storage.from("gallery").remove([photo.path]);
      if (storageError) throw storageError;

      // ✅ FIX: delete from DB table: gallery
      const { error: dbError } = await supabase.from("gallery").delete().eq("id", photo.id);
      if (dbError) throw dbError;

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdateCaption(id: string, newCaption: string) {
    setErrorMsg("");
    const authed = await requireAuth();
    if (!authed) return;

    const { error } = await supabase
      .from("gallery")
      .update({ caption: newCaption.trim() || null })
      .eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption: newCaption } : p)));
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Admin Gallery</h2>
      <p className="mt-2 text-slate-600">Upload, edit captions, and delete gallery photos.</p>

      {errorMsg && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {errorMsg}
        </div>
      )}

      {/* Upload */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="block font-bold text-[#0B2A6F] mb-2">Choose photo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full"
              disabled={busy}
            />
            <p className="text-xs text-slate-500 mt-2">PNG/JPG recommended.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-[#0B2A6F] mb-2">Caption (optional)</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. U12s tournament day"
              className="w-full border rounded-lg px-3 py-2"
              disabled={busy}
            />

            <button
              onClick={handleUpload}
              disabled={!file || busy}
              className={`mt-4 px-4 py-2 rounded-lg font-extrabold ${
                !file || busy
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-yellow-400 text-[#0B2A6F] hover:bg-yellow-300"
              }`}
            >
              {busy ? "Working..." : "Upload Photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="mt-8">
        <h3 className="text-xl font-extrabold text-[#0B2A6F]">Photos</h3>

        {loading && <div className="mt-4 text-slate-600">Loading...</div>}

        {!loading && photos.length === 0 && (
          <div className="mt-4 bg-white border rounded-xl p-6">No photos yet.</div>
        )}

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
              <div className="relative aspect-square">
                <Image src={p.public_url} alt={p.caption ?? "Gallery photo"} fill className="object-cover" />
              </div>

              <div className="p-4">
                <label className="text-sm font-bold text-[#0B2A6F]">Caption</label>
                <input
                  defaultValue={p.caption ?? ""}
                  onBlur={(e) => handleUpdateCaption(p.id, e.target.value)}
                  className="mt-2 w-full border rounded-lg px-3 py-2"
                  disabled={busy}
                />

                <button
                  onClick={() => handleDelete(p)}
                  disabled={busy}
                  className="mt-4 w-full border rounded-lg px-4 py-2 font-extrabold text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Delete Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}