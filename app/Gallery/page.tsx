export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";

type PhotoRow = {
  id: string;
  created_at: string;
  public_url: string;
  caption: string | null;
};

export default async function GalleryPage() {
  const { data, error } = await supabase
    .from("gallery")
    .select("id, created_at, public_url, caption")
    .order("created_at", { ascending: false });

  const photos = (data ?? []) as PhotoRow[];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="relative overflow-hidden rounded-2xl border bg-white p-7 md:p-10">
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-yellow-100 blur-2xl" />
        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-blue-100 blur-2xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
            Photos
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#0B2A6F]">Gallery</h1>
          <p className="mt-3 max-w-3xl text-slate-700">
            Photos from matches, training, events and club activities.
          </p>
        </div>
      </section>

      {error && (
        <div className="mt-6 bg-white border rounded-xl p-4 text-red-700">
          Gallery error: <b>{error.message}</b>
        </div>
      )}

      {!error && photos.length === 0 && (
        <div className="mt-6 bg-white border rounded-2xl p-6 text-slate-600">
          No photos yet.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <figure key={p.id} className="overflow-hidden rounded-2xl border bg-white">
            {/* Use <img> so no next/image config issues */}
            <div className="relative aspect-square bg-slate-100">
              <img
                src={p.public_url}
                alt={p.caption ?? "Gallery photo"}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <figcaption className="p-4">
              {p.caption ? (
                <div className="font-bold text-slate-800">{p.caption}</div>
              ) : (
                <div className="text-slate-500 text-sm"> </div>
              )}
              <div className="mt-1 text-xs text-slate-500">
                {new Date(p.created_at).toLocaleDateString()}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}