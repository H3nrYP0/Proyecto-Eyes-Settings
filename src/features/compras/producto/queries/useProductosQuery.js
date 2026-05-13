// src/features/compras/pages/producto/queries/useProductosQuery.js
import api from "@lib/axios";
import { useQuery } from "@tanstack/react-query";
import { productoKeys } from "../queryKeys";

export const useProductosQuery = (page = 1, perPage = 20, filters = {}) => {
  return useQuery({
    queryKey: productoKeys.list({ page, perPage, ...filters }),
    queryFn: async () => {
      // Determinar qué endpoint usar basado en si hay filtros
      const hasFilters = filters.search || filters.categoria_id || filters.marca_id || filters.estado;
      
      let url;
      if (hasFilters) {
        // Usar nuevo endpoint optimizado para búsquedas
        url = '/productos/buscar-avanzado';
      } else {
        url = '/productos/lista-completa';
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (filters.search) params.append('search', filters.search);
      if (filters.categoria_id) params.append('categoria_id', filters.categoria_id);
      if (filters.marca_id) params.append('marca_id', filters.marca_id);
      if (filters.estado) params.append('estado', filters.estado);
      
      const response = await api.get(`${url}?${params}`);
      
      // Ambos endpoints devuelven el mismo formato
      return {
        items: response.data.data,
        totalPages: response.data.pagination.total_pages,
        currentPage: response.data.pagination.current_page,
        totalCount: response.data.pagination.total,
        hasNext: response.data.pagination.has_next,
        hasPrev: response.data.pagination.has_prev
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10,
  });
};


