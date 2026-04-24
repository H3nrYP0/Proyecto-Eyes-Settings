// src/features/servicios/pages/servicio/components/ServicioForm.jsx
import { Box, Grid, TextField, FormHelperText } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { useServicioForm } from "../hooks/useServicioForm";
import { formatCOP } from "../../../../shared/utils/formatCOP";
import { TextFieldNoEmoji, TextFieldLetters, TextFieldNumbers } from "@shared/index";

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
          {/* Nombre del Servicio */}
          <Grid item xs={12}>
            <TextFieldLetters
              label="Nombre del Servicio"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isView}
              required={!isView}
              error={!!errors.nombre || nombreExists}
              helperText={errors.nombre || (nombreExists ? "Ya existe un servicio con este nombre" : "")}
              maxLength={65}
            />
          </Grid>

          {/* Precio (media anchura) */}
          <Grid item xs={12} sm={6}>
            {isView ? (
              <BaseInputField
                label="Precio"
                value={formatCOP(formData.precio)}
                disabled={true}
              />
            ) : (
              <>
                <TextFieldNumbers
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
              </>
            )}
          </Grid>

          {/* Duración (media anchura) */}
          <Grid item xs={12} sm={6}>
            <TextFieldNumbers
            
              label="Duración (minutos)"
              name="duracion_min"
              value={isView ? `${formData.duracion_min} min` : formData.duracion_min}
              onChange={handleChange}
              disabled={isView}
              required={!isView}
              error={!!errors.duracion_min}
              helperText={errors.duracion_min}
              inputProps={{ inputMode: "numeric", min: 1, max: 480 }}
            />
          </Grid>

          {/* Estado (solo si no es creación) - con ancho medio */}
          {mode !== "create" && (
            <Grid item xs={12} sm={6}>
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

          {/* Descripción */}
          <Grid item xs={12}>
            <TextFieldNoEmoji
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
              helperText={errors.descripcion || `${formData.descripcion?.length || 0}/500 caracteres`}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}