import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const TABLES = {
  Client: "clients",
  Contract: "contracts",
  Product: "products",
  Banner: "banners",
  Technician: "technicians",
  Task: "tasks",
  Transaction: "transactions",
  ServiceReport: "service_reports",
};

const adminEmails = () =>
  String(import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
}

function mapRow(row) {
  if (!row) return row;
  return {
    ...row,
    created_date: row.created_date || row.created_at,
    updated_date: row.updated_date || row.updated_at,
    full_name: row.full_name || row.name,
  };
}

function dbColumn(name) {
  if (name === "created_date") return "created_at";
  if (name === "updated_date") return "updated_at";
  return name;
}

function applySort(query, sort) {
  if (typeof sort !== "string" || !sort) return query;
  const descending = sort.startsWith("-");
  const column = dbColumn(descending ? sort.slice(1) : sort);
  return query.order(column, { ascending: !descending });
}

async function currentProfile() {
  const client = requireSupabase();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) {
    throw Object.assign(new Error("Not authenticated"), { status: 401 });
  }

  const { data: profile } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const email = user.email || profile?.email || "";
  const role =
    profile?.role || (adminEmails().includes(email.toLowerCase()) ? "admin" : "user");

  return {
    id: user.id,
    email,
    role,
    full_name: profile?.full_name || user.user_metadata?.full_name || email,
    ...profile,
  };
}

function entityApi(table) {
  return {
    async list(sort) {
      if (!isSupabaseConfigured) return [];
      let query = applySort(supabase.from(table).select("*"), sort);
      const { data, error } = await query;
      if (error) {
        console.error(`[${table}.list]`, error);
        return [];
      }
      return (data || []).map(mapRow);
    },
    async filter(match = {}, sort) {
      if (!isSupabaseConfigured) return [];
      let query = supabase.from(table).select("*");
      for (const [key, value] of Object.entries(match)) {
        query = query.eq(key, value);
      }
      query = applySort(query, sort);
      const { data, error } = await query;
      if (error) {
        console.error(`[${table}.filter]`, error);
        return [];
      }
      return (data || []).map(mapRow);
    },
    async create(payload) {
      const client = requireSupabase();
      const { data, error } = await client.from(table).insert(payload).select().single();
      if (error) throw error;
      return mapRow(data);
    },
    async update(id, payload) {
      const client = requireSupabase();
      const { data, error } = await client.from(table).update(payload).eq("id", id).select().single();
      if (error) throw error;
      return mapRow(data);
    },
    async delete(id) {
      const client = requireSupabase();
      const { error } = await client.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}

export const base44 = {
  auth: {
    async loginViaEmailPassword(email, password) {
      const client = requireSupabase();
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async me() {
      return currentProfile();
    },
    async logout(redirectUrl) {
      if (supabase) await supabase.auth.signOut();
      if (redirectUrl) {
        window.location.href = "/";
      }
    },
    redirectToLogin() {
      window.location.href = "/login";
    },
    async register({ email, password }) {
      const client = requireSupabase();
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
    },
    async verifyOtp({ email, otpCode }) {
      const client = requireSupabase();
      const { data, error } = await client.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });
      if (error) throw error;
      return { access_token: data.session?.access_token };
    },
    setToken() {
      return undefined;
    },
    async resendOtp(email) {
      const client = requireSupabase();
      const { error } = await client.auth.resend({ type: "signup", email });
      if (error) throw error;
    },
    loginWithProvider(provider, returnTo = "/") {
      const client = requireSupabase();
      const redirectTo = `${window.location.origin}${returnTo || "/"}`;
      client.auth.signInWithOAuth({ provider, options: { redirectTo } });
    },
    async resetPasswordRequest(email) {
      const client = requireSupabase();
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },
    async resetPassword({ newPassword }) {
      const client = requireSupabase();
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
  },
  entities: Object.fromEntries(
    Object.entries(TABLES).map(([name, table]) => [name, entityApi(table)])
  ),
  integrations: {
    Core: {
      async UploadFile({ file }) {
        const client = requireSupabase();
        const safeName = String(file?.name || "arquivo").replace(/[^\w.\-]+/g, "_");
        const path = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const { error } = await client.storage.from("uploads").upload(path, file, {
          upsert: false,
          contentType: file.type || undefined,
        });
        if (error) throw error;
        const { data } = client.storage.from("uploads").getPublicUrl(path);
        return { file_url: data.publicUrl };
      },
    },
  },
  functions: {
    async invoke(name, payload = {}) {
      if (name === "sendPasswordResetLink") {
        await base44.auth.resetPasswordRequest(payload.email);
        return { success: true };
      }
      if (name === "sendTechnicianAccess") {
        const client = requireSupabase();
        const { data, error } = await client.functions.invoke("send-technician-access", {
          body: payload,
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        return data;
      }
      throw new Error(`Function not found: ${name}`);
    },
  },
};
