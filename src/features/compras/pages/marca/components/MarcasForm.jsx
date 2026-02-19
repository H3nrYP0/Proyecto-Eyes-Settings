// src/features/compras/pages/marca/components/MarcasForm.jsx
import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Box, Grid,Typography } from "@mui/material";

import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function MarcaForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  embedded = false,
  id,
  buttonRef
}) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: typeof initialData.estado === 'boolean' 
          ? initialData.estado 
          : initialData.estado === 'activa'
      });
    } else {
      // Reset para creación
      setFormData({
        nombre: "",
        descripcion: "",
        estado: true
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estado' ? value === 'true' : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la marca es requerido";
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre.length > 23) {
      newErrors.nombre = "El nombre no puede exceder 23 caracteres";
    }

    if (formData.descripcion && formData.descripcion.length < 3) {
      newErrors.descripcion = "La descripción debe tener al menos 3 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Campo Nombre */}
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
          />
          {errors.nombre && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.nombre}</FormHelperText>
          )}
        </Box>

        {/* Campo Descripción */}
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
            placeholder="Descripción de la marca (opcional)..."
            variant="outlined"
            size="medium"
            error={!!errors.descripcion}
          />
          {errors.descripcion && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.descripcion}</FormHelperText>
          )}
        </Box>

        {/* Campo Estado */}
        <Box>
          <TextField
            select
            fullWidth
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={isView}
            size="medium"
            variant="outlined"
          >
            <MenuItem value={true}>Activa</MenuItem>
            <MenuItem value={false}>Inactiva</MenuItem>
          </TextField>
        </Box>

        {/* Información adicional solo en modo view */}
        {isView && initialData?.id && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="textSecondary">ID</Typography>
                <Typography variant="body2">{initialData.id}</Typography>
              </Grid>
              {initialData.created_at && (
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Creado</Typography>
                  <Typography variant="body2">
                    {new Date(initialData.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </form>
  );
}