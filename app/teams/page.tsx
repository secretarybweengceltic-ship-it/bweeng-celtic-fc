export default function TeamsPage() {
  const teams = [
    { name: "Senior Team", info: "Training Tues/Thurs. Matchday Saturday." },
    { name: "U17", info: "Training Wed. Matchday Sunday." },
    { name: "Academy", info: "Grassroots + development squads." },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Teams</h1>
      <p className="mt-2 text-slate-600">Club squads and training information.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {teams.map((t) => (
          <div key={t.name} className="bg-white border rounded-xl p-6 hover:shadow-md transition">
            <div className="text-xl font-extrabold text-[#0B2A6F]">{t.name}</div>
            <div className="mt-2 text-slate-700">{t.info}</div>
            <div className="mt-4 h-1 w-16 rounded bg-yellow-400" />
          </div>
        ))}
      </div>
    </main>
  );
}
