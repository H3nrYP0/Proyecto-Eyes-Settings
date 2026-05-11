// src/features/compras/pages/producto/mutations/useProductoMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductoData } from "../services/productosService";
import { productoKeys } from "../queryKeys";

// Función para extraer mensaje de error del backend
const extractErrorMessage = (error) => {  
  // Si el backend devuelve { message: "..." }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Si el backend devuelve { error: "..." }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // Si son errores de validación por campos
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (typeof errors === 'object') {
      // Buscar errores relacionados con precios
      if (errors.precio_compra) return errors.precio_compra;
      if (errors.precio_venta) return errors.precio_venta;
      if (errors.precio) return errors.precio;
      
      // Tomar el primer error disponible
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError)) return firstError[0];
      if (typeof firstError === 'string') return firstError;
    }
  }
  
  // Error específico de relación precio compra/venta
  if (error.response?.data?.includes?.('precio') || 
      error.message?.includes?.('precio') ||
      error.response?.data?.toLowerCase?.()?.includes?.('precio')) {
    return " El precio de compra no puede ser mayor o igual al precio de venta. El precio de venta debe ser mayor al precio de compra.";
  }
  
  // Error genérico
  return error.response?.data?.message || error.message || "Error al guardar el producto";
};

export const useProductoMutations = () => {
  const queryClient = useQueryClient();

  // CREATE
  const createProducto = useMutation({
    mutationFn: ProductoData.createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
    },
    onError: (error) => {
      const userMessage = extractErrorMessage(error);
      error.userMessage = userMessage;
      return Promise.reject(error);
    },
  });

  // UPDATE
  const updateProducto = useMutation({
    mutationFn: ({ id, data }) => ProductoData.updateProducto(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
      queryClient.invalidateQueries({
        queryKey: productoKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      const userMessage = extractErrorMessage(error);
      error.userMessage = userMessage;
      return Promise.reject(error);
    },
  });

  // DELETE
  const deleteProducto = useMutation({
    mutationFn: async (id) => {
      const { tieneAsociaciones, detalles } = await ProductoData.hasProductoAsociaciones(id);

      if (tieneAsociaciones) {
        const tipos = [];
        if (detalles?.compras) tipos.push("compras");
        if (detalles?.ventas) tipos.push("ventas");
        if (detalles?.pedidos) tipos.push("pedidos");

        throw new Error(
          `No se puede eliminar porque está asociado a: ${tipos.join(", ")}`
        );
      }

      return ProductoData.deleteProducto(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
    },
    onError: (error) => {
      const userMessage = extractErrorMessage(error);
      error.userMessage = userMessage;
      return Promise.reject(error);
    },
  });

  // Cambiar estado
  const updateEstado = useMutation({
    mutationFn: ({ id, estado }) => ProductoData.updateEstadoProducto(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productoKeys.all });
    },
    onError: (error) => {
      const userMessage = extractErrorMessage(error);
      error.userMessage = userMessage;
      return Promise.reject(error);
    },
  });

  return {
    createProducto,
    updateProducto,
    deleteProducto,
    updateEstado,
  };
};