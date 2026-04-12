import { FormHelperText, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import esLocale from "date-fns/locale/es";
import BaseInputField from "../../../../shared/components/base/BaseInputField";
import BaseFormField from "../../../../shared/components/base/BaseFormField";
import { diasSemanaOptions } from "../utils/horariosUtils";
import { useEffect } from "react";

export default function HorarioForm({
  mode = "create",
  initialData,
  empleados = [],
  id,
  formData,
  errors,
  submitting,
  handleChange,
  handleSubmit,
  resetForm,
}) {
  const isView = mode === "view";
  const isDisabled = isView || submitting;

  // Limpiar formulario al abrir en modo crear
  useEffect(() => {
    if (mode === "create" && resetForm) {
      resetForm();
    }
  }, [mode, resetForm]);

  const onSubmitForm = async (e) => {
    if (e) e.preventDefault();
    await handleSubmit();
  };

  const empleadoOptions = [
    { value: "", label: "-- Seleccione empleado --" },
    ...empleados.map((emp) => ({ value: emp.id, label: emp.nombre })),
  ];

  const diaOptions = [
    { value: "", label: "-- Seleccione día --" },
    ...diasSemanaOptions,
  ];

  // Opciones para el estado (activo/inactivo)
  const estadoOptions = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const estadoValue = formData.activo ? "activo" : "inactivo";

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value === "activo";
    handleChange({ target: { name: "activo", value: nuevoEstado } });
  };

  // Convertir string "HH:MM" a objeto Date para TimePicker
  const getTimeFromString = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  // Convertir objeto Date a string "HH:MM"
  const formatTimeToString = (date) => {
    if (!date) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Handler para TimePicker
  const handleTimeChange = (name, time) => {
    handleChange({ target: { name, value: formatTimeToString(time) } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <form id={id} onSubmit={onSubmitForm}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Empleado */}
          <BaseFormField>
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
            {errors.empleado_id && <FormHelperText error>{errors.empleado_id}</FormHelperText>}
          </BaseFormField>

          {/* Día de la semana */}
          <BaseFormField>
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
            {errors.dia && <FormHelperText error>{errors.dia}</FormHelperText>}
          </BaseFormField>

          {/* Hora Inicio */}
          <BaseFormField>
            <TimePicker
              label="Hora Inicio"
              value={getTimeFromString(formData.hora_inicio)}
              onChange={(time) => handleTimeChange("hora_inicio", time)}
              disabled={isDisabled}
              ampm={true}
              ampmInClock={true}
              slotProps={{ textField: { fullWidth: true, size: "small", error: !!errors.hora_inicio, required: true } }}
            />
            <FormHelperText error>{errors.hora_inicio || " "}</FormHelperText>
          </BaseFormField>

          {/* Hora Final */}
          <BaseFormField>
            <TimePicker
              label="Hora Final"
              value={getTimeFromString(formData.hora_final)}
              onChange={(time) => handleTimeChange("hora_final", time)}
              disabled={isDisabled}
              ampm={true}
              ampmInClock={true}
              slotProps={{ textField: { fullWidth: true, size: "small", error: !!errors.hora_final, required: true } }}
            />
            <FormHelperText error>{errors.hora_final || " "}</FormHelperText>
          </BaseFormField>

          {/* Estado (solo en edición o vista) */}
          {mode !== "create" && (
            <BaseFormField>
              <BaseInputField
                label="Estado"
                name="estado"
                select
                value={estadoValue}
                onChange={handleEstadoChange}
                disabled={isDisabled}
                options={estadoOptions}
                required
                fullWidth
              />
            </BaseFormField>
          )}
        </Box>
      </form>
    </LocalizationProvider>
  );
}