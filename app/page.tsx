import SponsorsBar from "../components/SponsorsBar";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-3">
        <a
          href="/announcements"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">News</h3>
          <p className="mt-2 text-slate-600">View latest club announcements.</p>
        </a>

        <a
          href="/fixtures"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">Fixtures</h3>
          <p className="mt-2 text-slate-600">Upcoming fixtures and results.</p>
        </a>

        <a
          href="/committee"
          className="bg-white border rounded-xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-extrabold text-[#0B2A6F]">Committee</h3>
          <p className="mt-2 text-slate-600">Meet the club committee.</p>
        </a>
      </div>

      {/* Sponsors bar under the cards */}
      <SponsorsBar />
    </main>
  );
}