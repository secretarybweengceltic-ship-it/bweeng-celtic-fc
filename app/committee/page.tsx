export default function CommitteePage() {
  const people = [
    { name: "Mark O Brien", role: "Chairperson", email: "chairman.bweeng.celtic@gmail.com" },
    { name: "Jamie Brophy", role: "Secretary", email: "secretary.bweeng.celtic@gmail.com" },
    { name: "Hughie Broderick", role: "Treasurer", email: "treasurer.bweeng.celtic@gmail.com" },
    { name: "Colin Falvey", role: "Child Welfare Officer", email: "childwelfare.bweeng.celtic@gmail.com" },
    { name: "Colm O Sullivan", role: "Vice Secretary", email: "vicesecretary.bweeng.celtic@gmail.com" },
    { name: "Cathal O Brien", role: "Vice Treasurer", email: "vicetreasurer.bweeng.celtic@gmail.com" },
    { name: "Paul Brophy", role: "Head of Coaching", email: "manager.bweeng.celtic@gmail.com" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Committee</h1>
      <p className="mt-2 text-slate-600">Contact details for the committee.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {people.map((p) => (
          <div key={p.email} className="bg-white border rounded-xl p-6">
            <div className="text-lg font-extrabold text-[#0B2A6F]">{p.name}</div>
            <div className="text-sm font-bold text-yellow-600">{p.role}</div>
            <div className="mt-2 text-slate-700">{p.email}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
