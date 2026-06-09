import { useQuery } from "@tanstack/react-query";
import { marcasService } from "@compras/marca/services/marcasService";

export const useMarcasQuery = (refreshKey = 0) => {
  return useQuery({
    queryKey: ["marcas", "all", refreshKey],
    queryFn: () => marcasService.getAllMarcas(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (data) => data.filter(m => m.estado === true)
  });
};