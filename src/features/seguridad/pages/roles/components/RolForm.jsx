import { useState } from "react";
import { FormHelperText } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

import PermisosSelector from "./PermisosSelector";

export default function RolForm({
  mode = "create",
  title,
  initialData,
  permisosDisponibles = [],
  onSubmit,
  onCancel
}) {

  const [formData, setFormData] = useState(
    initialData || {
      nombre: "",
      descripcion: "",
      estado: "activo",
      permisos: []
    }
  );

  const [errors, setErrors] = useState({});

  const isView = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del rol es requerido";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (formData.permisos.length === 0) {
      newErrors.permisos = "Debe seleccionar al menos un permiso";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <BaseFormLayout title={title}>

      <BaseFormSection>

        <BaseFormField>
          <BaseInputField
            label="Nombre del Rol"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
          />
          {errors.nombre && (
            <FormHelperText error>{errors.nombre}</FormHelperText>
          )}
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
          />
          {errors.descripcion && (
            <FormHelperText error>{errors.descripcion}</FormHelperText>
          )}
        </BaseFormField>

      </BaseFormSection>

      <PermisosSelector
        permisosDisponibles={permisosDisponibles}
        value={formData.permisos}
        onChange={(permisos) =>
          setFormData((prev) => ({ ...prev, permisos }))
        }
        error={errors.permisos}
        disabled={isView}
      />

      {!isView && (
        <BaseFormActions
          onCancel={onCancel}
          onSave={handleSubmit}
          showSave
        />
      )}

    </BaseFormLayout>
  );
}
