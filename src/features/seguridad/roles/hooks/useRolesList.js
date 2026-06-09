import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllRoles } from '../services/rolServices';
import { useDebounce } from '@shared/hooks/useDebounce';

export const useRolesList = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [filterEstado, setFilterEstado] = useState('');

  // Obtener TODOS los roles (sin paginación ni filtros desde el backend)
  const { data: allRoles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['allRoles'],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  // Aplicar filtros localmente
  const filteredRoles = useMemo(() => {
    let result = [...allRoles];

    // Filtro por estado (activo / inactivo)
    if (filterEstado) {
      result = result.filter(rol => rol.estado === filterEstado);
    }

    // Filtro por búsqueda en nombre
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(rol => rol.nombre.toLowerCase().includes(term));
    }

    return result;
  }, [allRoles, filterEstado, debouncedSearch]);

  // Paginación local
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / perPage));
  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredRoles.slice(start, end);
  }, [filteredRoles, page, perPage]);

  // Reiniciar página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterEstado]);

  return {
    roles: paginatedRoles,
    loading: isLoading,
    error,
    page,
    setPage,
    totalPages,
    search: searchInput,
    setSearch: setSearchInput,
    filterEstado,
    setFilterEstado,
    refetch,
  };
};