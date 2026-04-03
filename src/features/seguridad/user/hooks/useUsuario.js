import { useState, useEffect } from 'react';

import { getUserById, normalizeUserInitialData, getAllRoles } from '@seguridad';

// Carga el usuario y los roles disponibles por ID
export const useUsuario = (id) => {
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data, rolesData] = await Promise.all([
          getUserById(id),
          getAllRoles(),
        ]);
        setUsuario(normalizeUserInitialData(data));
        setRoles(rolesData);
      } catch {
        alert('Error al cargar usuario');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  return { usuario, roles, loading };
};