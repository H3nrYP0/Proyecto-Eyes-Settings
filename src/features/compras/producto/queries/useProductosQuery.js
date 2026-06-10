import api from "@lib/axios";
import { useQuery } from "@tanstack/react-query";
import { productoKeys } from "../queryKeys";

export const useProductosQuery = (page = 1, perPage = 10, filters = {}) => {
  return useQuery({
    queryKey: productoKeys.list({ page, perPage, ...filters }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.categoria_id) params.append('categoria_id', filters.categoria_id);
      if (filters.marca_id) params.append('marca_id', filters.marca_id);
      // Convertir estado a booleano string
      if (filters.estado) {
        const estadoBool = filters.estado === 'activa' ? 'true' : 'false';
        params.append('estado', estadoBool);
      }
      // Filtros adicionales opcionales
      if (filters.min_precio) params.append('min_precio', filters.min_precio);
      if (filters.max_precio) params.append('max_precio', filters.max_precio);
      if (filters.stock_minimo) params.append('stock_minimo', filters.stock_minimo);

      const response = await api.get(`/productos?${params.toString()}`);

      // El backend devuelve { data: [], pagination: {...} }
      return {
        items: response.data.data,
        totalPages: response.data.pagination.total_pages,
        currentPage: response.data.pagination.current_page,
        totalCount: response.data.pagination.total,
        hasNext: response.data.pagination.has_next,
        hasPrev: response.data.pagination.has_prev,
      };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};