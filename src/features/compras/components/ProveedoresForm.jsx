import { useEffect, useState } from "react";

import BaseFormLayout from "../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../shared/components/base/BaseInputField";

const DEFAULT_FORM = {
  tipoProveedor:  "Persona Jurídica",
  tipoDocumento:  "NIT",
  documento:      "",
  razonSocial:    "",
  contactoNombre: "",
  telefono:       "",
  correo:         "",
  departamento:   "",
  municipio:      "",
  direccion:      "",
  estado:         "activo",
};

export default function ProveedorForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors,   setErrors]   = useState({});

  // 🔥 Igual que RolForm: convierte estado booleano → "activo"/"inactivo"
  useEffect(() => {
    if (initialData) {
      const estadoStr =
        initialData.estado === true  ? "activo"   :
        initialData.estado === false ? "inactivo" :
        // Si ya viene como string (ej: "Activo"/"Inactivo") también lo normalizamos
        (initialData.estado || "").toLowerCase() === "activo" ? "activo" : "inactivo";

      setFormData({
        tipoProveedor:  initialData.tipoProveedor  || DEFAULT_FORM.tipoProveedor,
        tipoDocumento:  initialData.tipoDocumento   || DEFAULT_FORM.tipoDocumento,
        documento:      initialData.documento       || "",
        razonSocial:    initialData.razonSocial     || "",
        contactoNombre: initialData.contactoNombre  || "",
        telefono:       initialData.telefono        || "",
        correo:         initialData.correo          || "",
        departamento:   initialData.departamento    || "",
        municipio:      initialData.municipio       || "",
        direccion:      initialData.direccion       || "",
        estado:         estadoStr,
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!formData.razonSocial.trim())    newErrors.razonSocial    = "Requerido";
    if (!formData.documento.trim())      newErrors.documento      = "Requerido";
    if (!formData.contactoNombre.trim()) newErrors.contactoNombre = "Requerido";
    if (!phoneRegex.test(formData.telefono))  newErrors.telefono  = "Teléfono inválido (7-15 dígitos)";
    if (!emailRegex.test(formData.correo))    newErrors.correo    = "Correo inválido";
    if (!formData.departamento.trim())   newErrors.departamento   = "Requerido";
    if (!formData.municipio.trim())      newErrors.municipio      = "Requerido";
    if (!formData.direccion.trim())      newErrors.direccion      = "Requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Enviamos estado como booleano al backend
    onSubmit?.({
      ...formData,
      estado: formData.estado === "activo",
    });
  };

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información del Proveedor">

        <BaseFormField>
          <BaseInputField
            label="Tipo de Proveedor"
            name="tipoProveedor"
            value={formData.tipoProveedor}
            onChange={handleChange}
            select
            options={[
              { value: "Persona Jurídica", label: "Persona Jurídica" },
              { value: "Persona Natural",  label: "Persona Natural"  },
            ]}
            disabled={isView}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label={formData.tipoProveedor === "Persona Jurídica" ? "Razón Social" : "Nombre Completo"}
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.razonSocial}
            helperText={errors.razonSocial}
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
              { value: "NIT", label: "NIT"                },
              { value: "CC",  label: "Cédula"             },
              { value: "CE",  label: "Cédula Extranjería" },
            ]}
            disabled={isView}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Número de Documento"
            name="documento"
            value={formData.documento}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({ target: { name: "documento", value: soloNumeros } });
            }}
            disabled={isView}
            required
            error={!!errors.documento}
            helperText={errors.documento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Persona de Contacto"
            name="contactoNombre"
            value={formData.contactoNombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.contactoNombre}
            helperText={errors.contactoNombre}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({ target: { name: "telefono", value: soloNumeros } });
            }}
            disabled={isView}
            required
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Correo Electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.correo}
            helperText={errors.correo}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.departamento}
            helperText={errors.departamento}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Municipio"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.municipio}
            helperText={errors.municipio}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
        </BaseFormField>

        {/* Estado — solo visible en editar y ver */}
        {mode !== "create" && (
          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={[
                { value: "activo",   label: "Activo"   },
                { value: "inactivo", label: "Inactivo" },
              ]}
              disabled={isView}
            />
          </BaseFormField>
        )}

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