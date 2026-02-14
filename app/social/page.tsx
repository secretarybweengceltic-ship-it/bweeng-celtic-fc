export default function SocialPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">

      <h1 className="text-4xl font-extrabold text-[#0B2A6F]">
        Social
      </h1>

      <p className="mt-2 text-slate-600">
        Follow Bweeng Celtic FC on social media.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">

        {/* Facebook */}
        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-xl font-extrabold text-[#0B2A6F]">
            Facebook
          </h2>

          <p className="mt-2 text-slate-600 text-sm">
            Visit our Facebook page for news, match updates and photos.
          </p>

          <a
            href="https://www.facebook.com/people/Bweeng-Celtic-FC/61579285980162/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 bg-[#0B2A6F] text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            View Facebook Page →
          </a>

        </div>

        {/* Instagram */}
        <div className="bg-white border rounded-xl p-6">

          <h2 className="text-xl font-extrabold text-[#0B2A6F]">
            Instagram
          </h2>

          <p className="mt-2 text-slate-600 text-sm">
            Follow us on Instagram for match photos, updates and club news.
          </p>

          <a
            href="https://www.instagram.com/bweeng_celtic_fc/"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 bg-yellow-400 text-[#0B2A6F] font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            View Instagram Profile →
          </a>

        </div>

      </div>

    </main>
  );
}
