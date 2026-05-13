// src/features/compras/pages/producto/queries/useProductoDetailQuery.js
import { useQuery } from "@tanstack/react-query";
import { getProductoById } from "../services/productosService";
import { productoKeys } from "../queryKeys";

export const useProductoDetailQuery = (id) => {
  return useQuery({
    queryKey: productoKeys.detail(id),
    queryFn: () => getProductoById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};