import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function UsuarioForm({
  mode = "create",
  title,
  initialData,
  rolesDisponibles = [],
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "cedula",
    numeroDocumento: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });

  const [errors, setErrors] = useState({});

  // 🔹 Cuando cambia initialData (detalle / editar), actualizar estado
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        email: initialData.email || "",
        telefono: initialData.telefono || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        tipoDocumento: initialData.tipoDocumento || "cedula",
        numeroDocumento: initialData.numeroDocumento || "",
        password: "",
        confirmPassword: "",
        rol: initialData.rol || ""
      });
    }
  }, [initialData]);

  // 🔹 Cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // 🔹 Validaciones y submit
  const handleSubmit = () => {
    const newErrors = {};

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre completo es requerido";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    // Fecha de nacimiento: mayor de 18 años
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    } else {
      const hoy = new Date();
      const fechaNac = new Date(formData.fechaNacimiento);
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      if (edad < 18) {
        newErrors.fechaNacimiento = "Debe ser mayor de 18 años";
      }
    }

    // Número de documento
    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "El número de documento es requerido";
    }

    // Password (solo en create y edit)
    if (mode !== "view") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Debe tener al menos 6 caracteres, 1 mayúscula y 1 número";
      }

      // Confirm password
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    // Rol
    if (!formData.rol) {
      newErrors.rol = "Debe seleccionar un rol";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <BaseFormLayout title={title}>
      {/* Información Personal */}
      <BaseFormSection title="Información Personal">
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
          {errors.nombre && <FormHelperText error>{errors.nombre}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo Electrónico*"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isView}
            required
            asterisk
          />
          {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={isView}
          />
          {errors.telefono && <FormHelperText error>{errors.telefono}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <TextField
            label="Fecha de Nacimiento*"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            disabled={isView}
            required
            fullWidth
            size="small"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              required: true
            }}
            error={!!errors.fechaNacimiento}
          />
          {errors.fechaNacimiento && (
            <FormHelperText error>{errors.fechaNacimiento}</FormHelperText>
          )}
        </BaseFormField>

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
            variant="outlined"
            required
            InputLabelProps={{
              required: true
            }}
          >
            <MenuItem value="cedula">Cédula de Ciudadanía</MenuItem>
            <MenuItem value="cedula_extranjera">Cédula de Extranjería</MenuItem>
            <MenuItem value="pasaporte">Pasaporte</MenuItem>
            <MenuItem value="ppt">PPT</MenuItem>
          </TextField>
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Número de Documento"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            disabled={isView}
            required
            asterisk
          />
          {errors.numeroDocumento && <FormHelperText error>{errors.numeroDocumento}</FormHelperText>}
        </BaseFormField>
      </BaseFormSection>

      {/* Contraseña (solo create/edit) */}
      {mode !== "view" && (
        <BaseFormSection title="Seguridad">
          <BaseFormField>
            <BaseInputField
              label="Contraseña*"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              asterisk
            />
            {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Confirmar Contraseña*"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              asterisk
            />
            {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
          </BaseFormField>
        </BaseFormSection>
      )}

      {/* Rol */}
      <BaseFormSection title="Rol">
        <BaseFormField>
          <TextField
            select
            fullWidth
            label="Seleccionar Rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            disabled={isView}
            size="small"
            variant="outlined"
            required
            error={!!errors.rol}
            InputLabelProps={{
              required: true
            }}
          >
            <MenuItem value="">
              <em>-- Seleccione un rol --</em>
            </MenuItem>
            {rolesDisponibles.map((rol) => (
              <MenuItem key={rol.id || rol} value={rol.id || rol}>
                {rol.nombre || rol}
              </MenuItem>
            ))}
          </TextField>
          {errors.rol && <FormHelperText error>{errors.rol}</FormHelperText>}
        </BaseFormField>
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