import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { BaseInputField, BaseFormLayout, BaseFormActions, FormRow, FormCol } from "@shared";

import PermisosSelector from "./PermisosSelector";

export default function RolForm({
  mode = "create",
  title,
  initialData,
  permisosDisponibles = [],
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",  // Siempre activo por defecto en creación
    permisos: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const estadoStr = initialData.estado === true ? "activo" : "inactivo";
      const permisosIds = Array.isArray(initialData.permisos)
        ? initialData.permisos.map(p => p.id || p)
        : [];

      setFormData({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: estadoStr,
        permisos: permisosIds
      });
    }
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
    onSubmit?.(formData);
  };

  return (
    <BaseFormLayout title={title}>
      <FormRow>
        <FormCol>
          <BaseInputField
            label="Nombre del Rol"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </FormCol>

        <FormCol>
          <BaseInputField
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        </FormCol>

        {/* Campo de Estado - SOLO visible en modo edición */}
        {isEdit && (
          <FormCol>
            <BaseInputField
              label="Estado"
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
          </FormCol>
        )}
      </FormRow>

      <FormRow>
        <FormCol>
          <PermisosSelector
            permisosDisponibles={permisosDisponibles}
            value={formData.permisos}
            onChange={(permisos) => setFormData((prev) => ({ ...prev, permisos }))}
            error={errors.permisos}
            disabled={isView}
          />
        </FormCol>
      </FormRow>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
      />
    </BaseFormLayout>
  );
}