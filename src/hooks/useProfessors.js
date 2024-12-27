// src/hooks/useProfessors.js
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';

const useProfessors = () => {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase.from('faculty').select('*');
      if (error) throw error;
      setProfessors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  return { professors, loading, error };
};

export default useProfessors;
