import { useState, useEffect, forwardRef } from "react";
import { Grid, FormHelperText, Box } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

// ============================================
// 1. CONSTANTES
// ============================================
const diasSemana = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" },
];

// ============================================
// 2. COMPONENTE PRINCIPAL
// ============================================
const HorarioForm = forwardRef(({
  mode = "create",
  initialData,
  empleados = [],
  onSubmit,
  onCancel,
  embedded = false,
}, ref) => {
  // ============================================
  // 3. ESTADOS
  // ============================================
  const isView = mode === "view";
  
  const [formData, setFormData] = useState({
    empleado_id: "",
    dia: "",
    hora_inicio: "",
    hora_final: "",
  });

  const [errors, setErrors] = useState({});

  // ============================================
  // 4. EFECTOS
  // ============================================
  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || "",
        dia: initialData.dia ?? "",
        hora_inicio: initialData.hora_inicio?.substring(0,5) || "",
        hora_final: initialData.hora_final?.substring(0,5) || "",
      });
    }
  }, [initialData]);

  // ============================================
  // 5. FUNCIONES AUXILIARES
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ============================================
  // 6. VALIDACIÓN
  // ============================================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.empleado_id) {
      newErrors.empleado_id = "Debe seleccionar un empleado";
    }

    if (formData.dia === "") {
      newErrors.dia = "Debe seleccionar un día";
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Debe ingresar hora de inicio";
    }

    if (!formData.hora_final) {
      newErrors.hora_final = "Debe ingresar hora final";
    }

    if (
      formData.hora_inicio &&
      formData.hora_final &&
      formData.hora_final <= formData.hora_inicio
    ) {
      newErrors.hora_final =
        "La hora final debe ser mayor que la hora de inicio";
    }

    return newErrors;
  };

  // ============================================
  // 7. SUBMIT
  // ============================================
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (isView) {
      // En modo vista, si hay onSubmit lo llamamos, si no, no hacemos nada
      if (onSubmit) onSubmit(formData);
      return;
    }

    const newErrors = validateForm();

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.({
      ...formData,
      empleado_id: Number(formData.empleado_id),
      dia: Number(formData.dia),
    });
  };

  // ============================================
  // 8. OPCIONES PARA SELECTS
  // ============================================
  const empleadoOptions = [
    { value: "", label: "-- Seleccione empleado --" },
    ...empleados.map((emp) => ({
      value: emp.id,
      label: emp.nombre,
    })),
  ];

  const diaOptions = [
    { value: "", label: "-- Seleccione día --" },
    ...diasSemana,
  ];

  // ============================================
  // 9. RENDER
  // ============================================
  return (
    <form id="horario-form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Empleado */}
        <Box>
          <BaseInputField
            label="Empleado"
            name="empleado_id"
            select
            value={formData.empleado_id}
            onChange={handleChange}
            disabled={isView}
            options={empleadoOptions}
            required
            error={!!errors.empleado_id}
            fullWidth
          />
          {errors.empleado_id && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.empleado_id}</FormHelperText>
          )}
        </Box>

        {/* Día */}
        <Box>
          <BaseInputField
            label="Día de la semana"
            name="dia"
            select
            value={formData.dia}
            onChange={handleChange}
            disabled={isView}
            options={diaOptions}
            required
            error={!!errors.dia}
            fullWidth
          />
          {errors.dia && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.dia}</FormHelperText>
          )}
        </Box>

        {/* Hora inicio */}
        <Box>
          <BaseInputField
            label="Hora Inicio"
            name="hora_inicio"
            type="time"
            value={formData.hora_inicio}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.hora_inicio}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {errors.hora_inicio && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.hora_inicio}</FormHelperText>
          )}
        </Box>

        {/* Hora final */}
        <Box>
          <BaseInputField
            label="Hora Final"
            name="hora_final"
            type="time"
            value={formData.hora_final}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.hora_final}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {errors.hora_final && (
            <FormHelperText error sx={{ mt: 1 }}>{errors.hora_final}</FormHelperText>
          )}
        </Box>
      </Box>
    </form>
  );
});

export default HorarioForm;