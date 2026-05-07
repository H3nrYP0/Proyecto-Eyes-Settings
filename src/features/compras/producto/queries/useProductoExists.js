import { useQuery } from "@tanstack/react-query";
import { ProductoData } from "../services/productosService";
import { productoKeys } from "../queryKeys";

export const useProductoExists = (nombre, excludeId, options = {}) => {
  const isEnabled = nombre?.trim().length >= 3 && options.enabled !== false;
  
  return useQuery({
    queryKey: productoKeys.exists(nombre),
    queryFn: () => ProductoData.checkProductoExists(nombre, excludeId),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};