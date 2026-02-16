import { useState, useEffect } from "react";
import { Grid, MenuItem, TextField, FormHelperText } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";

export default function HorarioForm({
  mode = "create",
  title,
  initialData,
  empleados = [],
  onSubmit,
  onCancel,
  onEdit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    empleado_id: "",
    dia: "",
    hora_inicio: "",
    hora_final: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || "",
        dia: initialData.dia ?? "",
        hora_inicio: initialData.hora_inicio || "",
        hora_final: initialData.hora_final || "",
      });
    }
  }, [initialData]);

  const diasSemana = [
    { value: 0, label: "Lunes" },
    { value: 1, label: "Martes" },
    { value: 2, label: "Miércoles" },
    { value: 3, label: "Jueves" },
    { value: 4, label: "Viernes" },
    { value: 5, label: "Sábado" },
    { value: 6, label: "Domingo" },
  ];

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

    if (!formData.empleado_id) {
      newErrors.empleado_id = "Debe seleccionar un empleado";
    }

    if (formData.dia === "") {
      newErrors.dia = "Debe seleccionar un día";
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Debe ingresar hora inicio";
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
        "La hora final debe ser mayor que la hora inicio";
    }

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

  return (
    <BaseFormLayout title={title}>
      <BaseFormSection title="Información del Horario">
        <Grid container spacing={3}>

          {/* Empleado */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                select
                fullWidth
                label="Empleado*"
                name="empleado_id"
                value={formData.empleado_id}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                error={!!errors.empleado_id}
              >
                <MenuItem value="">Seleccionar empleado</MenuItem>
                {empleados.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText error>
                {errors.empleado_id || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Día */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                select
                fullWidth
                label="Día de la semana*"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                error={!!errors.dia}
              >
                <MenuItem value="">Seleccionar día</MenuItem>
                {diasSemana.map((dia) => (
                  <MenuItem key={dia.value} value={dia.value}>
                    {dia.label}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText error>
                {errors.dia || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Hora inicio */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                fullWidth
                label="Hora Inicio*"
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.hora_inicio}
              />
              <FormHelperText error>
                {errors.hora_inicio || " "}
              </FormHelperText>
            </BaseFormField>
          </Grid>

          {/* Hora final */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <TextField
                fullWidth
                label="Hora Final*"
                type="time"
                name="hora_final"
                value={formData.hora_final}
                onChange={handleChange}
                disabled={isView}
                size="small"
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.hora_final}
              />
              <FormHelperText error>
                {errors.hora_final || " "}
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
