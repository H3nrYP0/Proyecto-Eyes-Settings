import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getRolById, getAllPermisos, normalizarRolInitialData } from '@seguridad';

export const useRol = (id) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['rol', id],
    queryFn: async () => {
      const [rolData, permisosData] = await Promise.all([
        getRolById(id),
        getAllPermisos(),
      ]);
      if (!rolData) {
        throw new Error('Rol no encontrado');
      }
      return {
        rol: normalizarRolInitialData(rolData),
        permisosDisponibles: permisosData || [],
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Redirige si el rol no existe
  if (error?.message === 'Rol no encontrado') {
    navigate('/admin/seguridad/roles');
  }

  return {
    rol: data?.rol || null,
    permisosDisponibles: data?.permisosDisponibles || [],
    loading: isLoading,
    error,
  };
};