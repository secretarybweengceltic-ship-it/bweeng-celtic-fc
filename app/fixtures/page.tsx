export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";

type Fixture = {
  id: string;
  match_date: string;
  match_time: string | null;
  opponent: string;
  venue: string;
  venue_name: string | null;
  competition: string | null;
  result: string | null;
  notes: string | null;
};

function toDateKey(d: string) {
  return d;
}

export default async function FixturesPage() {
  const { data, error } = await supabase
    .from("fixtures")
    .select("*")
    .order("match_date", { ascending: true });

  const all = (data ?? []) as Fixture[];
  const clubName = "Bweeng Celtic FC";

  const upcoming = all.filter((f) => !f.result);
  const results = all.filter((f) => !!f.result);
  const nextMatch = upcoming.length ? upcoming[0] : null;

  const resultsNewestFirst = [...results].sort((a, b) =>
    toDateKey(b.match_date).localeCompare(toDateKey(a.match_date))
  );

  function renderCard(f: Fixture, featured = false) {
    const isHome = (f.venue || "").toLowerCase() === "home";
    const homeTeam = isHome ? clubName : f.opponent;
    const awayTeam = isHome ? f.opponent : clubName;

    const scoreMatch = (f.result || "").match(/(\d+)\s*[-:]\s*(\d+)/);
    const homeScore = scoreMatch ? scoreMatch[1] : null;
    const awayScore = scoreMatch ? scoreMatch[2] : null;

    return (
      <div
        key={f.id}
        className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
          featured ? "border-yellow-300" : ""
        }`}
      >
        {/* Date Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-gray-600">
          <div>
            {f.match_date}
            {f.match_time && <span> • {f.match_time}</span>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isHome
                  ? "bg-yellow-50 text-[#0B2A6F] border-yellow-200"
                  : "bg-gray-50 text-[#0B2A6F] border-gray-200"
              }`}
            >
              {f.venue}
            </span>

            {f.competition && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
                {f.competition}
              </span>
            )}
          </div>
        </div>

        {/* Teams */}
        <div
          className={`mt-4 font-extrabold text-gray-900 leading-snug ${
            featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
          }`}
        >
          {homeTeam} <span className="text-gray-400">vs</span> {awayTeam}
        </div>

        {/* Result Block */}
        {f.result && (
          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-yellow-300 bg-yellow-50 px-8 py-4">
              <span className="text-sm font-bold text-[#0B2A6F]">
                FULL TIME
              </span>

              <span className="text-3xl md:text-4xl font-extrabold text-[#061C4D] tracking-wide">
                {homeScore && awayScore
                  ? `${homeScore} - ${awayScore}`
                  : f.result}
              </span>
            </div>
          </div>
        )}

        {/* Venue & Notes */}
        {(f.venue_name || f.notes) && (
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            {f.venue_name && (
              <div>
                <span className="font-semibold text-[#0B2A6F]">
                  Venue:
                </span>{" "}
                {f.venue_name}
              </div>
            )}

            {f.notes && (
              <div>
                <span className="font-semibold text-[#0B2A6F]">
                  Note:
                </span>{" "}
                {f.notes}
              </div>
            )}
          </div>
        )}

        {/* Featured Next Match Box */}
        {featured && (
          <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-sm">
            <div className="font-bold text-[#0B2A6F] mb-1">
              Next Match
            </div>
            <div className="text-gray-700">
              Check announcements for squad updates, kick-off changes,
              and travel info.
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 py-10 sm:py-14">

        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Fixtures & Results
          </h1>
          <p className="mt-2 text-gray-300">
            Upcoming fixtures and recent results.
          </p>
        </div>

        {error && (
          <div className="bg-white border rounded-xl p-4 text-red-700 mb-6">
            Error loading fixtures: <b>{error.message}</b>
          </div>
        )}

        {/* Next Match */}
        <div className="mb-12">
          {nextMatch ? (
            renderCard(nextMatch, true)
          ) : (
            <div className="bg-white rounded-2xl p-6 text-gray-600">
              No upcoming fixtures yet.
            </div>
          )}
        </div>

        {/* Upcoming */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Upcoming Fixtures
            </h2>
            <span className="text-sm text-gray-400">
              {upcoming.length} listed
            </span>
          </div>

          <div className="grid gap-6">
            {upcoming.length ? (
              upcoming
                .filter((f) => f.id !== nextMatch?.id)
                .map((f) => renderCard(f))
            ) : (
              <div className="bg-white rounded-2xl p-6 text-gray-600">
                No upcoming fixtures.
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Results
            </h2>
            <span className="text-sm text-gray-400">
              {results.length} listed
            </span>
          </div>

          <div className="grid gap-6">
            {resultsNewestFirst.length ? (
              resultsNewestFirst.map((f) => renderCard(f))
            ) : (
              <div className="bg-white rounded-2xl p-6 text-gray-600">
                No results yet.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
