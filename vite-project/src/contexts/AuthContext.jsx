import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import * as AuthService from "../services/AuthService";

const AuthContext = createContext({
  user: null,
  token: null,
  initializing: true,
  authLoading: false,
  login: async () => {},
  logout: () => {},
  registerCustomer: async () => {},
  registerSeller: async () => {},
  verifyOtp: async () => {},
  resendOtp: async () => {},
  refreshProfile: async () => {},
});

const getInitialState = () => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    return {
      token: storedToken || null,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  } catch (error) {
    console.warn("Failed to parse stored auth state", error);
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuthState] = useState(getInitialState);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const updateState = useCallback((next) => {
    setAuthState((prev) => ({ ...prev, ...next }));
  }, []);

  const logout = useCallback(() => {
    setAuthState({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) {
      setInitializing(false);
      return null;
    }

    try {
      const payload = await AuthService.getProfile(user.id);
      if (payload?.success && payload?.data) {
        updateState({ user: { ...user, ...payload.data } });
        return payload.data;
      }
    } catch (error) {
      console.error("Failed to refresh profile", error);
      logout();
    } finally {
      setInitializing(false);
    }

    return null;
  }, [logout, updateState, user]);

  const login = useCallback(
    async (credentials) => {
      setAuthLoading(true);
      try {
        const payload = await AuthService.login(credentials);
        const session = payload?.data;
        if (payload?.success && session?.token) {
          const normalizedUser = {
            id: session.id ?? session.userId ?? session.user?.id,
            phone: session.phone ?? session.user?.phone ?? null,
            role: session.role ?? session.user?.role ?? null,
            name: session.name ?? session.user?.name ?? null,
            status: session.status ?? session.user?.status ?? null,
          };

          updateState({ token: session.token, user: normalizedUser });
          localStorage.setItem("token", session.token);
          localStorage.setItem("user", JSON.stringify(normalizedUser));
        }

        return payload;
      } finally {
        setAuthLoading(false);
      }
    },
    [updateState],
  );

  useEffect(() => {
    if (!token) {
      setInitializing(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        setInitializing(false);
        return;
      }
    } catch (error) {
      console.warn("Invalid token stored, clearing auth state", error);
      logout();
      setInitializing(false);
      return;
    }

    if (!user) {
      refreshProfile();
    } else {
      setInitializing(false);
    }
  }, [token, user, logout, refreshProfile]);

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }, [token, user]);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      authLoading,
      login,
      logout,
      registerCustomer: AuthService.registerCustomer,
      registerSeller: AuthService.registerSeller,
      verifyOtp: AuthService.verifyOtp,
      resendOtp: AuthService.resendOtp,
      refreshProfile,
    }),
    [
      authLoading,
      initializing,
      login,
      logout,
      refreshProfile,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

