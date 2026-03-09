import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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
  } catch {
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialState);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Use a ref so refreshProfile / useEffects can always read latest user
  // WITHOUT putting user in their dependency arrays (which causes infinite loops)
  const authStateRef = useRef(authState);
  useEffect(() => {
    authStateRef.current = authState;
  }, [authState]);

  // Track whether we've already done the initial profile fetch
  const initDoneRef = useRef(false);

  const logout = useCallback(() => {
    setAuthState({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    initDoneRef.current = false;
  }, []);

  // Stable function — no user in deps, reads via ref instead
  const refreshProfile = useCallback(async () => {
    const currentUser = authStateRef.current.user;
    if (!currentUser?.id) return null;

    try {
      const payload = await AuthService.getProfile(currentUser.id);
      if (payload?.success && payload?.data) {
        const merged = { ...currentUser, ...payload.data };
        setAuthState((prev) => ({ ...prev, user: merged }));
        localStorage.setItem("user", JSON.stringify(merged));
        return merged;
      }
      return currentUser;
    } catch (error) {
      console.error("Failed to refresh profile", error);
      if (error?.response?.status === 401) {
        logout();
      }
      return currentUser;
    }
  }, [logout]); // logout is stable — no user dependency

  // ---- ONE-TIME initialization effect ----
  // Runs once on mount (and if token changes) to validate token + fetch profile
  useEffect(() => {
    const { token, user } = authStateRef.current;

    if (!token) {
      setInitializing(false);
      return;
    }

    // Validate token expiry
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        setInitializing(false);
        return;
      }
    } catch {
      logout();
      setInitializing(false);
      return;
    }

    // If we already have user data cached, no need to fetch again
    if (user && initDoneRef.current) {
      setInitializing(false);
      return;
    }

    // Fetch fresh profile once
    initDoneRef.current = true;
    refreshProfile().finally(() => setInitializing(false));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Empty deps = run only on mount. Token changes (login/logout) are handled
  // by login() and logout() directly updating state.

  // Persist token/user to localStorage whenever they change
  useEffect(() => {
    const { token, user } = authState;
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [authState]);

  const login = useCallback(async (credentials) => {
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
          email: session.email ?? session.user?.email ?? null,
        };
        const newState = { token: session.token, user: normalizedUser };
        setAuthState(newState);
        initDoneRef.current = true;
      }
      return payload;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const value = {
    user: authState.user,
    token: authState.token,
    initializing,
    authLoading,
    login,
    logout,
    refreshProfile,
    registerCustomer: AuthService.registerCustomer,
    registerSeller: AuthService.registerSeller,
    verifyOtp: AuthService.verifyOtp,
    resendOtp: AuthService.resendOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
