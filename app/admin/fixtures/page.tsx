"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Fixture = {
  id: string;
  match_date: string;
  match_time: string | null;
  team: string;
  opponent: string;
  venue: string;
  venue_name: string | null;
  competition: string | null;
  result: string | null;
  notes: string | null;
  created_at: string;
};

export default function AdminFixturesPage() {
  const [user, setUser] = useState<any>(null);

  // form fields
  const [fxDate, setFxDate] = useState("");
  const [fxTime, setFxTime] = useState("");
  const [fxTeam, setFxTeam] = useState("Senior"); // harmless even if you only have one team
  const [fxOpponent, setFxOpponent] = useState("");
  const [fxVenue, setFxVenue] = useState("Home");
  const [fxVenueName, setFxVenueName] = useState("");
  const [fxCompetition, setFxCompetition] = useState("");
  const [fxNotes, setFxNotes] = useState("");

  // score inputs stored as result "H-A"
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");

  // list/edit state
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  function buildResult(): string | null {
    const h = homeGoals.trim();
    const a = awayGoals.trim();
    if (!h && !a) return null;

    if (!/^\d+$/.test(h) || !/^\d+$/.test(a)) return null;
    return `${h}-${a}`;
  }

  function parseResult(result: string | null) {
    if (!result) return { h: "", a: "" };
    const m = result.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
    if (!m) return { h: "", a: "" };
    return { h: m[1], a: m[2] };
  }

  function resetForm() {
    setEditingId(null);
    setFxDate("");
    setFxTime("");
    setFxTeam("Senior");
    setFxOpponent("");
    setFxVenue("Home");
    setFxVenueName("");
    setFxCompetition("");
    setFxNotes("");
    setHomeGoals("");
    setAwayGoals("");
  }

  async function loadFixtures() {
    setLoading(true);
    const res = await supabase
      .from("fixtures")
      .select("*")
      .order("match_date", { ascending: true });

    setLoading(false);

    if (res.error) {
      console.log("loadFixtures error:", res.error);
      alert(`Fixtures load error: ${res.error.message}`);
      return;
    }

    setFixtures((res.data ?? []) as Fixture[]);
  }

  useEffect(() => {
    if (user) loadFixtures();
  }, [user]);

  async function addFixture() {
    if (!fxDate || !fxOpponent) return alert("Please add at least Date and Opponent.");

    const result = buildResult();
    if (result === null && (homeGoals.trim() || awayGoals.trim())) {
      return alert("Score must be numbers only (e.g. 2 and 1).");
    }

    const res = await supabase.from("fixtures").insert({
      match_date: fxDate,
      match_time: fxTime || null,
      team: fxTeam,
      opponent: fxOpponent,
      venue: fxVenue,
      venue_name: fxVenueName || null,
      competition: fxCompetition || null,
      result,
      notes: fxNotes || null,
    });

    if (res.error) {
      console.log("addFixture error:", res.error);
      alert(`Error posting fixture: ${res.error.message}`);
      return;
    }

    resetForm();
    loadFixtures();
    alert("Fixture added!");
  }

  function startEdit(f: Fixture) {
    setEditingId(f.id);
    setFxDate(f.match_date);
    setFxTime(f.match_time ?? "");
    setFxTeam(f.team);
    setFxOpponent(f.opponent);
    setFxVenue(f.venue);
    setFxVenueName(f.venue_name ?? "");
    setFxCompetition(f.competition ?? "");
    setFxNotes(f.notes ?? "");

    const parsed = parseResult(f.result);
    setHomeGoals(parsed.h);
    setAwayGoals(parsed.a);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveFixture() {
    if (!editingId) return;

    const result = buildResult();
    if (result === null && (homeGoals.trim() || awayGoals.trim())) {
      return alert("Score must be numbers only (e.g. 2 and 1).");
    }

    const res = await supabase
      .from("fixtures")
      .update({
        match_date: fxDate,
        match_time: fxTime || null,
        team: fxTeam,
        opponent: fxOpponent,
        venue: fxVenue,
        venue_name: fxVenueName || null,
        competition: fxCompetition || null,
        result,
        notes: fxNotes || null,
      })
      .eq("id", editingId);

    if (res.error) {
      console.log("saveFixture error:", res.error);
      alert(`Error saving fixture: ${res.error.message}`);
      return;
    }

    resetForm();
    loadFixtures();
    alert("Fixture saved!");
  }

  async function deleteFixture(id: string) {
    if (!confirm("Delete this fixture?")) return;

    const res = await supabase.from("fixtures").delete().eq("id", id);

    if (res.error) {
      console.log("deleteFixture error:", res.error);
      alert(`Error deleting fixture: ${res.error.message}`);
      return;
    }

    loadFixtures();
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-2">Fixtures Admin</h1>
          <p className="text-slate-600">Please log in on the main Admin page first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2A6F]">Fixtures & Results</h1>
          <p className="mt-1 text-slate-600">Add, edit, and delete fixtures.</p>
        </div>

        <button className="underline font-bold" onClick={loadFixtures}>
          Refresh
        </button>
      </div>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="text-xl font-extrabold text-[#0B2A6F]">
          {editingId ? "Edit Fixture" : "Add Fixture"}
        </h2>

        <div className="mt-4 grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Date</label>
              <input
                type="date"
                className="mt-1 border p-2 rounded w-full"
                value={fxDate}
                onChange={(e) => setFxDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Time (optional)</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="19:30"
                value={fxTime}
                onChange={(e) => setFxTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Venue</label>
              <select
                className="mt-1 border p-2 rounded w-full"
                value={fxVenue}
                onChange={(e) => setFxVenue(e.target.value)}
              >
                <option>Home</option>
                <option>Away</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-bold text-[#0B2A6F]">Venue Name</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="e.g. Bweeng Sports Ground"
                value={fxVenueName}
                onChange={(e) => setFxVenueName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Opponent</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="Opponent FC"
                value={fxOpponent}
                onChange={(e) => setFxOpponent(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Competition (optional)</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="League / Cup"
                value={fxCompetition}
                onChange={(e) => setFxCompetition(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Home goals (optional)</label>
              <input
                inputMode="numeric"
                className="mt-1 border p-2 rounded w-full"
                placeholder="2"
                value={homeGoals}
                onChange={(e) => setHomeGoals(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Away goals (optional)</label>
              <input
                inputMode="numeric"
                className="mt-1 border p-2 rounded w-full"
                placeholder="1"
                value={awayGoals}
                onChange={(e) => setAwayGoals(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-[#0B2A6F]">Notes (optional)</label>
            <input
              className="mt-1 border p-2 rounded w-full"
              placeholder="Any notes…"
              value={fxNotes}
              onChange={(e) => setFxNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {!editingId ? (
              <button
                className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                onClick={addFixture}
              >
                Add Fixture
              </button>
            ) : (
              <>
                <button
                  className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                  onClick={saveFixture}
                >
                  Save Fixture
                </button>
                <button className="underline font-bold" onClick={resetForm}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold text-[#0B2A6F]">All Fixtures</h2>
          {loading && <span className="text-slate-600 text-sm">Loading…</span>}
        </div>

        <div className="mt-4 grid gap-3">
          {fixtures.map((f) => (
            <div key={f.id} className="border rounded-xl p-4">
              <div className="text-sm font-extrabold text-[#0B2A6F]">
                {f.match_date} {f.match_time ? `• ${f.match_time}` : ""}
              </div>

              <div className="text-slate-700">
                <b>{f.venue}</b>
                {f.venue_name ? ` • ${f.venue_name}` : ""}
                {f.competition ? ` • ${f.competition}` : ""}
              </div>

              <div className="text-slate-700 mt-1">
                vs <b>{f.opponent}</b>
                {f.result ? ` • Result: ${f.result}` : ""}
              </div>

              {f.notes && <div className="text-sm text-slate-600 mt-1">{f.notes}</div>}

              <div className="mt-3 flex gap-4">
                <button className="underline font-bold" onClick={() => startEdit(f)}>
                  Edit
                </button>
                <button className="underline font-bold text-red-600" onClick={() => deleteFixture(f.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!fixtures.length && !loading && <div className="text-slate-600">No fixtures yet.</div>}
        </div>
      </div>
    </main>
  );
}
