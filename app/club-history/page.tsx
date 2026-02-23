export const dynamic = "force-dynamic";
export const revalidate = 0;

type SeasonRow = {
  season: string;
  league: string;
  position: string;
};

export default function HistoryPage() {
  const timeline = [
    {
      title: "Foundation and Early Years",
      years: "2010–2012",
      points: [
        "Founded in summer 2010 to provide organised association football for Bweeng and the surrounding North Cork area.",
        "Affiliated with the Football Association of Ireland (FAI) and the Cork Athletic Union League (AUL).",
        "Entered the Murphy’s Stout Cork AUL League 3 for the 2010/11 season.",
        "Established Bweeng Community Sports Grounds as the club’s permanent home.",
        "First major success: won the Colm Sheehan Memorial Cup (2011/12).",
      ],
      highlight: "First trophy: Colm Sheehan Memorial Cup (2011/12)",
    },
    {
      title: "Establishment within the Cork AUL",
      years: "2012–2017",
      points: [
        "Became an established member of the Cork AUL league structure.",
        "Consistently competed in League 3, strengthening the squad and club organisation.",
        "Supported by dedicated volunteers, players and local supporters.",
        "These years laid the foundation for future success and club development.",
      ],
      highlight: "Development years that built the platform for major honours",
    },
    {
      title: "League Champions and Promotion",
      years: "2017–2018",
      points: [
        "Most significant league achievement in club history.",
        "Crowned Murphy’s Stout Cork AUL Division 3 Champions (2017/18).",
        "Secured the club’s first league title and earned promotion within the Cork AUL structure.",
      ],
      highlight: "Division 3 Champions (2017/18) — first league title",
    },
    {
      title: "Continued Competition and Cup Progress",
      years: "2018–Present",
      points: [
        "Continued to compete across Cork AUL league and cup competitions.",
        "Maintained the club’s position as a respected junior club in Cork.",
        "Remains community-focused, representing Bweeng with pride and commitment to grassroots football.",
      ],
      highlight: "Active Cork AUL club with ongoing community commitment",
    },
  ];

  const seasons: SeasonRow[] = [
    { season: "2010/11", league: "AUL League 3B", position: "Unknown" },
    { season: "2011/12", league: "AUL League 3B", position: "Unknown" },
    { season: "2012/13", league: "AUL League 3B", position: "Unknown" },
    { season: "2013/14", league: "AUL League 3B", position: "4th" },
    { season: "2014/15", league: "AUL League 3B", position: "7th" },
    { season: "2015/16", league: "AUL League 3", position: "8th" },
    { season: "2016/17", league: "AUL League 3", position: "9th" },
    { season: "2017/18", league: "AUL League 3", position: "1st (Champions)" },
    { season: "2018/19", league: "AUL League 2A", position: "3rd" },
    { season: "2019/20", league: "AUL League 2", position: "9th" },
    { season: "2020/21", league: "AUL League 2", position: "6th" },
    { season: "2021/22", league: "AUL League 2", position: "7th" },
    { season: "2022/23", league: "AUL League 2", position: "5th" },
    { season: "2023/24", league: "AUL League 2", position: "3rd" },
    { season: "2024/25", league: "AUL League 2", position: "9th" },
    { season: "2025/26", league: "AUL League 3", position: "—" },
  ];

  const summary = [
    { label: "Founded", value: "2010" },
    { label: "League", value: "Cork Athletic Union League (AUL)" },
    { label: "Home Ground", value: "Bweeng Community Sports Grounds" },
    { label: "First Trophy", value: "2011/12" },
    { label: "First League Title", value: "2017/18" },
    { label: "Status", value: "Active Cork AUL club" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border bg-white p-7 md:p-10">
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-yellow-100 blur-2xl" />
        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-blue-100 blur-2xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
            Club History
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#0B2A6F]">
            History of Bweeng Celtic FC
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            A record of the club’s foundation, key milestones, honours, and season-by-season league history
            in the Cork Athletic Union League.
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-5">
            <div className="text-xs font-extrabold text-yellow-700">{s.label}</div>
            <div className="mt-2 text-lg font-extrabold text-[#0B2A6F]">{s.value}</div>
            <div className="mt-4 h-1 w-16 rounded bg-yellow-400" />
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-3xl font-extrabold text-[#0B2A6F]">Timeline</h2>
          <div className="text-sm text-slate-600">Key periods & milestones</div>
        </div>

        <div className="mt-4 grid gap-4">
          {timeline.map((t) => (
            <div key={t.title} className="rounded-2xl border bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-2xl font-extrabold text-[#0B2A6F]">{t.title}</div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                    {t.years}
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-extrabold text-[#0B2A6F]">
                  {t.highlight}
                </div>
              </div>

              <ul className="mt-4 grid gap-2 text-slate-700">
                {t.points.map((p, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Honours */}
      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Honours</h2>

          <div className="mt-4 rounded-xl border bg-slate-50 p-5">
            <div className="text-xs font-extrabold text-yellow-700">League Honours</div>
            <div className="mt-2 text-lg font-extrabold text-[#0B2A6F]">
              Murphy’s Stout Cork AUL Division 3
            </div>
            <div className="mt-1 text-slate-700">
              Champions: <b>2017/18</b>
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-slate-50 p-5">
            <div className="text-xs font-extrabold text-yellow-700">Cup Honours</div>
            <div className="mt-2 text-lg font-extrabold text-[#0B2A6F]">Colm Sheehan Memorial Cup</div>
            <div className="mt-1 text-slate-700">
              Winners: <b>2011/12</b>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">Club Summary</h2>

          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border bg-yellow-50 border-yellow-200 p-4">
              <div className="text-xs font-extrabold text-[#0B2A6F]">Founded</div>
              <div className="mt-1 text-slate-800 font-bold">2010</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-extrabold text-yellow-700">Home Ground</div>
              <div className="mt-1 text-slate-800 font-bold">Bweeng Community Sports Grounds</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-extrabold text-yellow-700">First Trophy</div>
              <div className="mt-1 text-slate-800 font-bold">Colm Sheehan Memorial Cup — 2011/12</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-extrabold text-yellow-700">First League Title</div>
              <div className="mt-1 text-slate-800 font-bold">Division 3 Champions — 2017/18</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs font-extrabold text-yellow-700">Status</div>
              <div className="mt-1 text-slate-800 font-bold">Active Cork AUL club</div>
            </div>
          </div>
        </div>
      </section>

      {/* Season-by-season */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-3xl font-extrabold text-[#0B2A6F]">Season-by-Season League Record</h2>
          <div className="text-sm text-slate-600">{seasons.length} seasons</div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 font-extrabold text-[#0B2A6F]">Season</th>
                <th className="p-4 font-extrabold text-[#0B2A6F]">League</th>
                <th className="p-4 font-extrabold text-[#0B2A6F]">Position</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((s) => {
                const isChampion = s.position.toLowerCase().includes("champions") || s.position.trim() === "1st";
                return (
                  <tr key={s.season} className="border-t">
                    <td className="p-4 font-bold text-slate-900">{s.season}</td>
                    <td className="p-4 text-slate-700">{s.league}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${
                          isChampion
                            ? "border-yellow-200 bg-yellow-50 text-[#0B2A6F]"
                            : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {s.position}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          Note: Seasons marked “Unknown” can be updated later as records become available.
        </div>
      </section>
    </main>
  );
}