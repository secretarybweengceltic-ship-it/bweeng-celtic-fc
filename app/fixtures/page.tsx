export default function FixturesPage() {
  const fixtures = [
    { date: "2026-02-20", team: "Senior", opponent: "Opponent FC", venue: "Home", result: "-" },
    { date: "2026-02-27", team: "Senior", opponent: "Town AFC", venue: "Away", result: "-" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Fixtures & Results</h1>
      <p className="mt-2 text-slate-600">Upcoming fixtures and recent results.</p>

      <div className="mt-6 overflow-x-auto bg-white border rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 font-extrabold text-[#0B2A6F]">Date</th>
              <th className="p-4 font-extrabold text-[#0B2A6F]">Team</th>
              <th className="p-4 font-extrabold text-[#0B2A6F]">Opponent</th>
              <th className="p-4 font-extrabold text-[#0B2A6F]">Venue</th>
              <th className="p-4 font-extrabold text-[#0B2A6F]">Result</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.map((f, i) => (
              <tr key={i} className="border-t">
                <td className="p-4">{f.date}</td>
                <td className="p-4">{f.team}</td>
                <td className="p-4">{f.opponent}</td>
                <td className="p-4">{f.venue}</td>
                <td className="p-4 font-bold">{f.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
