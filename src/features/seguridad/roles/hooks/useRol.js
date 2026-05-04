import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getRolById, getAllPermisos, normalizarRolInitialData } from '@seguridad';

export const useRol = (id) => {
  const navigate = useNavigate();

  // IMPORTANTE: queryKey ['rol', id] guarda SOLO el rol normalizado,
  // igual que EditarPermisos — así comparten caché sin conflicto.
  const { data: rolData, isLoading: loadingRol, error } = useQuery({
    queryKey: ['rol', id],
    queryFn: async () => {
      const rol = await getRolById(id);
      if (!rol) throw new Error('Rol no encontrado');
      return normalizarRolInitialData(rol);
    },
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: permisosDisponibles = [], isLoading: loadingPermisos } = useQuery({
    queryKey: ['permisos'],
    queryFn: getAllPermisos,
    staleTime: 5 * 60 * 1000,
  });

  if (error?.message === 'Rol no encontrado') {
    navigate('/admin/seguridad/roles');
  }

  return {
    rol: rolData || null,
    permisosDisponibles,
    loading: loadingRol || loadingPermisos,
    error,
  };
};