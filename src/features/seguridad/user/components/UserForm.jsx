import {
  BaseFormLayout,
  BaseInputField,
  BaseFormActions,
  FormCol,
  FormRow
} from "@shared";

/**
 * UserForm — Formulario de usuarios administrativos
 * Modos: "create" | "edit" | "view"
 */
export default function UserForm({
  mode = "create",
  title,
  initialData = {},
  rolesDisponibles = [],
  errors = {},
  onChange,
  onSubmit,
  onCancel,
  onEdit,
  isSubmitting = false
}) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";

  return (
    <BaseFormLayout title={title}>
      <FormRow>

        {/* NOMBRE */}
        <FormCol>
          <BaseInputField
            label="Nombre completo"
            name="nombre"
            value={initialData?.nombre || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </FormCol>

        {/* CORREO */}
        <FormCol>
          <BaseInputField
            label="Correo electrónico"
            name="correo"
            type="email"
            value={initialData?.correo || ""}
            onChange={onChange}
            disabled={isView}
            required
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </FormCol>

        {/* ROL */}
        <FormCol>
          <BaseInputField
            label="Rol"
            name="rol_id"
            value={initialData?.rol_id || ""}
            onChange={onChange}
            select
            options={[
              { value: "", label: "-- Seleccione un rol --" },
              ...rolesDisponibles.map((rol) => ({ value: rol.id, label: rol.nombre }))
            ]}
            disabled={isView}
            required
            error={!!errors.rol_id}
            helperText={errors.rol_id}
          />
        </FormCol>

        {/* ESTADO — solo en edición y vista */}
        {(isEdit || isView) && (
          <FormCol>
            <BaseInputField
              label="Estado"
              name="estado"
              value={initialData?.estado === true ? "activo" : "inactivo"}
              onChange={(e) =>
                onChange?.({
                  target: { name: "estado", value: e.target.value === "activo" }
                })
              }
              select
              options={[
                { value: "activo",   label: "Activo"   },
                { value: "inactivo", label: "Inactivo" },
              ]}
              disabled={isView}
            />
          </FormCol>
        )}

        {/* CONTRASEÑA — oculta en vista */}
        {!isView && (
          <>
            <FormCol>
              <BaseInputField
                label={isCreate ? "Contraseña" : "Nueva contraseña (opcional)"}
                name="contrasenia"
                type="password"
                value={initialData?.contrasenia || ""}
                onChange={onChange}
                required={isCreate}
                error={!!errors.contrasenia}
                helperText={errors.contrasenia}
              />
            </FormCol>

            <FormCol>
              <BaseInputField
                label={isCreate ? "Confirmar contraseña" : "Confirmar nueva contraseña"}
                name="confirmar_contrasenia"
                type="password"
                value={initialData?.confirmar_contrasenia || ""}
                onChange={onChange}
                required={isCreate}
                error={!!errors.confirmar_contrasenia}
                helperText={errors.confirmar_contrasenia}
              />
            </FormCol>
          </>
        )}

      </FormRow>

      <BaseFormActions
        onCancel={onCancel}
        onSave={onSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        isSubmitting={isSubmitting}
      />
    </BaseFormLayout>
  );
}