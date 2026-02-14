export default function LocationPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Location</h1>
      <p className="mt-2 text-slate-600">Add your grounds address + map.</p>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <div className="font-bold text-[#0B2A6F]">Grounds</div>
        <p className="mt-2 text-slate-700">Bweeng, Co. Cork (add exact address here)</p>

        <div className="mt-4 text-sm text-slate-500">
          Tip: Later we can embed Google Maps here.
        </div>
      </div>
    </main>
  );
}
