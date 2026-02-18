import { useEffect, useState } from "react";
import { TextField, MenuItem, FormHelperText } from "@mui/material";

import BaseFormLayout from "../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../shared/components/base/BaseFormActions";

export default function ProveedorForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    tipoProveedor: "Persona Jurídica",
    tipoDocumento: "NIT",
    documento: "",
    razonSocial: "",
    contactoNombre: "",
    telefono: "",
    correo: "",
    departamento: "",
    municipio: "",
    direccion: "",
    estado: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setFormData({ ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!formData.razonSocial.trim()) newErrors.razonSocial = "Requerido";
    if (!formData.documento.trim()) newErrors.documento = "Requerido";
    if (!formData.contactoNombre.trim()) newErrors.contactoNombre = "Requerido";
    if (!phoneRegex.test(formData.telefono)) newErrors.telefono = "Inválido";
    if (!emailRegex.test(formData.correo)) newErrors.correo = "Inválido";
    if (!formData.departamento) newErrors.departamento = "Requerido";
    if (!formData.municipio) newErrors.municipio = "Requerido";
    if (!formData.direccion.trim()) newErrors.direccion = "Requerido";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información del Proveedor">
        {/* 1 - 2 */}
        <BaseFormField>
          <TextField
            select
            fullWidth
            size="small"
            label="Tipo de Proveedor"
            name="tipoProveedor"
            value={formData.tipoProveedor}
            onChange={handleChange}
            disabled={isView}
          >
            <MenuItem value="Persona Jurídica">Persona Jurídica</MenuItem>
            <MenuItem value="Persona Natural">Persona Natural</MenuItem>
          </TextField>
        </BaseFormField>

        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label={
              formData.tipoProveedor === "Persona Jurídica"
                ? "Razón Social"
                : "Nombre Completo"
            }
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.razonSocial}
          />
          {errors.razonSocial && (
            <FormHelperText error>{errors.razonSocial}</FormHelperText>
          )}
        </BaseFormField>

        {/* 3 - 4 */}
        <BaseFormField>
          <TextField
            select
            fullWidth
            size="small"
            label="Tipo de Documento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            disabled={isView}
          >
            <MenuItem value="NIT">NIT</MenuItem>
            <MenuItem value="CC">Cédula</MenuItem>
            <MenuItem value="CE">Cédula Extranjería</MenuItem>
          </TextField>
        </BaseFormField>

        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Número de Documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.documento}
          />
          {errors.documento && (
            <FormHelperText error>{errors.documento}</FormHelperText>
          )}
        </BaseFormField>

        {/* 5 - 6 */}
        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Persona de Contacto"
            name="contactoNombre"
            value={formData.contactoNombre}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.contactoNombre}
          />
        </BaseFormField>

        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.telefono}
          />
        </BaseFormField>

        {/* 7 - 8 */}
        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Correo Electrónico"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.correo}
          />
        </BaseFormField>

        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.departamento}
          />
        </BaseFormField>

        {/* 9 - 10 */}
        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Municipio"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.municipio}
          />
        </BaseFormField>

        <BaseFormField>
          <TextField
            fullWidth
            size="small"
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.direccion}
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