"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type DocRow = {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  file_path: string;
  created_at: string;
};

function PdfIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM8 13h2.5a2.5 2.5 0 0 1 0 5H8v-5zm2.5 4a1.5 1.5 0 0 0 0-3H9v3h1.5zM13 13h1.5a2.5 2.5 0 0 1 0 5H13v-5zm1.5 4a1.5 1.5 0 0 0 0-3H14v3h.5zM17 13h2v1h-2v1h2v1h-2v2h-1v-5h3v1h-2z"/>
    </svg>
  );
}

function getPublicUrl(filePath: string) {
  const { data } = supabaseBrowser().storage.from("club-documents").getPublicUrl(filePath);
  return data.publicUrl;
}

export default function ClubDocumentsPage() {
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  // modal state
  const [open, setOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<DocRow | null>(null);

  async function loadDocs() {
    setLoading(true);
    const { data, error } = await supabaseBrowser()
      .from("club_documents")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setDocs([]);
      setLoading(false);
      return;
    }

    setDocs((data as DocRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setActiveDoc(null);
      }
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(docs.map((d) => d.category || "General")));
    unique.sort((a, b) => a.localeCompare(b));
    return ["All", ...unique];
  }, [docs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return docs.filter((d) => {
      const cat = d.category || "General";
      const matchesCategory = category === "All" ? true : cat === category;
      const matchesText = !q ? true : d.title.toLowerCase().includes(q);
      return matchesCategory && matchesText;
    });
  }, [docs, query, category]);

  function openPreview(doc: DocRow) {
    setActiveDoc(doc);
    setOpen(true);
  }

  function closePreview() {
    setOpen(false);
    setActiveDoc(null);
  }

  const activeUrl = activeDoc ? getPublicUrl(activeDoc.file_path) : "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-[#0B2A6F]">Club Documents</h1>
      <p className="mt-2 text-slate-600">View and download official club PDFs.</p>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          className="w-full border rounded-xl p-3"
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded-xl p-3 font-bold text-[#0B2A6F] md:w-64"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          className="rounded-xl px-4 py-3 font-extrabold bg-[#0B2A6F] text-white"
          onClick={loadDocs}
          type="button"
        >
          Refresh
        </button>
      </div>

      {/* List */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading ? (
          <>
            <div className="bg-white border rounded-xl p-5 animate-pulse h-24" />
            <div className="bg-white border rounded-xl p-5 animate-pulse h-24" />
            <div className="bg-white border rounded-xl p-5 animate-pulse h-24" />
            <div className="bg-white border rounded-xl p-5 animate-pulse h-24" />
          </>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600">No documents found.</p>
        ) : (
          filtered.map((d) => {
            const url = getPublicUrl(d.file_path);
            const date = new Date(d.created_at).toLocaleDateString("en-IE");
            const cat = d.category || "General";

            return (
              <div key={d.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <PdfIcon className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="font-extrabold text-[#0B2A6F]">
                        {d.title}
                        {d.pinned && (
                          <span className="ml-2 text-[11px] font-extrabold px-2 py-1 rounded-full bg-yellow-100 text-[#0B2A6F]">
                            -PINNED-
                          </span>
                        )}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {cat} • Added {date}
                      </p>

                      <div className="mt-2 inline-flex items-center gap-2">
                        <span className="text-[11px] font-extrabold px-2 py-1 rounded-full bg-yellow-100 text-[#0B2A6F]">
                          PDF
                        </span>
                        <span className="text-[11px] font-extrabold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                          {cat}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="underline font-bold text-[#0B2A6F]"
                    type="button"
                    onClick={() => openPreview(d)}
                  >
                    Preview
                  </button>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center rounded-lg px-4 py-2 font-extrabold bg-[#0B2A6F] text-white hover:opacity-90"
                  >
                    View
                  </a>

                  <a
                    href={url}
                    download
                    className="w-full text-center rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F] hover:bg-yellow-300"
                  >
                    Download
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview Modal */}
      {open && activeDoc && (
        <div
          className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
          onMouseDown={closePreview}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div className="text-red-600">
                  <PdfIcon className="w-5 h-5" />
                </div>
                <p className="font-extrabold text-[#0B2A6F]">{activeDoc.title}</p>

                {activeDoc.pinned && (
                  <span className="ml-2 text-[11px] font-extrabold px-2 py-1 rounded-full bg-yellow-100 text-[#0B2A6F]">
                         -PINNED-
                  </span>
                )}

                <span className="ml-2 text-[11px] font-extrabold px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                  {activeDoc.category || "General"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a href={activeUrl} target="_blank" rel="noreferrer" className="underline font-bold text-[#0B2A6F]">
                  Open in new tab
                </a>

                <a
                  href={activeUrl}
                  download
                  className="rounded-lg px-3 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F] hover:bg-yellow-300"
                >
                  Download
                </a>

                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-lg px-3 py-2 font-extrabold bg-[#0B2A6F] text-white hover:opacity-90"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="h-[75vh] bg-slate-100">
              <iframe title={activeDoc.title} src={`${activeUrl}#view=FitH`} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}