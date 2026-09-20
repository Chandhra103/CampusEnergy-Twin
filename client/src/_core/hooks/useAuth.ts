import { useState, useEffect } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: "Demo User",
    email: "demo@example.com",
  });
  const [error, setError] = useState<string | null>(null);

  const logout = () => setUser(null);

  return {
    loading,
    user,
    error,
    isAuthenticated: !!user,
    logout,
  };
}
