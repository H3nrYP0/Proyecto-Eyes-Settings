import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Grid } from "@mui/material";

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: initialData.estado || "activa",
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la categoría es requerido";
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
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

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información de la Categoría">
        <Grid container spacing={3}>
          {/* Nombre */}
          <Grid item xs={12} md={6}>
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
              <FormHelperText error>
                {errors.nombre || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Estado */}
          <Grid item xs={12} md={6}>
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
                required
                error={!!errors.estado}
              >
                <MenuItem value="activa">Activa</MenuItem>
                <MenuItem value="inactiva">Inactiva</MenuItem>
              </TextField>
              <FormHelperText error>
                {errors.estado || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
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
                rows={4}
              />
              <FormHelperText error>
                {errors.descripcion || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>
        </Grid>
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
