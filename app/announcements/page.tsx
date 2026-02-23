export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  image_url: string | null;
  created_at: string;
};

export default async function AnnouncementsPage() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as Announcement[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">News</h1>
      <p className="mt-2 text-slate-600">Latest announcements from the club.</p>

      {error && (
        <div className="mt-6 bg-white border rounded-xl p-4 text-red-700">
          Error loading announcements: <b>{error.message}</b>
        </div>
      )}

      <div className="mt-6 grid gap-4">
        {posts.map((p) => (
          <article key={p.id} className="bg-white border rounded-2xl overflow-hidden">
            {p.image_url && (
              <img
                src={p.image_url}
                alt=""
                className="h-56 w-full object-cover"
              />
            )}

            <div className="p-5">
              <div className="text-sm font-bold text-yellow-700">{p.category}</div>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0B2A6F]">{p.title}</h2>
              <p className="mt-2 text-slate-700 whitespace-pre-wrap">{p.content}</p>

              <div className="mt-4 text-xs text-slate-500">
                Posted: {new Date(p.created_at).toLocaleString()}
              </div>
            </div>
          </article>
        ))}

        {!posts.length && !error && (
          <div className="bg-white border rounded-2xl p-6 text-slate-600">
            No announcements yet (or they are saved as Draft). In admin, make sure{" "}
            <b>Published</b> is ticked.
          </div>
        )}
      </div>
    </main>
  );
}
