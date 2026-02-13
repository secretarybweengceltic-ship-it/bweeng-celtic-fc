import ClubHeader from "../../components/ClubHeader";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function AnnouncementsPage() {

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <ClubHeader />

      {/* Page title section */}
      <section
        className="text-white"
        style={{ background: "#0B2A6F" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12">

          <h1 className="text-4xl font-extrabold">
            Club Announcements
          </h1>

          <p className="mt-2 text-white/80">
            All official updates and news from Bweeng Celtic FC.
          </p>

        </div>
      </section>

      {/* Announcements list */}
      <section className="mx-auto max-w-7xl px-4 py-10">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {announcements?.map((post: any) => (

            <div
              key={post.id}
              className="bg-white border rounded-xl p-6 hover:shadow-md transition"
            >

              {/* Category */}
              <div className="text-xs font-extrabold text-yellow-500">
                {post.category}
              </div>

              {/* Title */}
              <div className="text-xl font-extrabold text-[#0B2A6F] mt-1">
                {post.title}
              </div>

              {/* Content */}
              <div className="mt-3 text-slate-700 whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Date */}
              <div className="mt-4 text-sm text-slate-500">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : ""}
              </div>

            </div>

          ))}

        </div>

        {/* If no announcements */}
        {!announcements?.length && (

          <div className="mt-6 bg-white border rounded-xl p-6">
            No announcements yet.
          </div>

        )}

        {/* Back to home link */}
        <div className="mt-8">

          <Link
            href="/"
            className="font-bold text-[#0B2A6F] underline"
          >
            ← Back to Homepage
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white">

        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500">

          © {new Date().getFullYear()} Bweeng Celtic FC

        </div>

      </footer>

    </main>
  );
}
