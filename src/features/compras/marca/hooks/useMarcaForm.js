import { useState, useEffect, useCallback } from "react";
import { marcasService } from "../services/marcasService";
import { formatNombre, validateNombre, normalizeMarcaForForm } from "../utils/marcasUtils";

export function useMarcaForm({ mode = "create", initialData = null, onSubmit, onCancel }) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    nombre: "",
    estado: true
  });

  const [nombreExists, setNombreExists] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    if (initialData) {
      setFormData(normalizeMarcaForForm(initialData));
    } else {
      setFormData({ nombre: "", estado: true });
    }
    setErrors({});
    setNombreExists(false);
  }, [initialData]);

  // ============================
  // Verificar nombre duplicado (solo en creación)
  // ============================
  const verificarNombreDuplicado = useCallback(async (nombre) => {
    const trimmed = nombre?.trim();
    if (trimmed && isCreate) {
      try {
        const exists = await marcasService.checkMarcaExists(trimmed);
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
  }, [isCreate]);

  // ============================
  // Handle change
  // ============================
  const handleChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    const processedValue = name === 'nombre' ? formatNombre(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? value === "true" : processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    if (name === 'nombre' && isCreate) {
      await verificarNombreDuplicado(value);
    }
  }, [errors, isCreate, verificarNombreDuplicado]);

  // ============================
  // Validar y submit
  // ============================
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    if (isView) {
      if (onSubmit) onSubmit(formData);
      return;
    }

    const trimmedNombre = formData.nombre.trim();
    const validation = validateNombre(trimmedNombre, nombreExists);
    
    if (!validation.isValid) {
      setErrors({ nombre: validation.message });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        nombre: trimmedNombre
      };

      if (isCreate) {
        await marcasService.createMarca(payload);
      } else {
        await marcasService.updateMarca(initialData.id, payload);
      }

      onSubmit?.(payload);
    } catch (error) {
      console.error("Error al guardar marca:", error);
      setErrors({ general: "Error al guardar la marca" });
    } finally {
      setSubmitting(false);
    }
  }, [formData, isView, isCreate, initialData, nombreExists, onSubmit]);

  // ============================
  // Cancelar
  // ============================
  const handleCancel = useCallback(() => {
    if (!isView && window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      onCancel?.();
    } else if (isView) {
      onCancel?.();
    }
  }, [isView, onCancel]);

  return {
    formData,
    errors,
    nombreExists,
    submitting,
    isView,
    handleChange,
    handleSubmit,
    handleCancel
  };
}