import { useState, useEffect, useCallback } from "react";
import { createCategoria, updateCategoria, checkCategoriaExists } from "../services/categoriasService";

export function useCategoriaForm({ mode = "create", initialData = null, onSubmitSuccess, onError } = {}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true
  });

  const [nombreExists, setNombreExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // Formatear nombre (primera letra mayúscula)
  // ============================
  const formatNombre = useCallback((text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }, []);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: Boolean(initialData.estado)
      });
    } else {
      setFormData({ nombre: "", descripcion: "", estado: true });
    }
    setErrors({});
    setNombreExists(false);
  }, [initialData]);

  // ============================
  // Verificar nombre duplicado (solo en creación)
  // ============================
  const verificarNombreDuplicado = useCallback(async (nombre, excludeId = null) => {
    const trimmedValue = nombre.trim();
    if (trimmedValue.length > 0) {
      try {
        const exists = await checkCategoriaExists(trimmedValue, excludeId);
        setNombreExists(exists);
        return exists;
      } catch (error) {
        console.error("Error verificando duplicado:", error);
        return false;
      }
    } else {
      setNombreExists(false);
      return false;
    }
  }, []);

  // ============================
  // Handle change con validaciones en tiempo real
  // ============================
  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    const processedValue = name === 'nombre' ? formatNombre(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado"
        ? (value === "true" || value === true)
        : processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Verificar duplicado en tiempo real solo en creación
    if (name === 'nombre' && mode === 'create') {
      await verificarNombreDuplicado(value);
    }
  }, [errors, mode, formatNombre, verificarNombreDuplicado]);

  // ============================
  // Validaciones
  // ============================
  const validate = useCallback(() => {
    const newErrors = {};
    const nombreTrimmed = formData.nombre.trim();
    const descripcionTrimmed = formData.descripcion?.trim() || '';

    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre de la categoría es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 15) {
      newErrors.nombre = "El nombre no puede exceder 15 caracteres";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe una categoría con este nombre";
    }

    if (!descripcionTrimmed) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (descripcionTrimmed.length < 3) {
      newErrors.descripcion = "La descripción debe tener al menos 3 caracteres";
    } else if (descripcionTrimmed.length > 100) {
      newErrors.descripcion = "La descripción no puede exceder 100 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, nombreExists]);

  // ============================
  // Submit
  // ============================
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const nombreTrimmed = formData.nombre.trim();
      const descripcionTrimmed = formData.descripcion?.trim() || '';
      
      const payload = {
        nombre: nombreTrimmed,
        descripcion: descripcionTrimmed,
        estado: formData.estado
      };

      let result;
      if (mode === "create") {
        result = await createCategoria(payload);
      } else {
        result = await updateCategoria(initialData.id, payload);
      }

      onSubmitSuccess?.(result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      const errorMessage = error.response?.data?.message || "Error al guardar la categoría";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [formData, mode, initialData, validate, onSubmitSuccess, onError]);

  // ============================
  // Reset form
  // ============================
  const resetForm = useCallback(() => {
    setFormData({ nombre: "", descripcion: "", estado: true });
    setErrors({});
    setNombreExists(false);
  }, []);

  return {
    formData,
    errors,
    nombreExists,
    submitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
    verificarNombreDuplicado,
  };
}