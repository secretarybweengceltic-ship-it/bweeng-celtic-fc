"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Item = { description: string; amount: number };

export default function AdminReceiptsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState<Item[]>([
    { description: "Payment received", amount: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );
  }

  function addItem() {
    setItems((p) => [...p, { description: "", amount: 0 }]);
  }

  function removeItem(i: number) {
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  async function sendReceipt() {
    setLoading(true);

    // ✅ Get logged-in admin session token
    const { data: sessionData, error: sessErr } =
      await supabase.auth.getSession();

    const token = sessionData.session?.access_token;

    if (sessErr || !token) {
      setLoading(false);
      alert("You are not logged in as admin. Please log in again.");
      return;
    }

    const res = await fetch("/api/admin/create-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ REQUIRED for protected API
      },
      body: JSON.stringify({
        name,
        email,
        reference: reference || null,
        date,
        items,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to send receipt");
      return;
    }

    alert(`Receipt sent ✅\nReceipt Number: ${data.receiptNumber}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-[#0B2A6F]">
        Receipts
      </h1>

      <p className="mt-2 text-slate-600">
        Create and email a receipt with multiple line items.
      </p>

      <div className="mt-6 bg-white border rounded-xl p-6 space-y-4">

        <input
          className="border p-2 rounded w-full"
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Customer email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex gap-3">

          <label className="w-full text-sm font-bold text-[#0B2A6F]">
            Paid date
            <input
              className="border p-2 rounded w-full mt-1"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="w-full text-sm font-bold text-[#0B2A6F]">
            Reference (optional)
            <input
              className="border p-2 rounded w-full mt-1"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. Stripe or Bank reference"
            />
          </label>

        </div>

        <div>

          <div className="flex items-center justify-between">
            <p className="font-extrabold text-[#0B2A6F]">
              Line items
            </p>

            <button
              className="underline font-bold"
              onClick={addItem}
              type="button"
            >
              + Add item
            </button>
          </div>

          <div className="mt-2 space-y-2">

            {items.map((it, idx) => (

              <div key={idx} className="grid grid-cols-12 gap-2">

                <input
                  className="border p-2 rounded col-span-9"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) =>
                    updateItem(idx, { description: e.target.value })
                  }
                />

                <input
                  className="border p-2 rounded col-span-2"
                  type="number"
                  placeholder="€"
                  value={it.amount}
                  onChange={(e) =>
                    updateItem(idx, { amount: Number(e.target.value) })
                  }
                />

                <button
                  className="col-span-1 font-bold"
                  onClick={() => removeItem(idx)}
                  type="button"
                >
                  ✕
                </button>

              </div>

            ))}

          </div>

        </div>

        <button
          className="w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
          onClick={sendReceipt}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Receipt"}
        </button>

      </div>

    </main>
  );
}