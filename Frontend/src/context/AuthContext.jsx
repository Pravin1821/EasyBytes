import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const storageKey = "chatapp.auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "testuser",
    displayName: "Test User",
    email: "testuser@example.com",
  });
  const [token, setToken] = useState("mock-jwt-token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem(storageKey);
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        console.warn("Failed to parse persisted auth:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }

    if (user && token) {
      localStorage.setItem(storageKey, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [user, token]);

  const login = async ({ usernameOrEmail, password }) => {
    const response = await api.post("/auth/login", {
      usernameOrEmail,
      password,
    });
    const payload = response.data;
    setUser(payload.user);
    setToken(payload.accessToken);
    return payload;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(storageKey);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
