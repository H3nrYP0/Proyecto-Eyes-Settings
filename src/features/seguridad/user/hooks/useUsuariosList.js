import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../services/userServices';
import { normalizeUsers, filtrarUsuarios } from '@seguridad';

export const useUsuariosList = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [searchInput, setSearchInput] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  // Obtener TODOS los usuarios (sin paginación ni filtros desde el backend)
  const { data: rawUsers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['allUsuarios'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
  });

  // Normalizar y filtrar clientes (excluir rol "cliente")
  const usuariosFiltradosBase = useMemo(() => {
    if (!rawUsers.length) return [];
    const normalized = normalizeUsers(rawUsers);
    // Excluir usuarios con rol "cliente" (solo administrativos)
    return normalized.filter(u => u.rol_nombre?.toLowerCase() !== 'cliente');
  }, [rawUsers]);

  // Aplicar filtros (búsqueda y estado)
  const filteredUsers = useMemo(() => {
    return filtrarUsuarios(usuariosFiltradosBase, searchInput, filterEstado);
  }, [usuariosFiltradosBase, searchInput, filterEstado]);

  // Paginación local
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, page, perPage]);

  // Reiniciar página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [searchInput, filterEstado]);

  return {
    usuarios: paginatedUsers,
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