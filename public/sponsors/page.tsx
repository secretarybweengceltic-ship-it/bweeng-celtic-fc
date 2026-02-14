import Image from "next/image";

export default function SponsorsPage() {
  const sponsors = ["/sponsors/sponsor1.png", "/sponsors/sponsor2.png"];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">Sponsors</h1>
      <p className="mt-2 text-slate-600">Thanks to our sponsors for supporting the club.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((src) => (
          <div key={src} className="bg-white border rounded-xl p-6 grid place-items-center">
            <Image src={src} alt="Sponsor logo" width={260} height={130} className="object-contain" />
          </div>
        ))}
      </div>
    </main>
  );
}
