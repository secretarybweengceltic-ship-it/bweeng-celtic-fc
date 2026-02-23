export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AboutPage() {
  const clubName = "Bweeng Celtic Football Club";

  const profile = [
    { label: "Club Name", value: "Bweeng Celtic Football Club" },
    { label: "Founded", value: "2010" },
    { label: "Location", value: "Bweeng, County Cork, Ireland" },
    { label: "Home Ground", value: "Bweeng Community Sports Grounds" },
    { label: "Affiliation", value: "Murphys Stout Cork Athletic Union League (AUL)" },
    { label: "League", value: "Division 3" },
    { label: "Governing Body", value: "Football Association of Ireland (FAI)" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-white p-7 md:p-10">
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-yellow-100 blur-2xl" />
        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-blue-100 blur-2xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
            Club Profile
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#0B2A6F]">
            {clubName}
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Bweeng Celtic Football Club is an amateur association football club based in the village
            of Bweeng, County Cork. Established in 2010, the club was founded to provide organised
            football opportunities for players within Bweeng and the surrounding rural communities.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">
              Community Club
            </span>
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">
              Volunteers-led
            </span>
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">
              Cork AUL
            </span>
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">
              FAI Affiliated
            </span>
          </div>
        </div>
      </section>

      {/* Profile cards */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profile.map((item) => (
          <div key={item.label} className="rounded-2xl border bg-white p-5">
            <div className="text-xs font-extrabold text-yellow-700">{item.label}</div>
            <div className="mt-2 text-lg font-extrabold text-[#0B2A6F]">{item.value}</div>
            <div className="mt-4 h-1 w-16 rounded bg-yellow-400" />
          </div>
        ))}
      </section>

      {/* Story + Purpose */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">About the Club</h2>

          <div className="mt-3 space-y-4 text-slate-700 leading-relaxed">
            <p>
              Since its formation, the club has been affiliated with the Cork Athletic Union League
              (AUL) and the Football Association of Ireland. The club fields a Junior team in the
              Cork AUL league structure and participates in league and cup competitions administered
              by the AUL and affiliated governing bodies.
            </p>

            <p>
              Bweeng Celtic's home ground is the Bweeng Community Sports Grounds, which
              serves as a central hub for football and community activity in the area.
            </p>

            <p>
              Bweeng Celtic FC operates as a community-focused club, managed and supported by
              volunteers committed to the development and promotion of football locally. The club
              provides a structured environment for players to compete, develop, and represent their
              community, while upholding the principles of respect, fair play, and sportsmanship.
            </p>

            <p>
              Since its establishment, the club has maintained an active presence within Cork junior
              football, contributing to the growth of the game at grassroots level. Bweeng Celtic FC
              continues to build on its foundations, supporting player development and sustaining
              football participation within the local area.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-2xl font-extrabold text-[#0B2A6F]">What We Stand For</h2>

          <ul className="mt-4 grid gap-3 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400" />
              <div>
                <div className="font-extrabold text-[#0B2A6F]">Respect</div>
                <div className="text-sm text-slate-600">Players, officials, supporters, and opponents.</div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400" />
              <div>
                <div className="font-extrabold text-[#0B2A6F]">Fair Play</div>
                <div className="text-sm text-slate-600">Compete hard, play the game the right way.</div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400" />
              <div>
                <div className="font-extrabold text-[#0B2A6F]">Community</div>
                <div className="text-sm text-slate-600">A club built around local people and volunteers.</div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-yellow-400" />
              <div>
                <div className="font-extrabold text-[#0B2A6F]">Development</div>
                <div className="text-sm text-slate-600">Support players to improve and progress.</div>
              </div>
            </li>
          </ul>

          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-slate-700">
            <div className="font-extrabold text-[#0B2A6F]">Home Ground</div>
            <div className="mt-1">Bweeng Community Sports Grounds</div>
          </div>
        </div>
      </section>
    </main>
  );
}
