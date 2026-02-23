"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Sponsor = {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  sort_order?: number;
};

async function readJsonSafe(res: Response) {
  const text = await res.text();

  // If we got HTML back (<!DOCTYPE ...), you're hitting a page/redirect, not the API JSON.
  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    throw new Error(
      `Server returned HTML instead of JSON (likely redirect/404/auth middleware).\n` +
        `URL: ${res.url}\nStatus: ${res.status}\n\nFirst 200 chars:\n${trimmed.slice(0, 200)}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Response was not valid JSON.\nURL: ${res.url}\nStatus: ${res.status}\n\nFirst 200 chars:\n${trimmed.slice(0, 200)}`
    );
  }
}

export default function SponsorsAdminPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  // Optional: allow paste URL instead
  const [logoUrl, setLogoUrl] = useState("");

  // File upload
  const [file, setFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);

    const res = await fetch("/api/sponsors", { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Failed to load sponsors (${res.status}). First 200 chars:\n${text.slice(0, 200)}`
      );
    }

    const json = await readJsonSafe(res);
    setSponsors(json.sponsors ?? []);
  }

  useEffect(() => {
    load().catch((e: any) => setError(e?.message ?? "Failed to load sponsors"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addSponsor(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const cleanedName = name.trim();
      if (!cleanedName) throw new Error("Sponsor name is required");

      let finalLogoUrl = logoUrl.trim();

      // If a file is selected, upload it to Supabase Storage
      if (file) {
        const supabase = supabaseBrowser();

        const ext = file.name.split(".").pop() || "png";
        const safeName = cleanedName.toLowerCase().replace(/\s+/g, "-");
        const filePath = `${Date.now()}-${safeName}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("sponsors")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        // get a public URL (bucket must be public)
        const { data } = supabase.storage.from("sponsors").getPublicUrl(filePath);
        finalLogoUrl = data.publicUrl;
      }

      if (!finalLogoUrl) {
        throw new Error("Upload a logo OR paste a Logo URL.");
      }

      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanedName,
          logo_url: finalLogoUrl,
          website_url: websiteUrl.trim() || null,
          sort_order: Number(sortOrder) || 0,
          active: true,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to add sponsor (${res.status}). First 200 chars:\n${text.slice(0, 200)}`
        );
      }

      // If it IS JSON, this will parse it; if it’s HTML, you’ll get a clear error.
      await readJsonSafe(res);

      // reset form
      setName("");
      setLogoUrl("");
      setWebsiteUrl("");
      setSortOrder(0);
      setFile(null);

      await load();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function removeSponsor(id: string) {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/sponsors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Failed to remove sponsor (${res.status}). First 200 chars:\n${text.slice(0, 200)}`
        );
      }

      await readJsonSafe(res);
      await load();
    } catch (err: any) {
      setError(err?.message ?? "Failed to remove sponsor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-6">
        Sponsors Admin
      </h1>

      <form
        onSubmit={addSponsor}
        className="bg-white border rounded-2xl p-4 mb-8"
      >
        <div className="grid gap-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Sponsor name (e.g. ABC Motors)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="file"
            accept="image/*"
            className="border rounded-lg px-3 py-2"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <p className="text-sm text-slate-500">
            Upload a PNG/JPG logo. If you upload a file, you don’t need to type a
            Logo URL.
          </p>

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="OR paste Logo URL (optional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />

          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Sponsor website URL (optional)"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />

          <input
            type="number"
            className="border rounded-lg px-3 py-2"
            placeholder="Sort order (0 = first)"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />

          <button
            disabled={busy}
            className="bg-yellow-400 text-[#0B2A6F] font-extrabold px-4 py-2 rounded-lg hover:bg-yellow-300 transition disabled:opacity-60"
          >
            {busy ? "Saving..." : "Add Sponsor"}
          </button>

          {error && <p className="text-red-600 font-semibold whitespace-pre-wrap">{error}</p>}
        </div>
      </form>

      <div className="bg-white border rounded-2xl p-4">
        <h2 className="font-extrabold text-[#0B2A6F] mb-3">Current Sponsors</h2>

        <div className="grid gap-3">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border rounded-xl px-3 py-2"
            >
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-sm text-slate-500 break-all">{s.logo_url}</div>
              </div>

              <button
                disabled={busy}
                onClick={() => removeSponsor(s.id)}
                className="border rounded-lg px-3 py-1 font-bold hover:bg-slate-50 disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          ))}
          {!sponsors.length && <p className="text-slate-500">No sponsors yet.</p>}
        </div>
      </div>
    </div>
  );
}