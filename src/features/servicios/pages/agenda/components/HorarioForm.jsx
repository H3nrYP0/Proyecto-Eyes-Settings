import { useState, useEffect } from "react";
import { Grid } from "@mui/material";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

// Mapeo de días (0 = lunes, 1 = martes, ... 6 = domingo)
const diasSemana = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" },
];

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
        hora_inicio: initialData.hora_inicio?.substring(0,5) || "",
        hora_final: initialData.hora_final?.substring(0,5) || "",
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
              <BaseInputField
                label="Empleado"
                name="empleado_id"
                select
                value={formData.empleado_id}
                onChange={handleChange}
                disabled={isView}
                options={[
                  { value: "", label: "-- Seleccione empleado --" },
                  ...empleados.map((emp) => ({
                    value: emp.id,
                    label: emp.nombre,
                  })),
                ]}
                required
                error={!!errors.empleado_id}
                helperText={errors.empleado_id}
              />
            </BaseFormField>
          </Grid>

          {/* Día */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Día de la semana"
                name="dia"
                select
                value={formData.dia}
                onChange={handleChange}
                disabled={isView}
                options={[
                  { value: "", label: "-- Seleccione día --" },
                  ...diasSemana.map((dia) => ({
                    value: dia.value,
                    label: dia.label,
                  })),
                ]}
                required
                error={!!errors.dia}
                helperText={errors.dia}
              />
            </BaseFormField>
          </Grid>

          {/* Hora inicio */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Hora Inicio"
                name="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={handleChange}
                disabled={isView}
                required
                error={!!errors.hora_inicio}
                helperText={errors.hora_inicio}
                InputLabelProps={{ shrink: true }}
              />
            </BaseFormField>
          </Grid>

          {/* Hora final */}
          <Grid item xs={12} md={6}>
            <BaseFormField>
              <BaseInputField
                label="Hora Final"
                name="hora_final"
                type="time"
                value={formData.hora_final}
                onChange={handleChange}
                disabled={isView}
                required
                error={!!errors.hora_final}
                helperText={errors.hora_final}
                InputLabelProps={{ shrink: true }}
              />
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