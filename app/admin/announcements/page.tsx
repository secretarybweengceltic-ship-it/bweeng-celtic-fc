"use client";

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

export default function AdminAnnouncementsPage() {
  const [user, setUser] = useState<any>(null);

  // form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // edit
  const [editingId, setEditingId] = useState<string | null>(null);

  // list
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  // auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  function resetForm() {
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

    if (error) {
      console.log("loadPosts error:", error);
      alert(`Load error: ${error.message}`);
      return;
    }

    setPosts((data ?? []) as Announcement[]);
  }

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  async function uploadImage(file: File) {
    // Requires a Supabase Storage bucket named: announcement-images
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
    if (!title.trim() || !content.trim()) return alert("Please add a title and content.");

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

    if (error) {
      console.log("createAnnouncement error:", error);
      alert(`Post error: ${error.message}`);
      return;
    }

    resetForm();
    loadPosts();
    alert("Posted!");
  }

  function startEdit(post: Announcement) {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setPublished(post.published);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!title.trim() || !content.trim()) return alert("Please add a title and content.");

    let imageUrl: string | null | undefined = undefined;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const updateData: any = {
      title,
      content,
      category,
      published,
    };

    // only update image_url if a new image was chosen
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { error } = await supabase
      .from("announcements")
      .update(updateData)
      .eq("id", editingId);

    if (error) {
      console.log("saveEdit error:", error);
      alert(`Save error: ${error.message}`);
      return;
    }

    resetForm();
    loadPosts();
    alert("Saved!");
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Delete this announcement?")) return;

    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      console.log("deleteAnnouncement error:", error);
      alert(`Delete error: ${error.message}`);
      return;
    }

    loadPosts();
  }

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
        <div className="bg-white border rounded-xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-extrabold text-[#0B2A6F] mb-2">Announcements Admin</h1>
          <p className="text-slate-600">Please log in on the main Admin page first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2A6F]">Announcements</h1>
          <p className="mt-1 text-slate-600">Create, edit, and delete announcements.</p>
        </div>

        <button className="underline font-bold" onClick={loadPosts}>
          Refresh
        </button>
      </div>

      {/* Form */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="text-xl font-extrabold text-[#0B2A6F]">
          {editingId ? "Edit Announcement" : "Post Announcement"}
        </h2>

        <div className="mt-4 grid gap-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            placeholder="Category (General, Matchday, Training...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full"
            rows={6}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />

          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>

          <div className="flex gap-3">
            {!editingId ? (
              <button
                className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                onClick={createAnnouncement}
              >
                Post
              </button>
            ) : (
              <>
                <button
                  className="rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
                  onClick={saveEdit}
                >
                  Save Changes
                </button>
                <button className="underline font-bold" onClick={resetForm}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#0B2A6F]">All Announcements</h2>
          {loading && <span className="text-slate-600 text-sm">Loading…</span>}
        </div>

        <div className="mt-4 grid gap-4">
          {posts.map((p) => (
            <div key={p.id} className="border rounded-xl p-4">
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt=""
                  className="w-full h-44 object-cover rounded-lg mb-3"
                />
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-yellow-700">{p.category}</div>
                  <div className="text-lg font-extrabold text-[#0B2A6F]">{p.title}</div>
                  {!p.published && (
                    <div className="text-xs font-bold text-red-600 mt-1">
                      Draft (not published)
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button className="underline font-bold" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="underline font-bold text-red-600"
                    onClick={() => deleteAnnouncement(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-2 text-slate-700 whitespace-pre-wrap">{p.content}</div>
            </div>
          ))}

          {!posts.length && !loading && (
            <div className="text-slate-600">No announcements yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
