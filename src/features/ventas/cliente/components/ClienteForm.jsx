import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import {
  tipoDocumentoOptions,
  generoOptions,
  estadoOptions,
  departamentoOptions,
  getMunicipioOptions,
} from "../utils/clientesUtils";
import { useClienteForm } from "../hooks/useClienteForm";

// Solo letras, tildes, ñ y espacios
const soloLetras = (value) => value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");

export default function ClienteForm({
  mode = "create",
  title,
  initialData = null,
  onSubmit,
  onCancel,
  onError,
  extraActions = null,
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
    onError: onError ?? ((error) => console.error(error)),
  });

  const onSubmitForm = async () => {
    const result = await handleSubmit();
    if (result?.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  const isDisabled = isView || submitting;
  const isCreate   = mode === "create";
  const municipios = getMunicipioOptions(formData.departamento);

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información Personal">

        <BaseFormField>
          <BaseInputField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) =>
              handleChange({ target: { name: "nombre", value: soloLetras(e.target.value) } })
            }
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
            onChange={(e) =>
              handleChange({ target: { name: "apellido", value: soloLetras(e.target.value) } })
            }
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
              handleChange({ target: { name: "telefono", value: e.target.value.replace(/\D/g, "") } })
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
              handleChange({ target: { name: "documento", value: e.target.value.replace(/\D/g, "") } })
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

        {/* Departamento — select con lista de Colombia */}
        <BaseFormField>
          <BaseInputField
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            select
            options={departamentoOptions}
            disabled={isDisabled}
            required
            error={!!errors.departamento}
            helperText={errors.departamento}
          />
        </BaseFormField>

        {/* Municipio — depende del departamento seleccionado */}
        <BaseFormField>
          <BaseInputField
            label="Municipio"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            select
            options={municipios}
            disabled={isDisabled || (!isView && !formData.departamento)}
            required
            error={!!errors.ciudad}
            helperText={errors.ciudad || (!formData.departamento && !isView ? "Seleccione primero un departamento" : "")}
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

        {/* Estado — solo en editar y ver detalle, nunca en crear */}
        {!isCreate && (
          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={estadoOptions}
              disabled={isDisabled}
            />
          </BaseFormField>
        )}

      </BaseFormSection>

      {/* Botones en modo vista */}
      {isView && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          {extraActions}
          <button className="crud-btn crud-btn-secondary" onClick={onCancel}>
            Volver
          </button>
        </div>
      )}

      {/* Botones en crear / editar */}
      {!isView && (
        <BaseFormActions
          onCancel={onCancel}
          onSave={onSubmitForm}
          showSave
          saveLabel="Guardar"
          saveDisabled={submitting}
        />
      )}

    </BaseFormLayout>
  );
}