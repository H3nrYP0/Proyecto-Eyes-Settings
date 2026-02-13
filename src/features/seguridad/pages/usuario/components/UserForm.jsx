import { useState, useEffect } from "react";
import { FormHelperText } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";


export default function UserForm({
  mode = "create", // "create" | "edit" | "view"
  title,
  initialData,
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
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

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
        confirmPassword: ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    // Aquí irían todas las validaciones como en tu archivo original
    // ...
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  const calcularFechaMaxima = () => {
    const hoy = new Date();
    const fechaMax = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    return fechaMax.toISOString().split("T")[0];
  };

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información Personal">
        <BaseFormField>
          <BaseInputField
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
          />
          {errors.nombre && <FormHelperText error>{errors.nombre}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            disabled={isView}
            inputProps={{ max: calcularFechaMaxima() }}
          />
          {errors.fechaNacimiento && <FormHelperText error>{errors.fechaNacimiento}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <SelectField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            disabled={isView}
            options={[
              { value: "cedula", label: "Cédula de Ciudadanía" },
              { value: "cedula_extranjera", label: "Cédula de Extranjería" },
              { value: "pasaporte", label: "Pasaporte" },
              { value: "ppt", label: "PPT (Permiso de Permanencia)" },
            ]}
          />
          {errors.tipoDocumento && <FormHelperText error>{errors.tipoDocumento}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Número de Documento"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            disabled={isView}
          />
          {errors.numeroDocumento && <FormHelperText error>{errors.numeroDocumento}</FormHelperText>}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isView}
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

        {mode !== "view" && (
          <>
            <BaseFormField>
              <BaseInputField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </BaseFormField>

            <BaseFormField>
              <BaseInputField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword}</FormHelperText>}
            </BaseFormField>
          </>
        )}
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={isView}
      />
    </BaseFormLayout>
  );
}
