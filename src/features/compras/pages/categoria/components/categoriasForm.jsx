import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Box } from "@mui/material";

import BaseInputField from "../../../../../shared/components/base/BaseInputField";
import { CategoriaData } from "../../../../../lib/data/categoriasData";

export default function CategoriaForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true
  });

  const [nombreExists, setNombreExists] = useState(false);
  const [errors, setErrors] = useState({});

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

  const formatNombre = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    const processedValue = name === 'nombre' ? formatNombre(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "estado"
          ? (value === "true" || value === true)   // <-- acepta string "true" o boolean true
          : processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    if (name === 'nombre' && mode === 'create') {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 0) {
        try {
          const exists = await CategoriaData.checkCategoriaExists(trimmedValue);
          setNombreExists(exists);
        } catch (error) {
          console.error("Error verificando duplicado:", error);
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.({
      ...formData,
      nombre: nombreTrimmed,
      descripcion: descripcionTrimmed
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <BaseInputField
            label="Nombre de la Categoría"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            placeholder="Ej: Lentes de Sol, Lentes Recetados, etc."
            inputProps={{ maxLength: 15 }}
            fullWidth
            required
            error={!!errors.nombre || nombreExists}
          />
          {errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.nombre}</FormHelperText>
          )}
          {nombreExists && !errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>Ya existe una categoría con este nombre</FormHelperText>
          )}
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            multiline
            rows={4}
            placeholder="Descripción de la categoría..."
            variant="outlined"
            size="medium"
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            required
            inputProps={{ maxLength: 100 }}
          />
        </Box>
        {mode !== "create" && (
          <Box>
            <TextField
              select
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado ? "true" : "false"}   
              onChange={handleChange}
              disabled={isView}
              size="medium"
              variant="outlined"
            >
              <MenuItem value="true">Activa</MenuItem>     
              <MenuItem value="false">Inactiva</MenuItem>
            </TextField>
          </Box>
        )}
      </Box>
    </form>
  );
}