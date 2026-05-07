import { useQuery } from "@tanstack/react-query";
import { ProductoData } from "../services/productosService";
import { marcasService as MarcaData } from "../../marca/services/marcasService";
import { getAllCategorias } from "../../categoria/services/categoriasService";
import { productoKeys } from "../queryKeys";

export const useProductosQuery = () => {
  return useQuery({
    queryKey: productoKeys.all,
    queryFn: async () => {
      const [productos, marcas, categorias] = await Promise.all([
        ProductoData.getAllProductos(),
        MarcaData.getAllMarcas(),
        getAllCategorias()
      ]);

      return { productos, marcas, categorias };
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};