import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  if (!phone || !code) return NextResponse.json({ error: "Phone and code required" }, { status: 400 });

  const { data: otp } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("phone", phone)
    .eq("code", code)
    .eq("used", false)
    .gte("expires_at", new Date().toISOString())
    .single();

  if (!otp) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  await supabase.from("otp_codes").update({ used: true }).eq("id", otp.id);

  const fakeEmail = `${phone.replace(/\+/g, "").replace(/\s/g, "")}@glamhub.app`;

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === fakeEmail);

  if (!existing) {
    await supabase.auth.admin.createUser({
      email: fakeEmail,
      email_confirm: true,
      user_metadata: { phone },
    });
  }

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: fakeEmail,
  });

  if (linkError || !linkData) return NextResponse.json({ error: "Session error" }, { status: 500 });

  const url = new URL(linkData.properties.action_link);
  const token_hash = url.searchParams.get("token_hash") || url.hash.split("token=")[1]?.split("&")[0];

  return NextResponse.json({ success: true, token_hash, email: fakeEmail });
}
