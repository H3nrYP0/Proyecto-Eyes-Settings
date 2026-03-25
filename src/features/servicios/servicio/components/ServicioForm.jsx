// src/features/servicios/pages/servicio/components/ServicioForm.jsx
import { Box, Grid, TextField, FormHelperText } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useServicioForm } from "../hooks/useServicioForm";
import { formatCOP } from "../../../../shared/utils/formatCOP";

export default function ServicioForm({
  mode = "create",
  initialData,
  onSubmit,
  onCancel,
  id
}) {
  const {
    formData,
    errors,
    nombreExists,
    isView,
    handleChange,
    handleSubmit,
    handleCancel
  } = useServicioForm({ mode, initialData, onSubmit, onCancel });

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <BaseInputField
              label="Nombre del Servicio"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.nombre || nombreExists}
              helperText={errors.nombre || (nombreExists ? "Ya existe un servicio con este nombre" : "")}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <BaseInputField
              label="Duración (minutos)"
              name="duracion_min"
              value={formData.duracion_min}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.duracion_min}
              helperText={errors.duracion_min}
              inputProps={{ inputMode: "numeric", min: 1, max: 480 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <BaseInputField
              label="Precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.precio}
              helperText={errors.precio}
              inputProps={{ inputMode: "numeric", min: 0 }}
            />
            {formData.precio && !errors.precio && (
              <FormHelperText sx={{ mt: 0.5 }}>
                {formatCOP(formData.precio)} COP
              </FormHelperText>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isView}
              multiline
              rows={4}
              variant="outlined"
              size="small"
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
          </Grid>

          {mode !== "create" && (
            <Grid item xs={12} md={6}>
              <BaseInputField
                label="Estado del Servicio"
                name="estado"
                value={formData.estado ? "true" : "false"}
                onChange={handleChange}
                select
                options={[
                  { value: "true", label: "Activo" },
                  { value: "false", label: "Inactivo" }
                ]}
                disabled={isView}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </form>
  );
}