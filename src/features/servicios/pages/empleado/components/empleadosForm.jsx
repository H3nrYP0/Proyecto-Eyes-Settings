import { useState, useEffect } from "react";
import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function EmpleadoForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    tipoDocumento: "CC",
    numero_documento: "",
    telefono: "",
    correo: "",
    direccion: "",
    fecha_ingreso: "",
    cargo: "",
    estado: "activo",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        tipoDocumento: initialData.tipo_documento || initialData.tipoDocumento || "CC",
        numero_documento: initialData.numero_documento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || initialData.email || "",
        direccion: initialData.direccion || "",
        fecha_ingreso: initialData.fecha_ingreso || "",
        cargo: initialData.cargo || "",
        estado: initialData.estado || "activo",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validaciones
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "Mínimo 3 caracteres";
    }

    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = "Seleccione un tipo de documento";
    }

    if (!formData.numero_documento.trim()) {
      newErrors.numero_documento = "El número de documento es requerido";
    } else {
      const doc = formData.numero_documento.trim();
      if (formData.tipoDocumento === "CC" || formData.tipoDocumento === "CE") {
        if (!/^[0-9]{6,10}$/.test(doc)) {
          newErrors.numero_documento = "Documento inválido (6-10 dígitos)";
        }
      } else if (formData.tipoDocumento === "PA") {
        if (!/^[A-Za-z0-9]{6,12}$/.test(doc)) {
          newErrors.numero_documento = "Pasaporte inválido (6-12 caracteres)";
        }
      }
    }

    const telefonoRegex = /^[0-9]{7,15}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ""))) {
      newErrors.telefono = "Teléfono inválido (7-15 dígitos)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correo && !emailRegex.test(formData.correo)) {
      newErrors.correo = "Formato de email inválido";
    }

    if (!formData.cargo) {
      newErrors.cargo = "Seleccione un cargo";
    }

    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = "La fecha de ingreso es requerida";
    } else {
      const fechaIngreso = new Date(formData.fecha_ingreso);
      const hoy = new Date();
      if (fechaIngreso > hoy) {
        newErrors.fecha_ingreso = "La fecha no puede ser futura";
      }
    }

    if (!formData.estado) {
      newErrors.estado = "Debe seleccionar un estado";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  // Opciones para selects
  const tipoDocumentoOptions = [
    { value: "CC", label: "Cédula de Ciudadanía" },
    { value: "CE", label: "Cédula de Extranjería" },
    { value: "PA", label: "Pasaporte" },
  ];

  const cargoOptions = [
    { value: "", label: "-- Seleccione un cargo --" },
    { value: "Optómetra", label: "Optómetra" },
    { value: "Asistente", label: "Asistente" },
    { value: "Técnico", label: "Técnico" },
    { value: "Administrador", label: "Administrador" },
    { value: "Recepcionista", label: "Recepcionista" },
    { value: "Vendedor", label: "Vendedor" },
  ];

  const estadoOptions = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  return (
    <BaseFormLayout title={title}>
      {/* INFORMACIÓN DEL EMPLEADO */}
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
            label="Cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            select
            options={cargoOptions}
            disabled={isView}
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
            disabled={isView}
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
                target: { name: "numero_documento", value: soloNumeros }
              });
            }}
            disabled={isView}
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
                target: { name: "telefono", value: soloNumeros }
              });
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
            type="email"
            value={formData.correo}
            onChange={handleChange}
            disabled={isView}
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
            disabled={isView}
            required
            error={!!errors.fecha_ingreso}
            helperText={errors.fecha_ingreso}
            InputLabelProps={{ shrink: true }}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            select
            options={estadoOptions}
            disabled={isView}
            required
            error={!!errors.estado}
            helperText={errors.estado}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView}
            multiline
            rows={2}
            error={!!errors.direccion}
            helperText={errors.direccion}
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