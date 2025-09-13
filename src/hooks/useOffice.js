// src/hooks/useOffices.js
import { useState, useEffect, useCallback } from "react";

export default function useOffices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/offices/`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setOffices(data || []);
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { offices, loading, error, refresh };
}
