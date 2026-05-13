// src/features/compras/pages/producto/hooks/useProductoForm.js
import { useState, useCallback, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProductoData } from "../services/productosService";
import { UploadData } from "../../../../lib/data/uploadData";
import { useProductoExists } from "../queries/useProductoExists";
import { productoKeys } from "../queryKeys";
import { useActionBlocker } from "@shared/index";
import { useMarcasQuery } from "../queries/useMarcasQuery";
import { useCategoriasQuery } from "../queries/useCategoriasQuery";

export const useProductoForm = ({ mode, initialData, refreshMarcas = 0, refreshCategorias = 0, onSubmitSuccess, onError }) => {
  const isView = mode === "view";
  const isCreate = mode === "create";
  const isFullCreate = mode === "full-create";
  const isEdit = mode === "edit";
  
  const queryClient = useQueryClient();
  const { execute: executeSubmit, isProcessing: isSubmittingBlocked } = useActionBlocker();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precioVenta: "",
    precioCompra: "",
    stockActual: "",
    stockMinimo: "",
    categoria: "",
    marca: "",
    estado: true
  });

  const [pendingImageFiles, setPendingImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // ✅ Usar React Query para marcas y categorías
  const { data: marcas = [], isLoading: loadingMarcas } = useMarcasQuery();
  const { data: categorias = [], isLoading: loadingCategorias } = useCategoriasQuery();

  const loading = loadingMarcas || loadingCategorias;
  
  const nombreOriginal = initialData?.nombre || ""; 

  const nombreTrimmed = formData.nombre?.trim();
  const excludeId = isEdit ? initialData?.id : null;
  const shouldCheckExists = !isView && 
    ((isCreate || isFullCreate) || (isEdit && nombreTrimmed !== nombreOriginal));

  const { data: nombreExists = false, isFetching: checkingNombre } = useProductoExists(
    nombreTrimmed,
    excludeId,
    { enabled: shouldCheckExists && nombreTrimmed?.length >= 3 }
  );

  // ✅ Cargar datos iniciales cuando hay initialData
  useEffect(() => {
    if (initialData && !initialDataLoaded) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        precioVenta: initialData.precioVenta?.toString() || "",
        precioCompra: initialData.precioCompra?.toString() || "",
        stockActual: initialData.stockActual?.toString() || "",
        stockMinimo: initialData.stockMinimo?.toString() || "",
        categoria: initialData.categoria?.toString() || "",
        categoriaNombre: initialData.categoriaNombre || "",
        marca: initialData.marca?.toString() || "",
        marcaNombre: initialData.marcaNombre || "",
        estado: initialData.estado === 'activo'
      });

      if (initialData.imagenes && Array.isArray(initialData.imagenes)) {
        const imagenesConId = initialData.imagenes.map(img => ({
          id: img.id,
          url: img.url
        }));
        setImagenes(imagenesConId);
        setImagePreviews(imagenesConId.map(img => img.url));
      }
      setInitialDataLoaded(true);
    }
  }, [initialData, initialDataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (["precioVenta", "precioCompra", "stockMinimo", "stockActual"].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = useCallback((acceptedFiles) => {
    if (isEdit && !formData.estado) {
      const errorMsg = "No se pueden agregar imagenes a un producto inactivo. Activa el producto primero.";
      setErrors(prev => ({ ...prev, imagenes: errorMsg }));
      onError?.(errorMsg);
      return;
    }
    
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const totalAfterAdd = imagenes.length + pendingImageFiles.length + acceptedFiles.length;
    if (totalAfterAdd > 5) {
      setErrors(prev => ({ ...prev, imagenes: "Maximo 5 imagenes permitidas" }));
      return;
    }

    const newPending = acceptedFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setPendingImageFiles(prev => [...prev, ...newPending]);
    setImagePreviews(prev => [...prev, ...newPending.map(p => p.previewUrl)]);

    if (errors.imagenes) setErrors(prev => ({ ...prev, imagenes: "" }));
  }, [formData.estado, isEdit, imagenes.length, pendingImageFiles.length, onError, errors.imagenes]);

  const removeImage = useCallback((index) => {
    const imagenAEliminar = imagenes[index];
    if (imagenAEliminar && imagenAEliminar.id) {
      setImagenesAEliminar(prev => [...prev, imagenAEliminar.id]);
      setImagenes(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const pendingIndex = index - imagenes.length;
      if (pendingIndex >= 0 && pendingIndex < pendingImageFiles.length) {
        const pending = pendingImageFiles[pendingIndex];
        URL.revokeObjectURL(pending.previewUrl);
        setPendingImageFiles(prev => prev.filter((_, i) => i !== pendingIndex));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
      }
    }
  }, [imagenes, pendingImageFiles]);

  const formatNombre = (text) => {
    if (!text) return "";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const validateForm = () => {
    const newErrors = {};
    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");
    
    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres";
    } else if (!isView && nombreExists && nombreTrimmed !== nombreOriginal) {
      newErrors.nombre = "Ya existe un producto con este nombre";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoria es requerida";
    }

    if (!formData.marca) {
      newErrors.marca = "La marca es requerida";
    }

    if (!isCreate || isFullCreate) {
      const precioCompraNum = parseInt(formData.precioCompra, 10);
      const precioVentaNum = parseInt(formData.precioVenta, 10);

      if (!formData.precioCompra && formData.precioCompra !== "0") {
        newErrors.precioCompra = "El precio de compra es requerido";
      } else if (isNaN(precioCompraNum) || precioCompraNum < 0) {
        newErrors.precioCompra = "Debe ser un numero valido";
      }

      if (!formData.precioVenta && formData.precioVenta !== "0") {
        newErrors.precioVenta = "El precio de venta es requerido";
      } else if (isNaN(precioVentaNum) || precioVentaNum < 0) {
        newErrors.precioVenta = "Debe ser un numero valido";
      }
      if (precioCompraNum > 0 && precioVentaNum > 0 && precioCompraNum >= precioVentaNum) {
        newErrors.precioCompra = "El precio de compra no puede ser mayor o igual al precio de venta";
        newErrors.precioVenta = "El precio de venta debe ser mayor al precio de compra";
      }
        
      const stockMinimoNum = parseInt(formData.stockMinimo, 10);
      if (!formData.stockMinimo && formData.stockMinimo !== "0") {
        newErrors.stockMinimo = "El stock minimo es requerido";
      } else if (isNaN(stockMinimoNum) || stockMinimoNum < 0) {
        newErrors.stockMinimo = "No puede ser negativo";
      }

      const stockActualNum = parseInt(formData.stockActual, 10);
      if (formData.stockActual && (isNaN(stockActualNum) || stockActualNum < 0)) {
        newErrors.stockActual = "Debe ser un numero valido";
      }
    }

    if (isCreate && !isFullCreate) {
      const stockMinimoNum = parseInt(formData.stockMinimo, 10);
      if (!formData.stockMinimo && formData.stockMinimo !== "0") {
        newErrors.stockMinimo = "El stock minimo es requerido";
      } else if (isNaN(stockMinimoNum) || stockMinimoNum < 0) {
        newErrors.stockMinimo = "No puede ser negativo";
      }
    }
    
    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "No debe exceder 500 caracteres";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = useCallback(() => {
    executeSubmit(async () => {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      if (nombreExists) {
        setErrors(prev => ({ ...prev, nombre: "Ya existe un producto con este nombre" }));
        return;
      }

      setUploadingImages(true);
      
      const nombreProcesado = formData.nombre.trim().replace(/\s+/g, " ");
      const nombreFinal = formatNombre(nombreProcesado);

      const imagenesExistentes = imagenes.filter(img => img.id);
      for (const id of imagenesAEliminar) {
        try {
          await ProductoData.deleteImagen(id);
        } catch (error) {
          console.error("Error al eliminar imagen", id, error);
        }
      }
      setImagenesAEliminar([]);

      let nuevasImagenesUrls = [];
      if (pendingImageFiles.length > 0) {
        try {
          const filesToUpload = pendingImageFiles.map(p => p.file);
          nuevasImagenesUrls = await UploadData.uploadMultipleImages(filesToUpload);
          pendingImageFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
          setPendingImageFiles([]);
        } catch (error) {
          console.error("Error subiendo imagenes:", error);
          setErrors(prev => ({ ...prev, imagenes: "Error al subir imagenes. Intente de nuevo." }));
          pendingImageFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
          setPendingImageFiles([]);
          setUploadingImages(false);
          return;
        }
      }

      const nuevasImagenes = nuevasImagenesUrls.map(url => ({ url }));
      const dataToSubmit = {
        nombre: nombreFinal,
        descripcion: (formData.descripcion || "").trim(),
        imagenes: imagenesExistentes,
        nuevasImagenes: nuevasImagenes
      };

      if (isEdit) {
        dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10);
        dataToSubmit.estado = formData.estado;
        
        if (formData.categoria !== initialData?.categoria?.toString()) {
          dataToSubmit.categoria = formData.categoria;
        }
        if (formData.marca !== initialData?.marca?.toString()) {
          dataToSubmit.marca = formData.marca;
        }
      } else if (isCreate || isFullCreate) {
        dataToSubmit.categoria = formData.categoria;
        dataToSubmit.marca = formData.marca;
        dataToSubmit.precioVenta = parseInt(formData.precioVenta, 10) || 0;
        dataToSubmit.precioCompra = parseInt(formData.precioCompra, 10) || 0;
        dataToSubmit.stockActual = parseInt(formData.stockActual, 10) || 0;
        dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10) || 0;
        dataToSubmit.estado = formData.estado;
      } else {
        dataToSubmit.categoria = formData.categoria;
        dataToSubmit.marca = formData.marca;
        dataToSubmit.precioVenta = 0;
        dataToSubmit.precioCompra = 0;
        dataToSubmit.stockActual = 0;
        dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10) || 0;
        dataToSubmit.estado = true;
      }

      try {
        let result;
        if (isCreate || isFullCreate) {
          result = await ProductoData.createProducto(dataToSubmit);
          localStorage.setItem("productoNotification", JSON.stringify({
            message: "Producto creado exitosamente",
            type: "success"
          }));
        } else if (isEdit) {
          result = await ProductoData.updateProducto(initialData.id, dataToSubmit);
          localStorage.setItem("productoNotification", JSON.stringify({
            message: "Producto actualizado exitosamente",
            type: "success"
          }));
        }
        
        queryClient.invalidateQueries({ queryKey: productoKeys.all });
        
        setTimeout(() => {
          onSubmitSuccess?.(result);
        }, 300);
      } catch (error) {
        let errorMessage = "Error al guardar el producto";
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.errors) {
          const errorsData = error.response.data.errors;
          if (errorsData.precio_venta) {
            errorMessage = errorsData.precio_venta;
          } else if (errorsData.precio_compra) {
            errorMessage = errorsData.precio_compra;
          } else {
            errorMessage = Object.values(errorsData)[0];
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        localStorage.setItem("productoNotification", JSON.stringify({
          message: errorMessage,
          type: "error"
        }));
        
        if (errorMessage.toLowerCase().includes("precio")) {
          setErrors(prev => ({ 
            ...prev, 
            precioCompra: "El precio de compra no puede ser mayor o igual al precio de venta",
            precioVenta: "El precio de venta debe ser mayor al precio de compra"
          }));
        }
        
        onError?.(errorMessage);
      } finally {
        setUploadingImages(false);
      }
    });
  }, [executeSubmit, formData, imagenes, pendingImageFiles, imagenesAEliminar, isCreate, isFullCreate, isEdit, initialData, nombreExists, validateForm, formatNombre, queryClient, onSubmitSuccess, onError]);

  const resetForm = useCallback(() => {
    setFormData({
      nombre: "",
      descripcion: "",
      precioVenta: "",
      precioCompra: "",
      stockActual: "",
      stockMinimo: "",
      categoria: "",
      marca: "",
      estado: true
    });
    setImagenes([]);
    setImagePreviews([]);
    pendingImageFiles.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setPendingImageFiles([]);
    setImagenesAEliminar([]);
    setErrors({});
    setInitialDataLoaded(false);
  }, [pendingImageFiles]);

  return {
    formData,
    errors,
    nombreExists,
    checkingNombre,
    marcas,
    categorias,
    loading,
    isView,
    isCreate,
    isFullCreate,
    isEdit,
    imagenes,
    imagePreviews,
    uploadingImages,
    isSubmitting: isSubmittingBlocked,
    handleChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    setFormData
  };
};