import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";
import {
  tipoDocumentoOptions,
  cargoOptions,
  estadoOptions,
} from "../utils/empleadosUtils";

export default function EmpleadoForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
  formData,
  errors,
  submitting,
  handleChange,
  handleSubmit,
}) {
  const isView = mode === "view";

  const onSubmitForm = async () => {
    const result = await handleSubmit();
    if (result.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection>
        <BaseFormField>
          <BaseInputField
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView || submitting}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            select
            options={cargoOptions}
            disabled={isView || submitting}
            required
            error={!!errors.cargo}
            helperText={errors.cargo}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            select
            options={tipoDocumentoOptions}
            disabled={isView || submitting}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Número de Documento"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "numero_documento", value: soloNumeros },
              });
            }}
            disabled={isView || submitting}
            required
            error={!!errors.numero_documento}
            helperText={errors.numero_documento}
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
                target: { name: "telefono", value: soloNumeros },
              });
            }}
            disabled={isView || submitting}
            required
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo Electrónico"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView || submitting}
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Fecha de Ingreso"
            name="fecha_ingreso"
            type="date"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            disabled={isView || submitting}
            required
            error={!!errors.fecha_ingreso}
            helperText={errors.fecha_ingreso}
            InputLabelProps={{ shrink: true }}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView || submitting}
            multiline
            rows={1}
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
        </BaseFormField>

        {mode !== "create" && (
          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={estadoOptions}
              disabled={isView || submitting}
              required
            />
          </BaseFormField>
        )}
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={onSubmitForm}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
        saveDisabled={submitting}
        saveLabel={submitting ? "Guardando..." : "Guardar"}
      />
    </BaseFormLayout>
  );
}