import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function CategoriaForm({
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
    descripcion: "",
    estado: "activa",
  });

  const [errors, setErrors] = useState({});

  // 🔹 Cuando cambia initialData (detalle / editar), actualizar estado
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: initialData.estado || "activa",
      });
    }
  }, [initialData]);

  // 🔹 Cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // 🔹 Validaciones y submit (igual estilo que UsuarioForm)
  const handleSubmit = () => {
    const newErrors = {};

    // Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la categoría es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    // Descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    // Estado
    if (!formData.estado) {
      newErrors.estado = "Debe seleccionar un estado";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <BaseFormLayout title={title}>
      {/* Información de la Categoría */}
      <BaseFormSection title="Información de la Categoría">
        <BaseFormField>
          <BaseInputField
            label="Nombre de la Categoría*"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            required
            asterisk
          />
          {errors.nombre && (
            <FormHelperText error>{errors.nombre}</FormHelperText>
          )}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Descripción*"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            required
            asterisk
            multiline
          />
          {errors.descripcion && (
            <FormHelperText error>{errors.descripcion}</FormHelperText>
          )}
        </BaseFormField>

        <BaseFormField>
          <TextField
            select
            fullWidth
            label="Estado*"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={isView}
            size="small"
            variant="outlined"
            required
            error={!!errors.estado}
            InputLabelProps={{
              required: true,
            }}
          >
            <MenuItem value="activa">Activa</MenuItem>
            <MenuItem value="inactiva">Inactiva</MenuItem>
          </TextField>
          {errors.estado && (
            <FormHelperText error>{errors.estado}</FormHelperText>
          )}
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
