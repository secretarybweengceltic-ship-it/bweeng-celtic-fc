import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ADMIN_EMAILS = ["pro.bweeng.celtic@gmail.com"].map((e) => e.toLowerCase());

export async function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;

  if (!token) {
    return { ok: false, status: 401, error: "Missing Authorization Bearer token" } as const;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401, error: "Invalid or expired token" } as const;
  }

  const email = (data.user.email || "").toLowerCase();
  if (!ADMIN_EMAILS.includes(email)) {
    return { ok: false, status: 403, error: "Access denied (not admin)" } as const;
  }

  return { ok: true, user: data.user } as const;
}