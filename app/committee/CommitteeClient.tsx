"use client";

type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  sort_order: number;
  active: boolean;
};

function EmailCopyButton({ email, name }: { email: string; name: string }) {
  const cleaned = (email || "").trim();
  if (!cleaned) return null;

  const handleClick = async () => {
    // 1) Copy to clipboard (best effort)
    try {
      await navigator.clipboard.writeText(cleaned);
      // small feedback
      alert(`Email copied: ${cleaned}`);
    } catch {
      // fallback if clipboard is blocked
      window.prompt("Copy this email address:", cleaned);
    }

    // 2) Try to open mail app
    const subject = encodeURIComponent("Enquiry from Bweeng Celtic FC Website");
    const body = encodeURIComponent(
      `Hi ${name},\n\nI’m contacting you regarding:\n\nThanks,`
    );

    window.location.href = `mailto:${cleaned}?subject=${subject}&body=${body}`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-4 py-2 text-sm font-extrabold text-[#0B2A6F] hover:brightness-95"
      title="Copies the email address and tries to open your email app"
    >
      Email (Copy)
    </button>
  );
}

export default function CommitteeClient({ people }: { people: Member[] }) {
  return (
    <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl border bg-white p-6 transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold text-[#0B2A6F]">
                {p.name}
              </div>
              <div className="mt-2 inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-extrabold text-[#0B2A6F]">
                {p.role}
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl border bg-slate-50 grid place-items-center text-[#0B2A6F] font-extrabold">
              @
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-700 break-all">
            {(p.email || "").trim()}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <EmailCopyButton email={p.email} name={p.name} />
          </div>

          <div className="mt-5 h-1 w-16 rounded bg-yellow-400 opacity-90" />
        </div>
      ))}
    </section>
  );
}