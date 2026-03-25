import { FormHelperText, Box } from "@mui/material";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import { diasSemanaOptions } from "../utils/horariosUtils";

export default function HorarioForm({
  mode = "create",
  initialData,
  empleados = [],
  onSubmit,
  onCancel,
  id,
  formData,
  errors,
  submitting,
  handleChange,
  handleSubmit,
}) {
  const isView = mode === "view";
  const isDisabled = isView || submitting;

  const onSubmitForm = async (e) => {
    if (e) e.preventDefault();
    const result = await handleSubmit();
    if (result.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  const empleadoOptions = [
    { value: "", label: "-- Seleccione empleado --" },
    ...empleados.map((emp) => ({
      value: emp.id,
      label: emp.nombre,
    })),
  ];

  const diaOptions = [
    { value: "", label: "-- Seleccione día --" },
    ...diasSemanaOptions,
  ];

  return (
    <form id={id} onSubmit={onSubmitForm}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Empleado */}
        <Box>
          <BaseInputField
            label="Empleado"
            name="empleado_id"
            select
            value={formData.empleado_id}
            onChange={handleChange}
            disabled={isDisabled}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
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
}