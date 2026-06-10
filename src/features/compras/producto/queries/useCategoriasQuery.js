import { useQuery } from "@tanstack/react-query";
import { getAllCategorias } from "@compras/categoria/services/categoriasService";

export const useCategoriasQuery = (refreshKey = 0) => {
  return useQuery({
    queryKey: ["categorias", "all", refreshKey],
    queryFn: () => getAllCategorias(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.filter(c => c.estado === true)
  });
};