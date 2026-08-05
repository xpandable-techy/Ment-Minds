// supabase/functions/invite-mentor/index.ts
//
// Admin-only: creates a real MentMinds mentor account and emails the
// mentor a secure link to set their own password. This is the only place
// in the whole project that touches the Supabase service_role key — it
// runs on Supabase's servers, never in the browser, so the key is never
// exposed to anyone. No password ever passes through the admin dashboard
// or gets stored anywhere in plaintext; Supabase Auth never makes a
// password retrievable to anyone, including admins, by design.
//
// Deploy with:  supabase functions deploy invite-mentor
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically
// by the Supabase platform to every Edge Function — nothing to configure.)

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return json({ error: "Missing Authorization header." }, 401);
    }

    // A client scoped to the CALLER's own JWT, used only to verify who is
    // asking. This never touches the service role key.
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: callerData, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !callerData?.user) {
      return json({ error: "Could not verify the calling account." }, 401);
    }

    const { data: callerProfile, error: profileError } = await callerClient
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .maybeSingle();

    if (profileError || callerProfile?.role !== "admin") {
      return json({ error: "Only admin accounts can invite mentors." }, 403);
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.fullName || "").trim();
    const phoneWhatsApp = String(body.phoneWhatsApp || "").trim();
    const bio = String(body.bio || "").trim();
    const interests: string[] = Array.isArray(body.interests) ? body.interests : [];

    if (!email || !email.includes("@") || !fullName) {
      return json({ error: "A valid email and full name are required." }, 400);
    }

    // Only this server-side call, using the service role key, can create a
    // real auth account and send Supabase's invite email in one step.
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName },
      redirectTo: Deno.env.get("SITE_URL") || undefined,
    });

    if (inviteError) {
      return json({ error: inviteError.message }, 400);
    }

    const newUserId = inviteData.user.id;

    // The invite fires the same handle_new_user trigger as a normal signup
    // (creating a bare profiles row), so finish filling it in as 'mentor'.
    // This runs with the service role, bypassing RLS — safe here because
    // this whole function only runs after the admin check above.
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        role: "mentor",
        full_name: fullName,
        phone_whatsapp: phoneWhatsApp || null,
        bio: bio || null,
        interests,
        status: "Active Mentor",
      })
      .eq("id", newUserId);

    if (updateError) {
      return json({ error: `Account created, but the profile update failed: ${updateError.message}` }, 500);
    }

    return json({ success: true, userId: newUserId, email }, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected error." }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
