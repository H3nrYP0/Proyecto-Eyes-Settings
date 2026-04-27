import { useState, useEffect, useCallback } from "react";
import { ServicioData } from "../services/serviciosService";

export const useServicioForm = ({ mode, initialData, onSubmit, onCancel }) => {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion_min: "",
    precio: "",
    estado: true
  });

  const [nombreExists, setNombreExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      const data = {
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        duracion_min: initialData.duracion_min?.toString() || "",
        precio: initialData.precio?.toString() || "",
        estado: initialData.estado === 'activo'
      };
      setFormData(data);
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        duracion_min: "",
        precio: "",
        estado: true
      });
    }
    setErrors({});
    setNombreExists(false);
    setSubmitting(false);
  }, [initialData]);

  const formatNombre = useCallback((text) => {
    if (!text) return '';
    const trimmed = text.trim().replace(/\s+/g, " ");
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }, []);

  const checkNombreExists = useCallback(async (nombre) => {
    try {
      const exists = await ServicioData.checkServicioExists(
        nombre,
        mode === "edit" ? initialData?.id : null
      );
      return exists;
    } catch {
      return false;
    }
  }, [mode, initialData]);

  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "nombre" && value.trim().length >= 3) {
      const exists = await checkNombreExists(value);
      setNombreExists(exists);
    } else if (name === "nombre") {
      setNombreExists(false);
    }
  }, [errors, checkNombreExists]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");

    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre del servicio es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 65) {
      newErrors.nombre = "El nombre no puede exceder 65 caracteres";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe un servicio con este nombre";
    }

    const duracionNum = parseInt(formData.duracion_min, 10);
    if (!formData.duracion_min) {
      newErrors.duracion_min = "La duración es requerida";
    } else if (isNaN(duracionNum) || duracionNum <= 0) {
      newErrors.duracion_min = "La duración debe ser mayor a 0";
    } else if (duracionNum > 480) {
      newErrors.duracion_min = "Máximo 480 minutos (8 horas)";
    }

    const precioNum = parseInt(formData.precio, 10);
    if (!formData.precio) {
      newErrors.precio = "El precio es requerido";
    } else if (isNaN(precioNum) || precioNum <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "Máximo 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, nombreExists]);

  const handleSubmit = useCallback(async(e) => {
    e.preventDefault();

    if (submitting) return;

    if (!validateForm()) return;

    setSubmitting(true);

    const nombreFinal = formatNombre(formData.nombre.trim().replace(/\s+/g, " "));

    try {
      if (isEdit) {
        const updatedData = {
          nombre: nombreFinal,
          descripcion: formData.descripcion.trim(),
          duracion_min: parseInt(formData.duracion_min, 10),
          precio: parseInt(formData.precio, 10),
          estado: formData.estado === true
        };
        
        if (isNaN(updatedData.duracion_min) || updatedData.duracion_min <= 0) {
          setErrors(prev => ({ ...prev, duracion_min: "La duración debe ser un número válido mayor a 0" }));
          setSubmitting(false);
          return;
        }
        if (isNaN(updatedData.precio) || updatedData.precio <= 0) {
          setErrors(prev => ({ ...prev, precio: "El precio debe ser un número válido mayor a 0" }));
          setSubmitting(false);
          return;
        }
        
        onSubmit?.(updatedData);
      } else {
        onSubmit?.({
          nombre: nombreFinal,
          descripcion: formData.descripcion.trim(),
          duracion_min: parseInt(formData.duracion_min, 10),
          precio: parseInt(formData.precio, 10),
          estado: true
        });
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setErrors({ general: "Error al guardar el servicio" });
    } finally {
      setSubmitting(false);
    }
  }, [formData, validateForm, formatNombre, onSubmit, isEdit, submitting]);

  const handleCancel = useCallback(() => {
    if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      onCancel?.();
    }
  }, [onCancel]);

  return {
    formData,
    errors,
    nombreExists,
    isView,
    submitting,
    handleChange,
    handleSubmit,
    handleCancel
  };
};