import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

async function withTimeout(promise, ms, fallback) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((resolve) => {
        timer = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: "raenergetica",
    public_settings: {},
  });

  const applySession = useCallback(async (session) => {
    if (!session) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      return null;
    }
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
      return currentUser;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      if (!isSupabaseConfigured) {
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
      const result = await withTimeout(supabase.auth.getSession(), 8000, { data: { session: null } });
      const session = result?.data?.session || null;
      return await applySession(session);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [applySession]);

  useEffect(() => {
    checkUserAuth();
    if (!isSupabaseConfigured) return undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
      setAuthChecked(true);
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
    // Mount once: auth subscription + first session check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      base44.auth.logout("/");
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/admin/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState: checkUserAuth,
        setIsLoadingPublicSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
