import { useState, useEffect } from "react";

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
    tipoDocumento: "",
    numeroDocumento: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        email: initialData.email || "",
        telefono: initialData.telefono || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        tipoDocumento: initialData.tipoDocumento || "",
        numeroDocumento: initialData.numeroDocumento || "",
        password: "",
        confirmPassword: "",
        rol: initialData.rol || ""
      });
    }
  }, [initialData]);

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

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre completo es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es requerida";
    }

    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = "Debe seleccionar un tipo de documento";
    }

    if (!formData.numeroDocumento.trim()) {
      newErrors.numeroDocumento = "El número de documento es requerido";
    }

    if (mode !== "view") {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

      if (!formData.password) {
        newErrors.password = "La contraseña es requerida";
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Debe tener al menos 6 caracteres, 1 mayúscula y 1 número";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

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
      {/* INFORMACIÓN PERSONAL */}
      <BaseFormSection>

        <BaseFormField>
          <BaseInputField
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "telefono", value: soloNumeros }
              });
            }}
            disabled={isView}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            select
            options={[
              { value: "cedula", label: "Cédula de Ciudadanía" },
              { value: "cedula_extranjera", label: "Cédula de Extranjería" },
              { value: "pasaporte", label: "Pasaporte" },
              { value: "ppt", label: "PPT" }
            ]}
            disabled={isView}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Número de Documento "
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "numeroDocumento", value: soloNumeros }
              });
            }}
            disabled={isView}
            required
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento}
          />
        </BaseFormField>

      </BaseFormSection>

      {/* SEGURIDAD */}
      {mode !== "view" && (
        <BaseFormSection>

          <BaseFormField>
            <BaseInputField
              label="Contraseña "
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!errors.password}
              helperText={errors.password}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Confirmar Contraseña "
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </BaseFormField>

        </BaseFormSection>
      )}

      {/* ROL */}
      <BaseFormSection>

        <BaseFormField>
          <BaseInputField
            label="Seleccionar Rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            select
            options={[
              { value: "", label: "-- Seleccione un rol --" },
              ...rolesDisponibles.map((rol) => ({
                value: rol.id || rol,
                label: rol.nombre || rol
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.rol}
            helperText={errors.rol}
          />
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
