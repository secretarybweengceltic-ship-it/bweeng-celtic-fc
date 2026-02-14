import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-[#0B2A6F] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <h1 className="text-4xl md:text-5xl font-extrabold">Bweeng Celtic FC</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Official club website for announcements, fixtures, registration and updates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/announcements"
              className="bg-yellow-400 text-[#0B2A6F] font-extrabold px-5 py-3 rounded-lg"
            >
              View Announcements
            </Link>

            <Link
              href="/contact"
              className="border border-white/30 px-5 py-3 rounded-lg font-bold hover:bg-white/10"
            >
              Contact Club
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <Link href="/registration" className="bg-white border rounded-xl p-6 hover:shadow-md">
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">Registration</h3>
          <p className="mt-2 text-slate-600">Register players and join the club.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        <Link href="/teams" className="bg-white border rounded-xl p-6 hover:shadow-md">
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">Teams</h3>
          <p className="mt-2 text-slate-600">View all club teams and squads.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>

        <Link href="/fixtures" className="bg-white border rounded-xl p-6 hover:shadow-md">
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">Fixtures & Results</h3>
          <p className="mt-2 text-slate-600">Upcoming fixtures and recent results.</p>
          <div className="mt-4 h-1 w-16 bg-yellow-400 rounded" />
        </Link>
      </section>

      {/* Latest News */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Latest News</h2>
          <Link href="/announcements" className="underline font-bold">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {announcements?.map((post: any) => (
            <div key={post.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Announcement"
                  className="w-full h-48 object-cover rounded-lg mb-4 border"
                />
              )}

              <div className="text-xs font-extrabold text-yellow-500">{post.category}</div>
              <div className="text-xl font-extrabold text-[#0B2A6F] mt-1">{post.title}</div>
              <div className="mt-2 text-slate-700 whitespace-pre-wrap">{post.content}</div>

              <div className="mt-4 text-sm text-slate-500">
                {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
              </div>
            </div>
          ))}

          {!announcements?.length && (
            <div className="bg-white border rounded-xl p-6">No announcements yet.</div>
          )}
        </div>
      </section>

      {/* Sponsors strip */}
      <section className="bg-white border-t">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Sponsors</h2>
            <Link href="/sponsors" className="underline font-bold">
              View all
            </Link>
          </div>

          <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {[
              "/sponsors/sponsor1.png",
              "/sponsors/sponsor2.png",
              "/sponsors/sponsor3.png",
            ].map((src) => (
              <div key={src} className="border rounded-xl bg-slate-50 p-4 grid place-items-center">
                <Image src={src} alt="Sponsor" width={220} height={120} className="object-contain h-12" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
