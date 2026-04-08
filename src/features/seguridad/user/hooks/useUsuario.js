import { useState, useEffect } from 'react';
import { getUserById } from '../services/userServices';
import { getAllRoles } from '@seguridad/roles/services/rolServices';
import { normalizeUserInitialData } from '../utils/userNormalizer';

export const useUser = (id) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [data, rolesData] = await Promise.all([
          getUserById(id),
          getAllRoles(),
        ]);
        
        const normalizedUser = normalizeUserInitialData(data);
        setUser(normalizedUser);
        setRoles(rolesData);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        setError(err.message || 'Error al cargar usuario');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { user, roles, loading, error };
};