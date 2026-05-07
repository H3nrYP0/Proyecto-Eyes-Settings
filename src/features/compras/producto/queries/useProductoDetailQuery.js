import { useQuery } from "@tanstack/react-query";
import { getProductoById } from "../services/productosService";
import { productoKeys } from "../queryKeys";

export const useProductoDetailQuery = (id) => {
  return useQuery({
    queryKey: productoKeys.detail(id),
    queryFn: () => getProductoById(id),
    enabled: !!id,
  });
};