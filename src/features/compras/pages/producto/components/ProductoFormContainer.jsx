import { useState, useEffect } from "react";

import { MarcaData } from "../../marca/services/marcasService";

import { getAllCategorias } from "../../categoria/services/categoriasService";

import { ProductoData } from "../../../../../lib/data/productosData";
import { UploadData } from "../../../../../lib/data/uploadData";
import ProductoFormPresentational from "./ProductoFormPresentational";

export default function ProductoFormContainer({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
  onOpenMarcaModal,
  onOpenCategoriaModal,
  refreshMarcas = 0,
  refreshCategorias = 0
}) {
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

  // Cargar datos iniciales (marcas, categorías y datos del producto si existe)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [marcasData, categoriasData] = await Promise.all([
          MarcaData.getAllMarcas(),
          getAllCategorias()
        ]);

        // Filtrar marcas activas
        const marcasActivas = marcasData.filter(m => m.estado === true);
        
        // Si hay un producto con marca seleccionada, incluir esa marca aunque esté inactiva
        if (initialData?.marca) {
          const marcaActual = marcasData.find(
            m => m.id.toString() === initialData.marca
          );
          setMarcas(marcaActual && !marcaActual.estado 
            ? [...marcasActivas, marcaActual] 
            : marcasActivas);
        } else {
          setMarcas(marcasActivas);
        }
        
        // Filtrar categorías activas
        const categoriasActivas = categoriasData.filter(c => c.estado === true);
      
        // Si hay un producto con categoría seleccionada, incluir esa categoría aunque esté inactiva
        if (initialData?.categoria) {
          const categoriaActual = categoriasData.find(
            c => c.id.toString() === initialData.categoria
          );
          setCategorias(categoriaActual && !categoriaActual.estado 
            ? [...categoriasActivas, categoriaActual] 
            : categoriasActivas);
        } else {
          setCategorias(categoriasActivas);
        }

        // Si hay datos iniciales (edición o vista), cargarlos
        if (initialData) {
          setFormData({
            nombre: initialData.nombre || "",
            descripcion: initialData.descripcion || "",
            precioVenta: initialData.precioVenta?.toString() || "",
            precioCompra: initialData.precioCompra?.toString() || "",
            stockActual: initialData.stockActual?.toString() || "",
            stockMinimo: initialData.stockMinimo?.toString() || "",
            categoria: initialData.categoria?.toString() || "",
            marca: initialData.marca?.toString() || "",
            estado: initialData.estado === 'activo'
          });

          // Cargar imágenes si existen
          if (initialData.imagenes) {
            setImagePreviews(initialData.imagenes.map(img => img.url));
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initialData, refreshMarcas, refreshCategorias]);

  // Formatear nombre (primera letra mayúscula, resto minúsculas)
  const formatNombre = (text) => {
    if (!text) return "";
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length === 0) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;

    // Para campos numéricos, eliminar caracteres no numéricos
    if (["precioVenta", "precioCompra", "stockMinimo","stockActual"].includes(name)) {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

    // Verificar duplicados en tiempo real para el nombre
    if (name === "nombre") {
      const trimmedValue = value.trim();
      if (trimmedValue.length >= 3) {
        try {
          const excludeId = !isCreate ? initialData?.id : null;
          const exists = await ProductoData.checkProductoExists(trimmedValue, excludeId);
          setNombreExists(exists);
          if (exists) {
            setErrors(prev => ({
              ...prev,
              nombre: "Ya existe un producto con este nombre"
            }));
          }
        } catch (error) {
          console.error("Error verificando duplicado:", error);
        }
      } else {
        setNombreExists(false);
      }
    }
  };

  // Manejar subida de imágenes
  const handleImageUpload = async (acceptedFiles) => {
    // Validar cantidad máxima
    if (imagenes.length + acceptedFiles.length > 5) {
      setErrors(prev => ({ ...prev, imagenes: "Máximo 5 imágenes permitidas" }));
      return;
    }

    setUploadingImages(true);
    
    try {
      // Subir a Cloudinary
      const cloudinaryUrls = await UploadData.uploadMultipleImages(acceptedFiles);
      
      // Guardar las URLs de Cloudinary
      setImagenes(prev => [...prev, ...cloudinaryUrls]);
      
      // Crear previews locales para mostrar inmediatamente
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

      // Limpiar error si lo hubiera
      if (errors.imagenes) {
        setErrors(prev => ({ ...prev, imagenes: "" }));
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      setErrors(prev => ({ ...prev, imagenes: "Error al subir imágenes" }));
    } finally {
      setUploadingImages(false);
    }
  };

  // Eliminar imagen
  const removeImage = (index) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};

    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");
    
    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 20) {
      newErrors.nombre = "El nombre no puede exceder 20 caracteres";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe un producto con este nombre";
    }

    if (!formData.categoria) {
      newErrors.categoria = "La categoría es requerida";
    }

    if (!formData.marca) {
      newErrors.marca = "La marca es requerida";
    }

    if (!isCreate || isFullCreate) {  // ← MODIFICADO
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

// Solo modo create normal
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

    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nombreProcesado = formData.nombre.trim().replace(/\s+/g, " ");
    const nombreFinal = formatNombre(nombreProcesado);

    const dataToSubmit = {
      nombre: nombreFinal,
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      marca: formData.marca,
      imagenes: imagenes.map((url, index) => ({
        url,
        orden: index + 1,
        principal: index === 0
      }))
    };
    
    if (!isCreate || isFullCreate) {
      dataToSubmit.precioVenta = parseInt(formData.precioVenta, 10);
      dataToSubmit.precioCompra = parseInt(formData.precioCompra, 10);
      dataToSubmit.stockActual = parseInt(formData.stockActual, 10);
      dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10);
      dataToSubmit.estado = formData.estado;
    } else {
      dataToSubmit.precioVenta = 0;
      dataToSubmit.precioCompra = 0;
      dataToSubmit.stockActual = 0;
      dataToSubmit.stockMinimo = parseInt(formData.stockMinimo, 10) || 0;
      dataToSubmit.estado = true;
    }

    onSubmit?.(dataToSubmit);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ProductoFormPresentational
      mode={mode}
      title={title}
      formData={formData}
      errors={errors}
      nombreExists={nombreExists}
      marcas={marcas}
      categorias={categorias}
      isView={isView}
      isCreate={isCreate}
      imagePreviews={imagePreviews}
      uploadingImages={uploadingImages}
      onOpenCategoriaModal={onOpenCategoriaModal}
      onOpenMarcaModal={onOpenMarcaModal}
      onCancel={onCancel}
      onEdit={onEdit}
      handleChange={handleChange}
      handleImageUpload={handleImageUpload}
      removeImage={removeImage}
      handleSubmit={handleSubmit}
    />
  );
}