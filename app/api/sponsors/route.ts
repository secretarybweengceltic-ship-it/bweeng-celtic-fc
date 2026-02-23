import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("sponsors")
    .select("id,name,logo_url,website_url,sort_order,active")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sponsors: data ?? [] }, { status: 200 });
}

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json();

  const { name, logo_url, website_url, sort_order = 0, active = true } = body;

  const { data, error } = await supabase
    .from("sponsors")
    .insert({ name, logo_url, website_url, sort_order, active })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sponsor: data }, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = supabaseServer();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase
    .from("sponsors")
    .update({ active: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 200 });
}