const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.57.4");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const siteUrl = Deno.env.get("SITE_URL") || "https://raenergetica.vercel.app";

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const adminEmails = ["dione2010@gmail.com", "prof-dione-soares@hotmail.com"];
    const isAdmin =
      profile?.role === "admin" || adminEmails.includes(String(user.email || "").toLowerCase());
    if (!isAdmin) {
      return Response.json({ error: "Forbidden" }, { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const name = body?.name || "Administrador";
    const password = String(body?.password || "");
    const action = String(body?.action || "upsert");

    if (!email) {
      return Response.json({ error: "Email é obrigatório" }, { status: 400, headers: corsHeaders });
    }

    const loginUrl = `${siteUrl.replace(/\/$/, "")}/admin/login`;

    const { data: list } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = (list?.users || []).find((item) => String(item.email || "").toLowerCase() === email);

    if (action === "revoke") {
      if (!existing) {
        return Response.json({ error: "Usuário não encontrado" }, { status: 404, headers: corsHeaders });
      }
      if (existing.id === user.id) {
        return Response.json({ error: "Você não pode remover o próprio acesso." }, { status: 400, headers: corsHeaders });
      }
      const { error: updateError } = await adminClient
        .from("profiles")
        .update({ role: "user" })
        .eq("id", existing.id);
      if (updateError) throw updateError;
      return Response.json({ success: true, message: `Acesso administrativo removido de ${email}` }, { headers: corsHeaders });
    }

    if (password && password.length < 6) {
      return Response.json({ error: "A senha deve ter no mínimo 6 caracteres" }, { status: 400, headers: corsHeaders });
    }

    let userId = existing?.id;
    if (!existing) {
      if (!password) {
        return Response.json({ error: "Defina uma senha para o novo administrador." }, { status: 400, headers: corsHeaders });
      }
      const { data: created, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: name, role: "admin" },
      });
      if (createError) throw createError;
      userId = created?.user?.id;
    } else {
      const updatePayload = {
        email_confirm: true,
        user_metadata: { full_name: name, role: "admin" },
      };
      if (password) updatePayload.password = password;
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existing.id, updatePayload);
      if (updateError) throw updateError;
    }

    if (userId) {
      const { error: profileError } = await adminClient
        .from("profiles")
        .upsert({ id: userId, email, full_name: name, role: "admin" }, { onConflict: "id" });
      if (profileError) {
        await adminClient.from("profiles").update({ full_name: name, role: "admin", email }).eq("id", userId);
      }
    }

    return Response.json(
      {
        success: true,
        message: `Acesso de administrador liberado para ${email}`,
        adminLoginUrl: loginUrl,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
});
