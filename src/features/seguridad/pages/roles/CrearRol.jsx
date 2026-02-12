// ============================
// IMPORTS
// ============================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Chip,
  Button
} from "@mui/material";

import { createRol } from "../../../../lib/data/rolesData";

import BaseFormLayout from "../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../shared/components/base/BaseInputField";

// ============================
// COMPONENT
// ============================

export default function CrearRol() {

  // ============================
  // DATA
  // ============================

  const navigate = useNavigate();

  const permisosDisponibles = [
    { id: "dashboard", nombre: "Gestionar Dashboard" },
    { id: "categorias", nombre: "Gestionar Categorías" },
    { id: "compras", nombre: "Gestionar Compras" },
    { id: "empleados", nombre: "Gestionar Empleados" },
    { id: "ventas", nombre: "Gestionar Ventas" },
    { id: "roles", nombre: "Gestionar Roles" },
    { id: "productos", nombre: "Gestionar Productos" },
    { id: "servicios", nombre: "Gestionar Servicios" },
    { id: "clientes", nombre: "Gestionar Clientes" },
    { id: "campanas_salud", nombre: "Gestionar Campañas de Salud" },
    { id: "usuarios", nombre: "Gestionar Usuarios" },
    { id: "proveedores", nombre: "Gestionar Proveedores" },
    { id: "agenda", nombre: "Gestionar Agenda" },
    { id: "pedidos", nombre: "Gestionar Pedidos" }
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
    permisos: []
  });

  const [errors, setErrors] = useState({});
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);

  // ============================
  // HANDLERS
  // ============================

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

  const handlePermisoChange = (permisoId) => {
    setFormData((prev) => {
      const existe = prev.permisos.includes(permisoId);

      const nuevosPermisos = existe
        ? prev.permisos.filter((id) => id !== permisoId)
        : [...prev.permisos, permisoId];

      setTodosSeleccionados(
        nuevosPermisos.length === permisosDisponibles.length
      );

      return {
        ...prev,
        permisos: nuevosPermisos
      };
    });

    if (errors.permisos) {
      setErrors((prev) => ({
        ...prev,
        permisos: ""
      }));
    }
  };

  const toggleSeleccionarTodos = () => {
    if (todosSeleccionados) {
      setFormData((prev) => ({
        ...prev,
        permisos: []
      }));
      setTodosSeleccionados(false);
    } else {
      const todosIds = permisosDisponibles.map((p) => p.id);
      setFormData((prev) => ({
        ...prev,
        permisos: todosIds
      }));
      setTodosSeleccionados(true);
    }

    if (errors.permisos) {
      setErrors((prev) => ({
        ...prev,
        permisos: ""
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

    createRol(formData);
    navigate("/admin/seguridad/roles");
  };

  // ============================
  // RENDER
  // ============================

  return (
    <BaseFormLayout title="Crear Nuevo Rol">

      <BaseFormSection>

        <BaseFormField>
          <BaseInputField
            label="Nombre del Rol"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
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
          />
          {errors.descripcion && (
            <FormHelperText error>{errors.descripcion}</FormHelperText>
          )}
        </BaseFormField>

      </BaseFormSection>

      {/* Sección Permisos */}
      <Box>

        <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2
  }}
>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Permisos
          </Typography>

          <Chip
            label={`${formData.permisos.length} de ${permisosDisponibles.length}`}
            size="small"
          />
        </Box>

        <Button
          variant="text"
          size="small"
          onClick={toggleSeleccionarTodos}
        >
          {todosSeleccionados ? "Deseleccionar todos" : "Seleccionar todos"}
        </Button>
      </Box>

        <Grid container spacing={2}>
          {permisosDisponibles.map((permiso) => (
            <Grid item xs={12} sm={6} md={4} key={permiso.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permisos.includes(permiso.id)}
                    onChange={() => handlePermisoChange(permiso.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    {permiso.nombre}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>

        {errors.permisos && (
          <FormHelperText error sx={{ mt: 1 }}>
            {errors.permisos}
          </FormHelperText>
        )}
      </Box>

      <BaseFormActions
        onCancel={() => navigate("/admin/seguridad/roles")}
        onSave={handleSubmit}
        showSave
      />

    </BaseFormLayout>
  );
}
