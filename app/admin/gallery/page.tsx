import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function GalleryPage() {
  const { data: photos } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Gallery</h1>
      <p className="mt-2 text-slate-600">Photos from matches, training and events.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos?.map((p: any) => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
            <img src={p.public_url} alt={p.caption ?? "Gallery"} className="h-56 w-full object-cover" />
            {p.caption && (
              <div className="p-4 text-sm font-bold text-[#0B2A6F]">{p.caption}</div>
            )}
          </div>
        ))}

        {!photos?.length && (
          <div className="bg-white border rounded-xl p-6 text-slate-700">
            No photos yet.
          </div>
        )}
      </div>
    </main>
  );
}
