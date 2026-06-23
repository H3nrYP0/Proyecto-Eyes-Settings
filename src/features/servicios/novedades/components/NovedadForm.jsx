import { useState, useEffect } from "react";
import { FormHelperText, Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import esLocale from "date-fns/locale/es";
import BaseInputField from "@shared/components/base/BaseInputField";
import BaseFormField from "@shared/components/base/BaseFormField";
import { tiposNovedad } from "../utils/novedadesUtils";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

export default function NovedadForm({
  mode = "create",
  empleados = [],
  id,
  formData,
  errors,
  submitting,
  handleChange,
  handleSubmit,
  submitError,
}) {
  const isView = mode === "view";
  const isDisabled = isView || submitting;

  const onSubmitForm = async (e) => {
    if (e) e.preventDefault();
    await handleSubmit();
  };

  const empleadoOptions = [
    { value: "", label: "Seleccionar empleado" }, // 🔥 Texto más corto
    ...empleados.map((emp) => ({ value: emp.id, label: emp.nombre })),
  ];

  const estadoOptions = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];

  const estadoValue = formData.activo ? "activo" : "inactivo";

  const handleEstadoChange = (e) => {
    const nuevoEstado = e.target.value === "activo";
    handleChange({ target: { name: "activo", value: nuevoEstado } });
  };

  const getDateFromString = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const formatDateToString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTimeFromString = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const formatTimeToString = (date) => {
    if (!date) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (name, date) => {
    handleChange({ target: { name, value: formatDateToString(date) } });
  };

  const handleTimeChange = (name, time) => {
    handleChange({ target: { name, value: formatTimeToString(time) } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <form id={id} onSubmit={onSubmitForm} style={{ width: '100%' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          width: '100%',
          maxHeight: 'calc(70vh - 120px)',
          overflowY: 'auto',
          paddingRight: '5px',
        }}>
          {submitError && (
            <CrudNotification
              message={submitError}
              type="error"
              isVisible={true}
              onClose={() => {}}
            />
          )}
          <Box sx={{ height: 16 }} />
          {/* Empleado */}
          <BaseFormField >
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

          {/* Tipo */}
          <BaseFormField>
            <BaseInputField
              label="Tipo de novedad"
              name="tipo"
              select
              value={formData.tipo}
              onChange={handleChange}
              disabled={isDisabled}
              options={[{ value: "", label: "Seleccionar tipo" }, ...tiposNovedad]} // 🔥 Texto más corto
              required
              error={!!errors.tipo}
              fullWidth
            />
            {errors.tipo && <FormHelperText error>{errors.tipo}</FormHelperText>}
          </BaseFormField>

          {/* Fecha Inicio */}
          <BaseFormField>
            <DatePicker
              label="Fecha Inicio" // 🔥 Quitamos el "*" manual
              value={getDateFromString(formData.fecha_inicio)}
              onChange={(date) => handleDateChange("fecha_inicio", date)}
              disabled={isDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.fecha_inicio,
                  required: true, // MUI añadirá el asterisco automáticamente
                }
              }}
            />
            {errors.fecha_inicio && <FormHelperText error>{errors.fecha_inicio}</FormHelperText>}
          </BaseFormField>

          {/* Fecha Fin */}
          <BaseFormField>
            <DatePicker
              label="Fecha Fin" // 🔥 Quitamos el "*" manual
              value={getDateFromString(formData.fecha_fin)}
              onChange={(date) => handleDateChange("fecha_fin", date)}
              disabled={isDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.fecha_fin,
                  required: true, // MUI añadirá el asterisco automáticamente
                }
              }}
            />
            {errors.fecha_fin && <FormHelperText error>{errors.fecha_fin}</FormHelperText>}
          </BaseFormField>

          {/* Hora Inicio */}
          <BaseFormField>
            <TimePicker
              label="Hora Inicio (opcional)"
              value={getTimeFromString(formData.hora_inicio)}
              onChange={(time) => handleTimeChange("hora_inicio", time)}
              disabled={isDisabled}
              ampm={true}
              ampmInClock={true}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.hora_inicio,
                }
              }}
            />
            {errors.hora_inicio && <FormHelperText error>{errors.hora_inicio}</FormHelperText>}
          </BaseFormField>

          {/* Hora Fin */}
          <BaseFormField>
            <TimePicker
              label="Hora Fin (opcional)"
              value={getTimeFromString(formData.hora_fin)}
              onChange={(time) => handleTimeChange("hora_fin", time)}
              disabled={isDisabled}
              ampm={true}
              ampmInClock={true}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.hora_fin,
                }
              }}
            />
            {errors.hora_fin && <FormHelperText error>{errors.hora_fin}</FormHelperText>}
          </BaseFormField>

          {/* Motivo */}
          <BaseFormField>
            <BaseInputField
              label="Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              disabled={isDisabled}
              fullWidth
              multiline
              rows={2}
            />
          </BaseFormField>

          {/* Estado */}
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