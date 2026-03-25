// src/features/compras/pages/marca/hooks/useMarcaForm.js
import { useState, useEffect } from "react";
import { MarcaData } from "../services/marcasService";

export const useMarcaForm = ({ mode, initialData, onSubmit, onCancel }) => {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    estado: true
  });

  const [nombreExists, setNombreExists] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        estado: typeof initialData.estado === 'boolean' 
          ? initialData.estado 
          : initialData.estado === 'activa'
      });
    } else {
      setFormData({ nombre: "", estado: true });
    }
    setErrors({});
    setNombreExists(false);
  }, [initialData]);

  const formatNombre = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    const processedValue = name === 'nombre' ? formatNombre(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? value === "true" : processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    if (name === 'nombre' && mode === 'create') {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 0) {
        try {
          const exists = await MarcaData.checkMarcaExists(trimmedValue);
          setNombreExists(exists);
        } catch (error) {
          // Silent fail
        }
      } else {
        setNombreExists(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const nombreTrimmed = formData.nombre.trim();

    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre de la marca es requerido";
    } else if (nombreTrimmed.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (nombreTrimmed.length > 23) {
      newErrors.nombre = "El nombre no puede exceder 23 caracteres";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe una marca con este nombre";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.({
      ...formData,
      nombre: nombreTrimmed
    });
  };

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      onCancel?.();
    }
  };

  return {
    formData,
    errors,
    nombreExists,
    isView,
    handleChange,
    handleSubmit,
    handleCancel
  };
};