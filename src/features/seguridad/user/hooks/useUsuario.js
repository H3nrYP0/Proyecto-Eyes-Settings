import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../services/userServices';
import { getAllRoles } from '@seguridad/roles/services/rolServices';
import { normalizeUserInitialData } from '../utils/userNormalizer';

export const useUser = (id) => {
  const navigate = useNavigate();

  // ['usuario', id] — solo el usuario normalizado, mismo formato que EditarUsuario
  const { data: user, isLoading: loadingUser, error } = useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const data = await getUserById(id);
      if (!data) throw new Error('Usuario no encontrado');
      return normalizeUserInitialData(data);
    },
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // ['roles'] — caché global compartido con GestionUsuarios, CrearUsuario, EditarUsuario
  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  if (error?.message === 'Usuario no encontrado') {
    navigate('/admin/seguridad/usuarios');
  }

  return {
    user: user || null,
    roles,
    loading: loadingUser || loadingRoles,
    error,
  };
};