import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Grid } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function EmpleadoForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    tipoDocumento: "CC",
    numero_documento: "",
    telefono: "",
    correo: "",
    direccion: "",
    fecha_ingreso: "",
    cargo: "",
    estado: "activo",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        tipoDocumento: initialData.tipo_documento || initialData.tipoDocumento || "CC",
        numero_documento: initialData.numero_documento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || initialData.email || "",
        direccion: initialData.direccion || "",
        fecha_ingreso: initialData.fecha_ingreso || "",
        cargo: initialData.cargo || "",
        estado: initialData.estado || "activo",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validaciones
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "Mínimo 3 caracteres";
    }

    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = "Seleccione un tipo de documento";
    }

    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = "El número de documento es requerido";
    } else {
      const doc = formData.numero_documento.trim();
      if (formData.tipoDocumento === "CC" || formData.tipoDocumento === "CE") {
        if (!/^[0-9]{6,10}$/.test(doc)) {
          newErrors.numero_documento = "Documento inválido (6-10 dígitos)";
        }
      } else if (formData.tipoDocumento === "PA") {
        if (!/^[A-Za-z0-9]{6,12}$/.test(doc)) {
          newErrors.numero_documento = "Pasaporte inválido (6-12 caracteres)";
        }
      }
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "Teléfono inválido (7-15 dígitos)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = "Formato de email inválido";
    }

    if (!formData.cargo) {
      newErrors.cargo = "Seleccione un cargo";
    }

    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = "La fecha de ingreso es requerida";
    } else {
      const fechaIngreso = new Date(formData.fecha_ingreso);
      const hoy = new Date();
      if (fechaIngreso > hoy) {
        newErrors.fecha_ingreso = "La fecha no puede ser futura";
      }
    }

    if (!formData.estado) {
      newErrors.estado = "Debe seleccionar un estado";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información del Empleado">
        <Grid container spacing={3}>
          {/* Nombre */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Nombre Completo*"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isView}
                required
                asterisk
              />
              <FormHelperText error>
                {errors.nombre || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Cargo */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                select
                fullWidth
                label="Cargo*"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                error={!!errors.cargo}
              >
                <MenuItem value="">Seleccionar cargo</MenuItem>
                <MenuItem value="Optómetra">Optómetra</MenuItem>
                <MenuItem value="Asistente">Asistente</MenuItem>
                <MenuItem value="Técnico">Técnico</MenuItem>
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Recepcionista">Recepcionista</MenuItem>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
              </TextField>
              <FormHelperText error>
                {errors.cargo || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Tipo Documento */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                select
                fullWidth
                label="Tipo de Documento*"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                error={!!errors.tipoDocumento}
              >
                <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                <MenuItem value="PA">Pasaporte</MenuItem>
              </TextField>
              <FormHelperText error>
                {errors.tipoDocumento || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Número Documento */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Número de Documento*"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                disabled={isView}
                required
                asterisk
              />
              <FormHelperText error>
                {errors.numero_documento || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Teléfono */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Teléfono*"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isView}
                required
                asterisk
              />
              <FormHelperText error>
                {errors.telefono || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Correo */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                disabled={isView}
              />
              <FormHelperText error>
                {errors.correo || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Fecha Ingreso */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Fecha de Ingreso*"
                name="fecha_ingreso"
                type="date"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                disabled={isView}
                required
                asterisk
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText error>
                {errors.fecha_ingreso || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Estado */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                select
                fullWidth
                label="Estado*"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                error={!!errors.estado}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </TextField>
              <FormHelperText error>
                {errors.estado || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Dirección */}
          <Grid item xs={12}>
            <BaseFormField>
              <BaseInputField
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={isView}
                multiline
                rows={2}
              />
              <FormHelperText error>
                {errors.direccion || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>
        </Grid>
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
      />
    </BaseFormLayout>
  );
}