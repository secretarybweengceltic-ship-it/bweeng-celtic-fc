export const dynamic = "force-dynamic";
export const revalidate = 0;

import { supabase } from "@/lib/supabaseClient";
import CommitteeClient from "@/app/committee/CommitteeClient";

type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  sort_order: number;
  active: boolean;
};

export default async function CommitteePage() {
  const { data, error } = await supabase
    .from("committee_members")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const people = (data ?? []) as Member[];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border bg-white p-7 md:p-10">
        <div className="absolute -right-24 -top-24 h-60 w-60 rounded-full bg-yellow-100 blur-2xl" />
        <div className="absolute -left-24 -bottom-24 h-60 w-60 rounded-full bg-blue-100 blur-2xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
            Club Contacts
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#0B2A6F]">
            Club Committee
          </h1>

          <p className="mt-3 max-w-2xl text-slate-700">
            Contact details for the committee. Tap Email to copy the address (and it will also try to open your email app).
          </p>
        </div>
      </section>

      {error && (
        <div className="mt-6 bg-white border rounded-xl p-4 text-red-700">
          Error loading committee: <b>{error.message}</b>
        </div>
      )}

      {/* Client-rendered cards with copy-to-clipboard */}
      <CommitteeClient people={people} />

      {!people.length && !error && (
        <section className="mt-6 rounded-2xl border bg-white p-6 text-slate-600">
          Committee details will appear here once added by an admin.
        </section>
      )}
    </main>
  );
}