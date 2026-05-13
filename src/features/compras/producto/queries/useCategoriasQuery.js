// src/features/compras/pages/producto/queries/useCategoriasQuery.js
import { useQuery } from "@tanstack/react-query";
import { getAllCategorias } from "@compras/categoria/services/categoriasService";

export const useCategoriasQuery = () => {
  return useQuery({
    queryKey: ["categorias", "all"],
    queryFn: () => getAllCategorias(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.filter(c => c.estado === true)
  });
};