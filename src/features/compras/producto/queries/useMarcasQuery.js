// src/features/compras/pages/producto/queries/useMarcasQuery.js
import { useQuery } from "@tanstack/react-query";
import { marcasService } from "@compras/marca/services/marcasService";

export const useMarcasQuery = () => {
  return useQuery({
    queryKey: ["marcas", "all"],
    queryFn: () => marcasService.getAllMarcas(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.filter(m => m.estado === true)
  });
};