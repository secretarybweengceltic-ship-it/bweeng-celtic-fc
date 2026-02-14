"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  image_url: string | null;
  created_at: string;
};

type Fixture = {
  id: string;
  match_date: string;
  match_time: string | null;
  team: string;
  opponent: string;
  venue: string;
  competition: string | null;
  // store result as "H-A" string in DB, but we edit via two number boxes
  result: string | null;
  notes: string | null;
  created_at: string;
};

function parseResult(result: string | null): { home: string; away: string } {
  if (!result) return { home: "", away: "" };
  const m = result.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
  if (!m) return { home: "", away: "" };
  return { home: m[1], away: m[2] };
}

function buildResult(home: string, away: string): string | null {
  const h = home.trim();
  const a = away.trim();
  if (!h && !a) return null;
  if (!/^\d+$/.test(h) || !/^\d+$/.test(a)) return null;
  return `${h}-${a}`;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // announcements form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // announcements editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // announcements list
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  // fixtures form
  const [fxDate, setFxDate] = useState("");
  const [fxTime, setFxTime] = useState("");
  const [fxTeam, setFxTeam] = useState("Senior");
  const [fxOpponent, setFxOpponent] = useState("");
  const [fxVenue, setFxVenue] = useState("Home");
  const [fxCompetition, setFxCompetition] = useState("");
  const [fxNotes, setFxNotes] = useState("");

  // fixtures result as two inputs
  const [fxHomeGoals, setFxHomeGoals] = useState("");
  const [fxAwayGoals, setFxAwayGoals] = useState("");

  // fixtures list/editing
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fxEditingId, setFxEditingId] = useState<string | null>(null);
  const [fxLoading, setFxLoading] = useState(false);

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setPosts([]);
    setFixtures([]);
    resetAnnouncementForm();
    resetFixtureForm();
  }

  function resetAnnouncementForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("General");
    setPublished(true);
    setImageFile(null);
  }

  async function loadPosts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);

    if (error) alert(error.message);
    else setPosts((data ?? []) as Announcement[]);
  }

  async function uploadImage(file: File) {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
    const path = `announcements/${fileName}`;

    const { error } = await supabase.storage
      .from("announcement-images")
      .upload(path, file, { upsert: false });

    if (error) {
      alert(error.message);
      return null;
    }

    const { data } = supabase.storage.from("announcement-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function createAnnouncement() {
    let imageUrl: string | null = null;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const { error } = await supabase.from("announcements").insert({
      title,
      content,
      category,
      published,
      image_url: imageUrl,
    });

    if (error) alert(error.message);
    else {
      resetAnnouncementForm();
      loadPosts();
      alert("Posted!");
    }
  }

  function startEdit(post: Announcement) {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setPublished(post.published);
    setImageFile(null);
  }

  async function saveEdit() {
    if (!editingId) return;

    let imageUrl: string | null | undefined = undefined;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const updateData: any = { title, content, category, published };
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { error } = await supabase
      .from("announcements")
      .update(updateData)
      .eq("id", editingId);

    if (error) alert(error.message);
    else {
      resetAnnouncementForm();
      loadPosts();
      alert("Saved!");
    }
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete announcement?")) return;

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) alert(error.message);
    else loadPosts();
  }

  // Fixtures functions
  async function loadFixtures() {
    setFxLoading(true);
    const { data, error } = await supabase
      .from("fixtures")
      .select("*")
      .order("match_date", { ascending: true });
    setFxLoading(false);

    if (error) return alert(error.message);
    setFixtures((data ?? []) as Fixture[]);
  }

  function resetFixtureForm() {
    setFxEditingId(null);
    setFxDate("");
    setFxTime("");
    setFxTeam("Senior");
    setFxOpponent("");
    setFxVenue("Home");
    setFxCompetition("");
    setFxNotes("");
    setFxHomeGoals("");
    setFxAwayGoals("");
  }

  async function addFixture() {
    if (!fxDate || !fxOpponent) return alert("Please add at least Date and Opponent.");

    const resultStr = buildResult(fxHomeGoals, fxAwayGoals);
    if (resultStr === null && (fxHomeGoals.trim() || fxAwayGoals.trim())) {
      return alert("Result must be numbers only (Home Goals and Away Goals).");
    }

    const { error } = await supabase.from("fixtures").insert({
      match_date: fxDate,
      match_time: fxTime || null,
      team: fxTeam,
      opponent: fxOpponent,
      venue: fxVenue,
      competition: fxCompetition || null,
      result: resultStr,
      notes: fxNotes || null,
    });

    if (error) return alert(error.message);

    resetFixtureForm();
    await loadFixtures();
    alert("Fixture added!");
  }

  function startEditFixture(f: Fixture) {
    setFxEditingId(f.id);
    setFxDate(f.match_date);
    setFxTime(f.match_time ?? "");
    setFxTeam(f.team);
    setFxOpponent(f.opponent);
    setFxVenue(f.venue);
    setFxCompetition(f.competition ?? "");
    setFxNotes(f.notes ?? "");

    const parsed = parseResult(f.result);
    setFxHomeGoals(parsed.home);
    setFxAwayGoals(parsed.away);
  }

  function addResultQuick(f: Fixture) {
    startEditFixture(f);
    setTimeout(() => {
      document.getElementById("fxHomeGoals")?.focus();
    }, 50);
  }

  async function saveFixture() {
    if (!fxEditingId) return;

    const resultStr = buildResult(fxHomeGoals, fxAwayGoals);
    if (resultStr === null && (fxHomeGoals.trim() || fxAwayGoals.trim())) {
      return alert("Result must be numbers only (Home Goals and Away Goals).");
    }

    const { error } = await supabase
      .from("fixtures")
      .update({
        match_date: fxDate,
        match_time: fxTime || null,
        team: fxTeam,
        opponent: fxOpponent,
        venue: fxVenue,
        competition: fxCompetition || null,
        result: resultStr,
        notes: fxNotes || null,
      })
      .eq("id", fxEditingId);

    if (error) return alert(error.message);

    resetFixtureForm();
    await loadFixtures();
    alert("Fixture saved!");
  }

  async function deleteFixture(id: string) {
    if (!confirm("Delete this fixture?")) return;

    const { error } = await supabase.from("fixtures").delete().eq("id", id);
    if (error) return alert(error.message);

    await loadFixtures();
  }

  // load data on login
  useEffect(() => {
    if (user) {
      loadPosts();
      loadFixtures();
    }
  }, [user]);

  // login screen
  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-4">Admin Login</h1>

          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full mb-4"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
            onClick={signIn}
          >
            Log In
          </button>
        </div>
      </main>
    );
  }

  // admin panel
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header + Announcements form */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-[#0B2A6F]">Admin Panel</h1>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/gallery"
                className="px-4 py-2 rounded-lg font-extrabold bg-[#0B2A6F] text-white hover:bg-blue-800"
              >
                Manage Gallery
              </Link>

              <button onClick={signOut} className="underline font-bold">
                Log out
              </button>
            </div>
          </div>

          <h2 className="mt-6 text-xl font-extrabold text-[#0B2A6F]">
            {editingId ? "Edit Announcement" : "Post Announcement"}
          </h2>

          <div className="mt-4 grid gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border p-2 rounded"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <textarea
              className="border p-2 rounded"
              rows={5}
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />

            <label className="text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />{" "}
              Published
            </label>

            <div className="flex gap-3">
              {!editingId ? (
                <button
                  onClick={createAnnouncement}
                  className="bg-yellow-400 px-4 py-2 font-bold rounded"
                >
                  Post
                </button>
              ) : (
                <>
                  <button
                    onClick={saveEdit}
                    className="bg-yellow-400 px-4 py-2 font-bold rounded"
                  >
                    Save Changes
                  </button>
                  <button onClick={resetAnnouncementForm} className="underline font-bold">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Announcements list */}
        <div className="mt-6 bg-white border rounded-xl p-6">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#0B2A6F]">Announcements</h2>
            <button className="underline font-bold" onClick={loadPosts}>
              Refresh
            </button>
          </div>

          {loading && <p className="mt-4 text-slate-600">Loading…</p>}

          <div className="mt-4 grid gap-4">
            {posts.map((p) => (
              <div key={p.id} className="border rounded-xl p-4">
                {p.image_url && (
                  <img src={p.image_url} alt="" className="w-full h-40 object-cover rounded mb-2" />
                )}

                <div className="font-bold">{p.title}</div>
                <div className="text-sm">{p.category}</div>
                <div className="mt-2 whitespace-pre-wrap">{p.content}</div>

                <div className="mt-3 flex gap-4">
                  <button onClick={() => startEdit(p)} className="underline font-bold">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(p.id)}
                    className="underline text-red-600 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {!posts.length && !loading && <div className="text-slate-600">No announcements yet.</div>}
          </div>
        </div>

        {/* Fixtures section */}
        <div className="mt-6 bg-white border rounded-xl p-6">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#0B2A6F]">Fixtures & Results</h2>
            <button className="underline font-bold" onClick={loadFixtures}>
              Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="grid gap-2 md:grid-cols-2">
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

            <div className="grid gap-2 md:grid-cols-3">
              <div>
                <label className="text-sm font-bold text-[#0B2A6F]">Team</label>
                <input
                  className="mt-1 border p-2 rounded w-full"
                  value={fxTeam}
                  onChange={(e) => setFxTeam(e.target.value)}
                />
              </div>

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

            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Opponent</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="Opponent FC"
                value={fxOpponent}
                onChange={(e) => setFxOpponent(e.target.value)}
              />
            </div>

            {/* Result inputs */}
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-[#0B2A6F]">Home Goals (optional)</label>
                <input
                  id="fxHomeGoals"
                  inputMode="numeric"
                  className="mt-1 border p-2 rounded w-full"
                  placeholder="0"
                  value={fxHomeGoals}
                  onChange={(e) => setFxHomeGoals(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#0B2A6F]">Away Goals (optional)</label>
                <input
                  id="fxAwayGoals"
                  inputMode="numeric"
                  className="mt-1 border p-2 rounded w-full"
                  placeholder="0"
                  value={fxAwayGoals}
                  onChange={(e) => setFxAwayGoals(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#0B2A6F]">Notes (optional)</label>
              <input
                className="mt-1 border p-2 rounded w-full"
                placeholder="Kick-off moved to 8pm"
                value={fxNotes}
                onChange={(e) => setFxNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-2">
              {!fxEditingId ? (
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
                  <button className="underline font-bold" onClick={resetFixtureForm}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {fxLoading && <p className="mt-4 text-slate-600">Loading…</p>}

          <div className="mt-6 grid gap-3">
            {fixtures.map((f) => (
              <div key={f.id} className="border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-extrabold text-[#0B2A6F]">
                      {f.match_date} {f.match_time ? `• ${f.match_time}` : ""} • {f.team}
                    </div>
                    <div className="text-slate-700">
                      vs <b>{f.opponent}</b> • {f.venue}
                      {f.competition ? ` • ${f.competition}` : ""}
                      {f.result ? ` • Result: ${f.result}` : ""}
                    </div>
                    {f.notes && <div className="text-sm text-slate-600 mt-1">{f.notes}</div>}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <button
                      className="underline font-bold text-yellow-700"
                      onClick={() => addResultQuick(f)}
                    >
                      Add Result
                    </button>

                    <button
                      className="underline font-bold text-[#0B2A6F]"
                      onClick={() => startEditFixture(f)}
                    >
                      Edit
                    </button>

                    <button
                      className="underline font-bold text-red-600"
                      onClick={() => deleteFixture(f.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!fixtures.length && !fxLoading && (
              <div className="text-slate-600">No fixtures yet — add your first one above.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
