import { useState, useEffect } from "react";
import { FormHelperText, TextField } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

import { ServicioData } from "../../../../../lib/data/serviciosData";

// Formateador de moneda colombiana
const formatCOP = (value) => {
  if (!value && value !== 0) return "";
  const numero =
    typeof value === "string"
      ? parseInt(value.replace(/[^0-9]/g, ""), 10)
      : value;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
    .format(numero)
    .replace("COP", "")
    .trim();
};

export default function ServicioForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracionMin: "",
    precio: "",
    estado: "activo"
  });

  const [errors, setErrors] = useState({});
  const [nombreExists, setNombreExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        duracionMin: initialData.duracion_min?.toString() || "",
        precio: initialData.precio?.toString() || "",
        estado: initialData.estado || 'activo'
      });
    }
  }, [initialData]);

  const formatNombre = (text) => {
    if (!text) return "";
    const trimmed = text.trim().replace(/\s+/g, " ");
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const soloLetras = (text) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return regex.test(text);
  };

  const checkNombreExists = async (nombre) => {
    try {
      const servicios = await ServicioData.getAllServicios();
      const nombreTrimmed = nombre.trim().toLowerCase();
      
      return servicios.some(servicio => 
        servicio.nombre.toLowerCase().trim() === nombreTrimmed &&
        (mode === "edit" ? servicio.id !== initialData?.id : true)
      );
    } catch (error) {
      console.error("Error verificando nombre duplicado:", error);
      return false;
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "duracionMin" || name === "precio") {
      processedValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "nombre") {
      if (!soloLetras(value) && value !== "") {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

    if (name === "nombre" && processedValue.trim().length >= 3) {
      const exists = await checkNombreExists(processedValue);
      setNombreExists(exists);
    } else if (name === "nombre") {
      setNombreExists(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nombreTrimmed = formData.nombre.trim().replace(/\s+/g, " ");

    if (!nombreTrimmed) {
      newErrors.nombre = "El nombre del servicio es requerido";
    } else if (nombreTrimmed.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombreTrimmed.length > 20) {
      newErrors.nombre = "El nombre no puede exceder 20 caracteres";
    } else if (!soloLetras(nombreTrimmed)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
    } else if (nombreExists) {
      newErrors.nombre = "Ya existe un servicio con este nombre";
    }

    const duracionNum = parseInt(formData.duracionMin, 10);
    if (!formData.duracionMin) {
      newErrors.duracionMin = "La duración es requerida";
    } else if (isNaN(duracionNum) || duracionNum <= 0) {
      newErrors.duracionMin = "La duración debe ser mayor a 0";
    } else if (duracionNum > 480) {
      newErrors.duracionMin = "Máximo 480 minutos (8 horas)";
    }

    const precioNum = parseInt(formData.precio, 10);
    if (!formData.precio) {
      newErrors.precio = "El precio es requerido";
    } else if (isNaN(precioNum) || precioNum < 0) {
      newErrors.precio = "El precio debe ser mayor o igual a 0";
    }

    if (formData.descripcion && formData.descripcion.length > 120) {
      newErrors.descripcion = "Máximo 120 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nombreFinal = formatNombre(
      formData.nombre.trim().replace(/\s+/g, " ")
    );

    const dataToSubmit = {
      nombre: nombreFinal,
      descripcion: formData.descripcion.trim(),
      duracion_min: parseInt(formData.duracionMin, 10),
      precio: parseInt(formData.precio, 10),
      estado: mode === "create" ? true : formData.estado === "activo"
    };

    onSubmit?.(dataToSubmit);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection>
        <BaseFormField>
          <BaseInputField
            label="Nombre del Servicio"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.nombre || nombreExists}
            helperText={errors.nombre || (nombreExists ? "Ya existe un servicio con este nombre" : "")}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Duración (minutos)"
            name="duracionMin"
            value={formData.duracionMin}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.duracionMin}
            helperText={errors.duracionMin}
            inputProps={{ inputMode: "numeric", min: 1, max: 480 }}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.precio}
            helperText={errors.precio}
            inputProps={{ inputMode: "numeric", min: 0 }}
          />
          {formData.precio && !errors.precio && (
            <FormHelperText sx={{ mt: 0.5 }}>
              {formatCOP(formData.precio)} COP
            </FormHelperText>
          )}
        </BaseFormField>

        {mode === "create" && (
          <BaseFormField>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isView}
              multiline
              rows={1.65}
              variant="outlined"
              size="small"
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
          </BaseFormField>
        )}

        {mode !== "create" && (
          <BaseFormField>
            <BaseInputField
              label="Estado del Servicio"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select
              options={[
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" }
              ]}
              disabled={isView}
            />
          </BaseFormField>
        )}
      </BaseFormSection>

      {mode !== "create" && (
        <BaseFormSection>
          <BaseFormField fullWidth>
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isView}
              multiline
              rows={2}
              variant="outlined"
              size="small"
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
          </BaseFormField>
        </BaseFormSection>
      )}

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={mode !== "view"}
        showEdit={mode === "view"}
        saveLabel={mode === "create" ? "Guardar " : "Guardar"}
        cancelLabel="Cancelar"
        editLabel="Editar"
      />
    </BaseFormLayout>
  );
}