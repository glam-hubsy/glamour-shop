import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await supabase.from("otp_codes").delete().eq("phone", phone).eq("used", false);

  const { error: dbError } = await supabase.from("otp_codes").insert({ phone, code, expires_at });
  if (dbError) return NextResponse.json({ error: "DB error" }, { status: 500 });

  const res = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
    },
    body: JSON.stringify({
      from: "GlamHub",
      to: phone,
      text: `${code} هو رمز التحقق الخاص بك في GlamHub. صالح لمدة 5 دقائق.`,
      messaging_profile_id: process.env.TELNYX_PROFILE_ID,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
