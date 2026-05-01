import { useQuery } from '@tanstack/react-query';
import { getUserById, getAllRoles, normalizeUserInitialData } from '@seguridad'

export const useUsuario = (id) => {
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const [userData, rolesData] = await Promise.all([
        getUserById(id),
        getAllRoles(),
      ]);
      return {
        user: normalizeUserInitialData(userData),
        roles: rolesData,
      };
    },
    enabled: !!id, // Solo ejecuta si hay id
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: data?.user || null,
    roles: data?.roles || [],
    loading: isLoading,
    error,
  };
};