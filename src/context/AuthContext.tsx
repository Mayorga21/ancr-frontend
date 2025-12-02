import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

type Role = "admin" | "pastor" | "iglesia";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  district_id: number | null;
  church_id: number | null;
}

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, district_id, church_id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error cargando profile:", error.message);
        return null;
      }

      return data as Profile | null;
    } catch (err) {
      console.error("Error en fetchProfile:", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error obteniendo sesión:", error);
          return;
        }

        if (!mounted) return;

        setSession(currentSession || null);

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error en init:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth event:", event);

      if (!mounted) return;

      if (event === "SIGNED_IN" && currentSession?.user) {
        setSession(currentSession);
        const profileData = await fetchProfile(currentSession.user.id);
        setProfile(profileData);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setProfile(null);
      } else if (event === "TOKEN_REFRESHED" && currentSession) {
        setSession(currentSession);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);

      // Limpiar estado local primero
      setSession(null);
      setProfile(null);

      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error en signOut:", error.message);
      }

      // Limpiar localStorage manualmente por si acaso
      localStorage.removeItem("supabase.auth.token");

      // Redirigir al home
      window.location.href = "/";
    } catch (err) {
      console.error("Error inesperado en logout:", err);
      // Forzar limpieza y redirección incluso si hay error
      setSession(null);
      setProfile(null);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);