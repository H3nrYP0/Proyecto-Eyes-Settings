import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';

import { normalizarRolInitialData, getRolById, getAllPermisos } from '@seguridad';

// Carga el rol y los permisos disponibles por ID
export const useRol = (id) => {
  const navigate = useNavigate();

  const [rol, setRol]                             = useState(null);
  const [permisosDisponibles, setPermisos]        = useState([]);
  const [loading, setLoading]                     = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rolData, permisosData] = await Promise.all([
          getRolById(id),
          getAllPermisos(),
        ]);

        if (!rolData) {
          navigate('/admin/seguridad/roles');
          return;
        }

        setRol(normalizarRolInitialData(rolData));
        setPermisos(permisosData || []);
      } catch {
        navigate('/admin/seguridad/roles');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  return { rol, permisosDisponibles, loading };
};