import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { tipoDocumentoOptions, generoOptions } from "../utils/clientesUtils";
import { useClienteForm } from "../hooks/useClienteForm";

export default function ClienteForm({
  mode = "create",
  title,
  initialData = null,
  onSubmit,
  onCancel,
  onEdit,
}) {
  const {
    formData,
    errors,
    submitting,
    isView,
    isEdit,
    handleChange,
    handleSubmit,
  } = useClienteForm({
    mode,
    initialData,
    onSubmitSuccess: onSubmit,
    onError: (error) => console.error(error),
  });

  const onSubmitForm = async () => {
    const result = await handleSubmit();
    if (result.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  const isDisabled = isView || submitting;

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información Personal">

        <BaseFormField>
          <BaseInputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isDisabled}
            required
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            disabled={isDisabled}
            required
            error={!!errors.apellido}
            helperText={errors.apellido}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={isDisabled}
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "telefono",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
            disabled={isDisabled}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Fecha Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            disabled={isDisabled}
            required
            error={!!errors.fechaNacimiento}
            helperText={errors.fechaNacimiento}
            InputLabelProps={{ shrink: true }}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Tipo Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            select
            options={tipoDocumentoOptions}
            disabled={isDisabled}
            required
            error={!!errors.tipoDocumento}
            helperText={errors.tipoDocumento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Documento"
            name="documento"
            value={formData.documento}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "documento",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
            disabled={isDisabled}
            required
            error={!!errors.documento}
            helperText={errors.documento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Género"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            select
            options={generoOptions}
            disabled={isDisabled}
            required
            error={!!errors.genero}
            helperText={errors.genero}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            disabled={isDisabled}
            required
            error={!!errors.ciudad}
            helperText={errors.ciudad}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isDisabled}
          />
        </BaseFormField>

      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={onSubmitForm}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
        saveLabel={isEdit ? "Actualizar Cliente" : "Guardar Cliente"}
        saveDisabled={submitting}
      />
    </BaseFormLayout>
  );
}