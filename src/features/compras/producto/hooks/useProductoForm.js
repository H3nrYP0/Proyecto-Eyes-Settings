// src/features/compras/pages/producto/hooks/useProductoForm.js
import { useState, useEffect, useCallback, useRef } from "react";
import { ProductoData } from "../services/productosService";
import { marcasService as MarcaData } from "/src/features/compras/marca/services/marcasService.js";
import { getAllCategorias } from "../../categoria/services/categoriasService";
import { UploadData } from "../../../../lib/data/uploadData";

export const useProductoForm = ({ mode, initialData, refreshMarcas = 0, refreshCategorias = 0, onSubmitSuccess, onError }) => {
  const isView = mode === "view";
  const isCreate = mode === "create";
  const isFullCreate = mode === "full-create";

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

  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreExists, setNombreExists] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const marcasCargadasRef = useRef(false);
  const categoriasCargadasRef = useRef(false);
  const abortControllerRef = useRef(null);
  
  const onErrorRef = useRef(onError);
  const onSubmitSuccessRef = useRef(onSubmitSuccess);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onSubmitSuccessRef.current = onSubmitSuccess;
  }, [onSubmitSuccess]);

  const loadMarcasYCategorias = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const promises = [];
      if (!marcasCargadasRef.current) {
        promises.push(MarcaData.getAllMarcas());
      }
      if (!categoriasCargadasRef.current) {
        promises.push(getAllCategorias());
      }
      
      if (promises.length === 0) return;
      
      const results = await Promise.all(promises);
      let marcasData, categoriasData;
      
      if (!marcasCargadasRef.current) {
        marcasData = results[0];
        marcasCargadasRef.current = true;
      }
      if (!categoriasCargadasRef.current) {
        categoriasData = results[promises.length === 2 ? 1 : 0];
        categoriasCargadasRef.current = true;
      }
      
      if (marcasData) {
        setMarcas(marcasData.filter(m => m.estado === true));
      }
      if (categoriasData) {
        setCategorias(categoriasData.filter(c => c.estado === true));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        onErrorRef.current?.("Error cargando datos");
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    await loadMarcasYCategorias();
    
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
    
    setLoading(false);
  }, [initialData, initialDataLoaded, loadMarcasYCategorias]);

  useEffect(() => {
    loadData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  useEffect(() => {
    if (refreshMarcas > 0) {
      marcasCargadasRef.current = false;
      loadMarcasYCategorias();
    }
    if (refreshCategorias > 0) {
      categoriasCargadasRef.current = false;
      loadMarcasYCategorias();
    }
  }, [refreshMarcas, refreshCategorias, loadMarcasYCategorias]);

  const formatNombre = (text) => {
    if (!text) return "";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;

    if (["precioVenta", "precioCompra", "stockMinimo", "stockActual"].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "nombre") {
      const trimmedValue = processedValue.trim();
      if (trimmedValue.length >= 3) {
        try {
          const excludeId = mode === "edit" ? initialData?.id : null;
          const exists = await ProductoData.checkProductoExists(trimmedValue, excludeId);
          setNombreExists(exists);
          if (exists) {
            setErrors(prev => ({
              ...prev,
              nombre: "Ya existe un producto con este nombre"
            }));
          } else {
            setErrors(prev => ({ ...prev, nombre: "" }));
          }
        } catch (error) {
          // Silent fail
        }
      } else {
        setNombreExists(false);
        if (errors.nombre === "Ya existe un producto con este nombre") {
          setErrors(prev => ({ ...prev, nombre: "" }));
        }
      }
    }
  };

  const handleImageUpload = async (acceptedFiles) => {
    if (mode === 'edit' && !formData.estado) {
      const errorMsg = "No se pueden agregar imágenes a un producto inactivo. Activa el producto primero.";
      setErrors(prev => ({ ...prev, imagenes: errorMsg }));
      onErrorRef.current?.(errorMsg);
      return;
    }
    
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return;
    }

    if (imagenes.length + acceptedFiles.length > 5) {
      setErrors(prev => ({ ...prev, imagenes: "Máximo 5 imágenes permitidas" }));
      return;
    }

    setUploadingImages(true);

    try {
      const cloudinaryUrls = await UploadData.uploadMultipleImages(acceptedFiles);
      const nuevasImagenes = cloudinaryUrls.map(url => ({ id: null, url }));
      setImagenes(prev => [...prev, ...nuevasImagenes]);

      const newPreviews = [];
      acceptedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === acceptedFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      if (errors.imagenes) {
        setErrors(prev => ({ ...prev, imagenes: "" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, imagenes: error.message || "Error al subir imágenes" }));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = useCallback(async (index) => {
    const imagenAEliminar = imagenes[index];
    
    if (imagenAEliminar && imagenAEliminar.id) {
      try {
        await ProductoData.deleteImagen(imagenAEliminar.id);
      } catch (error) {
        if (error.response?.status !== 404) {
          setErrors(prev => ({ ...prev, imagenes: "Error al eliminar imagen" }));
        }
        return;
      }
    }
    
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, [imagenes]);

  const validateForm = () => {
    const newErrors = {};

    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");
    
    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe un producto con este nombre";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
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
        newErrors.precioCompra = "Debe ser un número válido";
      }

      if (!formData.precioVenta && formData.precioVenta !== "0") {
        newErrors.precioVenta = "El precio de venta es requerido";
      } else if (isNaN(precioVentaNum) || precioVentaNum < 0) {
        newErrors.precioVenta = "Debe ser un número válido";
      }
      
      const stockMinimoNum = parseInt(formData.stockMinimo, 10);

      if (!formData.stockMinimo && formData.stockMinimo !== "0") {
        newErrors.stockMinimo = "El stock mínimo es requerido";
      } else if (isNaN(stockMinimoNum) || stockMinimoNum < 0) {
        newErrors.stockMinimo = "No puede ser negativo";
      }

      const stockActualNum = parseInt(formData.stockActual, 10);
      if (formData.stockActual && (isNaN(stockActualNum) || stockActualNum < 0)) {
        newErrors.stockActual = "Debe ser un número válido";
      }
    }

    if (isCreate && !isFullCreate) {
      const stockMinimoNum = parseInt(formData.stockMinimo, 10);
      if (!formData.stockMinimo && formData.stockMinimo !== "0") {
        newErrors.stockMinimo = "El stock mínimo es requerido";
      } else if (isNaN(stockMinimoNum) || stockMinimoNum < 0) {
        newErrors.stockMinimo = "No puede ser negativo";
      }
    }
    
    if (formData.descripcion && formData.descripcion.length > 120) {
      newErrors.descripcion = "No debe exceder 120 caracteres";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (nombreExists) {
      setErrors(prev => ({ ...prev, nombre: "Ya existe un producto con este nombre" }));
      return;
    }

    setIsSubmitting(true);

    const nombreProcesado = formData.nombre.trim().replace(/\s+/g, " ");
    const nombreFinal = formatNombre(nombreProcesado);

    const imagenesExistentes = imagenes.filter(img => img.id);
    const nuevasImagenes = imagenes.filter(img => !img.id);

    const dataToSubmit = {
      nombre: nombreFinal,
      descripcion: (formData.descripcion || "").trim(),
      imagenes: imagenesExistentes,
      nuevasImagenes: nuevasImagenes.map(img => ({ url: img.url }))
    };

    if (mode === "edit") {
      if (formData.categoria !== initialData.categoria?.toString()) {
        dataToSubmit.categoria = formData.categoria;
      }
      if (formData.marca !== initialData.marca?.toString()) {
        dataToSubmit.marca = formData.marca;
      }
    } else {
      dataToSubmit.categoria = formData.categoria;
      dataToSubmit.marca = formData.marca;
    }
    
    if (!isCreate || isFullCreate) {
      dataToSubmit.precioVenta = parseInt(formData.precioVenta, 10);
      dataToSubmit.precioCompra = parseInt(formData.precioCompra, 10);
      dataToSubmit.stockActual = parseInt(formData.stockActual, 10);
      dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10);
      dataToSubmit.estado = formData.estado;
    } else {
      dataToSubmit.precioVenta = 1;
      dataToSubmit.precioCompra = 1;
      dataToSubmit.stockActual = 0;
      dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10) || 0;
      dataToSubmit.estado = true;
    }

    try {
      let result;
      if (mode === "create" || mode === "full-create") {
        result = await ProductoData.createProducto(dataToSubmit);
        localStorage.setItem('productoNotification', JSON.stringify({
          message: "Producto creado exitosamente",
          type: "success"
        }));
      } else if (mode === "edit") {
        result = await ProductoData.updateProducto(initialData.id, dataToSubmit);
        localStorage.setItem('productoNotification', JSON.stringify({
          message: "Producto actualizado exitosamente",
          type: "success"
        }));
      }
      
      setTimeout(() => {
        onSubmitSuccessRef.current?.(result);
      }, 300);
      
    } catch (error) {
      localStorage.setItem('productoNotification', JSON.stringify({
        message: error.response?.data?.message || "Error al guardar el producto",
        type: "error"
      }));
      onErrorRef.current?.(error.response?.data?.message || "Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, imagenes, isCreate, isFullCreate, mode, initialData, nombreExists, isSubmitting]);

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
    setErrors({});
    setNombreExists(false);
    setInitialDataLoaded(false);
  }, []);

  return {
    formData,
    errors,
    nombreExists,
    marcas,
    categorias,
    loading,
    isView,
    isCreate,
    imagenes,
    imagePreviews,
    uploadingImages,
    isSubmitting,
    handleChange,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,
    setFormData
  };
};