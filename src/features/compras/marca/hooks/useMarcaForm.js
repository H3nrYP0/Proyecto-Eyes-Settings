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

  useEffect(() => {
    if (initialData) {
      setFormData(normalizeMarcaForForm(initialData));
    } else {
      setFormData({ nombre: "", estado: true });
    }
    setErrors({});
    setNombreExists(false);
  }, [initialData]);

  const verificarNombreDuplicado = useCallback(async (nombre) => {
    const trimmed = nombre?.trim();
    if (trimmed && isCreate) {
      try {
        const exists = await marcasService.checkMarcaExists(trimmed);
        setNombreExists(exists);
        return exists;
      } catch {
        return false;
      }
    } else {
      setNombreExists(false);
      return false;
    }
  }, [isCreate]);

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

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (submitting) {
      return;
    }
    
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
      onSubmit?.(payload);
    } catch {
      setErrors({ general: "Error al preparar los datos" });
    } finally {
      setSubmitting(false);
    }
  }, [formData, isView, nombreExists, onSubmit, submitting]);

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