import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';

import { getUserById, getAllRoles, normalizeUserInitialData } from '@seguridad';

export const useUsuario = (id) => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay id válido, no hace la llamada
    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [data, rolesData] = await Promise.all([
          getUserById(id),
          getAllRoles(),
        ]);
        setUsuario(normalizeUserInitialData(data));
        setRoles(rolesData);
      } catch {
        navigate('/admin/seguridad/usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  return { usuario, roles, loading };
};