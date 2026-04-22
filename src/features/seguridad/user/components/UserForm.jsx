import {
  BaseFormLayout,
  BaseFormSection,
  BaseInputField,
  BaseFormActions,
  FormCol,
  FormRow
} from "@shared";
import { useState, useEffect } from 'react';

export default function UserForm({
  mode = "create",
  title,
  initialData = {},
  rolesDisponibles = [],
  errors = {},
  onChange,
  onTelefonoChange,
  onNumeroDocumentoChange,
  onSubmit,
  onCancel,
  onEdit,
  isSubmitting = false
}) {
  const isView = mode === "view";
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setOriginalData(JSON.parse(JSON.stringify(initialData)));
  }, [initialData]);

  useEffect(() => {
    const currentData = {
      nombre: initialData?.nombre || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      fechaNacimiento: initialData?.fechaNacimiento || "",
      tipoDocumento: initialData?.tipoDocumento || "",
      numeroDocumento: initialData?.numeroDocumento || "",
      rol: initialData?.rol || "",
      ...(mode !== "view" && {
        password: initialData?.password || "",
        confirmPassword: initialData?.confirmPassword || "",
      })
    };

    const original = {
      nombre: originalData?.nombre || "",
      email: originalData?.email || "",
      telefono: originalData?.telefono || "",
      fechaNacimiento: originalData?.fechaNacimiento || "",
      tipoDocumento: originalData?.tipoDocumento || "",
      numeroDocumento: originalData?.numeroDocumento || "",
      rol: originalData?.rol || "",
      ...(mode !== "view" && {
        password: originalData?.password || "",
        confirmPassword: originalData?.confirmPassword || "",
      })
    };

    const hasAnyChange = JSON.stringify(currentData) !== JSON.stringify(original);
    setHasChanges(hasAnyChange);
  }, [initialData, originalData, mode]);

  const handleSave = () => {
    if (mode === "edit" && !hasChanges) {
      onCancel?.();
      return;
    }
    onSubmit();
  };

  return (
    <BaseFormLayout title={title}>
      <FormRow>
        {/* Máximo 4 columnas por fila - TODOS con md={3} */}
        <FormCol md={3}>
          <BaseInputField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={initialData?.tipoDocumento || ""}
            onChange={onChange}
            select
            options={[
              { value: "", label: "-- Seleccione --" },
              { value: "cedula", label: "Cédula de Ciudadanía" },
              { value: "cedula_extranjera", label: "Cédula Extranjera" },
              { value: "pasaporte", label: "Pasaporte" },
              { value: "ppt", label: "PPT" }
            ]}
            disabled={isView}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </FormCol>

        <FormCol md={3}>
          <BaseInputField
            label="Número de Documento"
            name="numeroDocumento"
            value={initialData?.numeroDocumento || ""}
            onChange={onNumeroDocumentoChange}
            disabled={isView}
            required
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento}
          />
        </FormCol>

        <FormCol md={3}>
          <BaseInputField
            label="Nombre Completo"
            name="nombre"
            value={initialData?.nombre || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </FormCol>

        <FormCol md={3}>
          <BaseInputField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={initialData?.email || ""}
            onChange={onChange}
            disabled={isView || mode === "edit"}
            required
            error={!!errors.email}
            helperText={mode === "edit" ? "El correo no se puede modificar" : errors.email}
          />
        </FormCol>

        <FormCol md={3}>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={initialData?.telefono || ""}
            onChange={onTelefonoChange}
            disabled={isView}
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
        </FormCol>

        <FormCol md={3}>
          <BaseInputField
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={initialData?.fechaNacimiento || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento}
          />
        </FormCol>

        {mode !== "view" && (
          <>
            <FormCol md={3}>
              <BaseInputField
                label={mode === "create" ? "Contraseña" : "Nueva Contraseña (opcional)"}
                name="password"
                type="password"
                value={initialData?.password || ""}
                onChange={onChange}
                required={mode === "create"}
                error={!!errors.password}
                helperText={mode === "edit" ? "Dejar en blanco para mantener la actual" : errors.password}
              />
            </FormCol>

            <FormCol md={3}>
              <BaseInputField
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={initialData?.confirmPassword || ""}
                onChange={onChange}
                required={mode === "create"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </FormCol>
          </>
        )}

        <FormCol md={3}>
          <BaseInputField
            label="Seleccionar Rol"
            name="rol"
            value={initialData?.rol || ""}
            onChange={onChange}
            select
            options={[
              { value: "", label: "-- Seleccione un rol --" },
              ...rolesDisponibles.map((rol) => ({
                value: rol.id,
                label: rol.nombre
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.rol}
            helperText={errors.rol}
          />
        </FormCol>
      </FormRow>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSave}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
        saveLabel={mode === "edit" && !hasChanges ? "Sin cambios" : "Guardar"}
      />
    </BaseFormLayout>
  );
}