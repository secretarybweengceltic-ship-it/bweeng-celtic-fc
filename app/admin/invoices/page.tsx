"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Item = { description: string; qty: number; unit: number };

export default function AdminInvoicesPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Item[]>([
    { description: "Membership", qty: 1, unit: 0 },
  ]);
  const [tax, setTax] = useState<number>(0);
  const [status, setStatus] = useState<"due" | "paid">("due");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function updateItem(i: number, patch: Partial<Item>) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );
  }

  function addItem() {
    setItems((p) => [...p, { description: "", qty: 1, unit: 0 }]);
  }

  function removeItem(i: number) {
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  async function sendInvoice() {
    setLoading(true);

    // ✅ Get token for protected API routes
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (sessErr || !token) {
      setLoading(false);
      alert("You are not logged in as admin. Please log in again.");
      return;
    }

    const res = await fetch("/api/admin/create-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        status,
        tax,
        notes,
        items,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to send invoice");
      return;
    }

    alert(`Invoice sent ✅\nInvoice Number: ${data.invoiceNumber}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-[#0B2A6F]">Invoices</h1>
      <p className="mt-2 text-slate-600">
        Create and email an invoice with multiple line items.
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
            Status
            <select
              className="border p-2 rounded w-full mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="due">DUE</option>
              <option value="paid">PAID</option>
            </select>
          </label>

          <label className="w-full text-sm font-bold text-[#0B2A6F]">
            Tax (EUR)
            <input
              className="border p-2 rounded w-full mt-1"
              type="number"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
            />
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-[#0B2A6F]">Line items</p>
            <button className="underline font-bold" onClick={addItem} type="button">
              + Add item
            </button>
          </div>

          <div className="mt-2 space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  className="border p-2 rounded col-span-6"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                />
                <input
                  className="border p-2 rounded col-span-2"
                  type="number"
                  placeholder="Qty"
                  value={it.qty}
                  onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })}
                />
                <input
                  className="border p-2 rounded col-span-3"
                  type="number"
                  placeholder="Unit €"
                  value={it.unit}
                  onChange={(e) => updateItem(idx, { unit: Number(e.target.value) })}
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

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          className="w-full rounded-lg px-4 py-2 font-extrabold bg-yellow-400 text-[#0B2A6F]"
          onClick={sendInvoice}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Invoice"}
        </button>
      </div>
    </main>
  );
}