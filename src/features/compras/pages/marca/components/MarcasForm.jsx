// src/features/compras/pages/marca/components/MarcasForm.jsx
import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Box } from "@mui/material";

import BaseInputField from "../../../../../shared/components/base/BaseInputField";
import { MarcaData } from "../../../../../lib/data/marcasData";

export default function MarcaForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id
}) {
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
      setFormData({ nombre: "",  estado: true });
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
    
    // ✅ DEFINIR processedValue AQUÍ - ESTA ES LA LÍNEA CLAVE
    const processedValue = name === 'nombre' ? formatNombre(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "estado"
          ? value === "true"
          : processedValue
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

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <BaseInputField
            label="Nombre de la Marca"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            placeholder="Ej: Ray-Ban, Oakley, etc."
            inputProps={{ maxLength: 23 }}
            fullWidth
            required
            error={!!errors.nombre || nombreExists}
          />
          {errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.nombre}</FormHelperText>
          )}
          {nombreExists && !errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>Ya existe una marca con este nombre</FormHelperText>
          )}
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