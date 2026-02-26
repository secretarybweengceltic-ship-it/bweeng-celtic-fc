export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";

type Fixture = {
  id: string;
  match_date: string;
  match_time: string | null;
  opponent: string;
  venue: string; // Home | Away
  venue_name: string | null;
  competition: string | null;
  result: string | null;
  notes: string | null;
};

function toDateKey(d: string) {
  // d is YYYY-MM-DD from DB
  // safe for sorting as a string too, but keep helper anyway
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

  // next match = first upcoming by date (data is already ordered)
  const nextMatch = upcoming.length ? upcoming[0] : null;

  // results: show newest first
  const resultsNewestFirst = [...results].sort((a, b) =>
    toDateKey(b.match_date).localeCompare(toDateKey(a.match_date))
  );
function renderCard(f: Fixture, featured = false) {
  const isHome = (f.venue || "").toLowerCase() === "home";
  const homeTeam = isHome ? clubName : f.opponent;
  const awayTeam = isHome ? f.opponent : clubName;

  // Try to parse "2-1" style scores for nicer display
  const scoreMatch = (f.result || "").match(/(\d+)\s*[-:]\s*(\d+)/);
  const homeScore = scoreMatch ? scoreMatch[1] : null;
  const awayScore = scoreMatch ? scoreMatch[2] : null;

  return (
    <div
      key={f.id}
      className={`bg-white border rounded-2xl p-5 ${
        featured ? "shadow-sm border-yellow-200" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-extrabold text-[#0B2A6F]">
          {f.match_date}
          {f.match_time ? <span className="text-slate-400"> • </span> : null}
          {f.match_time ? (
            <span className="text-slate-700">{f.match_time}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              isHome
                ? "bg-yellow-50 text-[#0B2A6F] border-yellow-200"
                : "bg-slate-50 text-[#0B2A6F] border-slate-200"
            }`}
          >
            {f.venue}
          </span>

          {f.competition && (
            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {f.competition}
            </span>
          )}

          {/* Keep small pill if you still want it */}
          {f.result && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0B2A6F] text-white">
              {f.result}
            </span>
          )}
        </div>
      </div>

      <div
        className={`mt-3 font-extrabold text-slate-900 ${
          featured ? "text-2xl" : "text-xl"
        }`}
      >
        {homeTeam} <span className="text-slate-400">vs</span> {awayTeam}
      </div>

      {/* ✅ BIG RESULT DISPLAY (only shows when there is a result) */}
      {f.result && (
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-3">
            <span className="text-sm md:text-base font-extrabold text-[#0B2A6F]">
              FULL TIME
            </span>

            <span className="text-3xl md:text-4xl font-extrabold text-[#061C4D] tracking-wider">
              {homeScore !== null && awayScore !== null
                ? `${homeScore} - ${awayScore}`
                : f.result}
            </span>
          </div>
        </div>
      )}

      {(f.venue_name || f.notes) && (
        <div className="mt-3 text-sm text-slate-600">
          {f.venue_name && (
            <div>
              <span className="font-bold text-[#0B2A6F]">Venue:</span>{" "}
              {f.venue_name}
            </div>
          )}

          {f.notes && (
            <div className="mt-1">
              <span className="font-bold text-[#0B2A6F]">Note:</span> {f.notes}
            </div>
          )}
        </div>
      )}

      {featured && (
        <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-sm">
          <div className="font-extrabold text-[#0B2A6F]">Next Match</div>
          <div className="text-slate-700">
            Make sure to check announcements for squad, kick-off changes, and
            travel info.
          </div>
        </div>
      )}
    </div>
  );
}
  
return (
  //<main className="mx-auto max-w-5xl px-4 py-10">
    <main className="dark-page min-h-screen">
      <h1 className="section-title text-3xl sm:text-4xl">Fixtures & Results</h1>
      <p className="section-subtitle">Upcoming fixtures and recent results.</p>

      {error && (
        <div className="mt-6 bg-white border rounded-xl p-4 text-red-700">
          Error loading fixtures: <b>{error.message}</b>
        </div>
      )}

      {/* Featured Next Match */}
      <div className="mt-6">
        {nextMatch ? (
          renderCard(nextMatch, true)
        ) : (
          <div className="bg-white border rounded-2xl p-6 text-slate-600">
            No upcoming fixtures yet.
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Upcoming Fixtures</h2>
          <div className="text-sm text-slate-600">{upcoming.length} listed</div>
        </div>

        <div className="mt-4 grid gap-4">
          {upcoming.length ? (
            upcoming
              // don’t repeat the featured one
              .filter((f) => f.id !== nextMatch?.id)
              .map((f) => renderCard(f))
          ) : (
            <div className="bg-white border rounded-2xl p-6 text-slate-600">
              No upcoming fixtures.
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Results</h2>
          <div className="text-sm text-slate-600">{results.length} listed</div>
        </div>

        <div className="mt-4 grid gap-4">
          {resultsNewestFirst.length ? (
            resultsNewestFirst.map((f) => renderCard(f))
          ) : (
            <div className="bg-white border rounded-2xl p-6 text-slate-600">
              No results yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
