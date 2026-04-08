import {
  BaseFormLayout,
  BaseFormSection,
  BaseInputField,
  BaseFormActions,
  FormCol
} from "@shared";

export default function UserForm({
  mode = "create",
  title,
  initialData,
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

  return (
    <BaseFormLayout title={title}>
      {/* SECCIÓN: INFORMACIÓN PERSONAL */}
      <BaseFormSection>
        <FormCol md={6}>
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

        <FormCol md={6}>
          <BaseInputField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={initialData?.email || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </FormCol>

        <FormCol md={6}>
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

        <FormCol md={6}>
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

        <FormCol md={6}>
          <BaseInputField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={initialData?.tipoDocumento || ""}
            onChange={onChange}
            select
            options={[
              { value: "",                 label: "-- Seleccione --"      },
              { value: "cedula",           label: "Cédula de Ciudadanía"  },
              { value: "cedula_extranjera", label: "Cédula Extranjera"    },
              { value: "pasaporte",        label: "Pasaporte"             },
              { value: "ppt",              label: "PPT"                   }
            ]}
            disabled={isView}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </FormCol>

        <FormCol md={6}>
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
      </BaseFormSection>

      {/* SECCIÓN: SEGURIDAD */}
      {mode !== "view" && (
        <BaseFormSection>
          <FormCol md={6}>
            <BaseInputField
              label="Contraseña"
              name="password"
              type="password"
              value={initialData?.password || ""}
              onChange={onChange}
              required={mode === "create"}
              error={!!errors.password}
              helperText={errors.password}
            />
          </FormCol>

          <FormCol md={6}>
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
        </BaseFormSection>
      )}

      {/* SECCIÓN: ROL */}
      <BaseFormSection>
        <FormCol md={12}>
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
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={onSubmit}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
        isSubmitting={isSubmitting}
      />
    </BaseFormLayout>
  );
}