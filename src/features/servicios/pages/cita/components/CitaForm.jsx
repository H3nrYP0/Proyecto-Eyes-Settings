import { FormHelperText, Alert } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import esLocale from "date-fns/locale/es";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";
import { metodoPagoOptions } from "../utils/citasUtils";

export default function CitaForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
  clientes = [],
  servicios = [],
  empleados = [],
  estadosCita = [],
  formData,
  errors,
  submitting,
  verificando,
  disponibilidad,
  errorDisponibilidad,
  handleChange,
  handleDateChange,
  handleTimeChange,
  handleSubmit,
}) {
  const isView = mode === "view";

  const onSubmitForm = async () => {
    const result = await handleSubmit();
    if (result.success && onSubmit) {
      onSubmit(result.data);
    }
  };

  const isDisabled = isView || submitting;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Cita">
          
          {/* Error general */}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          {/* Mensaje de verificación */}
          {verificando && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Verificando disponibilidad...
            </Alert>
          )}
          
          {/* Mensaje de disponibilidad exitosa */}
          {!verificando && disponibilidad && disponibilidad.disponible && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✓ Horario disponible {disponibilidad.horario && 
                `(${disponibilidad.horario.inicio} - ${disponibilidad.horario.fin})`}
            </Alert>
          )}

          {/* Cliente */}
          <BaseFormField>
            <BaseInputField
              label="Cliente"
              name="cliente_id"
              select
              value={formData.cliente_id}
              onChange={handleChange}
              disabled={isDisabled}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...clientes.map((c) => ({
                  value: c.id,
                  label: `${c.nombre} ${c.apellido || ""}`,
                })),
              ]}
              required
              error={!!errors.cliente_id}
              helperText={errors.cliente_id}
            />
          </BaseFormField>

          {/* Servicio */}
          <BaseFormField>
            <BaseInputField
              label="Servicio"
              name="servicio_id"
              select
              value={formData.servicio_id}
              onChange={handleChange}
              disabled={isDisabled}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...servicios.map((s) => ({
                  value: s.id,
                  label: s.nombre,
                })),
              ]}
              required
              error={!!errors.servicio_id}
              helperText={errors.servicio_id}
            />
          </BaseFormField>

          {/* Empleado */}
          <BaseFormField>
            <BaseInputField
              label="Empleado"
              name="empleado_id"
              select
              value={formData.empleado_id}
              onChange={handleChange}
              disabled={isDisabled}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...empleados
                  .filter(e => e.estado === "activo" || e.estado === true)
                  .map((e) => ({
                    value: e.id,
                    label: e.nombre,
                  })),
              ]}
              required
              error={!!errors.empleado_id}
              helperText={errors.empleado_id}
            />
          </BaseFormField>

          {/* Estado */}
          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado_cita_id"
              select
              value={formData.estado_cita_id}
              onChange={handleChange}
              disabled={isDisabled}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...estadosCita.map((e) => ({
                  value: e.id,
                  label: e.nombre,
                })),
              ]}
              required
              error={!!errors.estado_cita_id}
              helperText={errors.estado_cita_id}
            />
          </BaseFormField>

          {/* Método de Pago */}
          <BaseFormField>
            <BaseInputField
              label="Método de Pago"
              name="metodo_pago"
              select
              value={formData.metodo_pago}
              onChange={handleChange}
              disabled={isDisabled}
              options={metodoPagoOptions}
              required
              error={!!errors.metodo_pago}
              helperText={errors.metodo_pago}
            />
          </BaseFormField>

          {/* Duración */}
          <BaseFormField>
            <BaseInputField
              label="Duración (minutos)"
              name="duracion"
              type="number"
              value={formData.duracion}
              onChange={handleChange}
              disabled={isDisabled}
              required
              error={!!errors.duracion}
              helperText={errors.duracion}
              inputProps={{ min: 15, max: 180, step: 5 }}
            />
          </BaseFormField>

          {/* Fecha */}
          <BaseFormField>
            <DatePicker
              label="Fecha"
              value={formData.fecha}
              onChange={handleDateChange}
              disabled={isDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.fecha,
                  required: true,
                },
              }}
            />
            <FormHelperText error>
              {errors.fecha || " "}
            </FormHelperText>
          </BaseFormField>

          {/* Hora */}
          <BaseFormField>
            <TimePicker
              label="Hora"
              value={formData.hora}
              onChange={handleTimeChange}
              disabled={isDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.hora,
                  required: true,
                },
              }}
            />
            <FormHelperText error>
              {errors.hora || " "}
            </FormHelperText>
          </BaseFormField>

        </BaseFormSection>

        <BaseFormActions
          onCancel={onCancel}
          onSave={onSubmitForm}
          onEdit={onEdit}
          showSave={mode !== "view"}
          showEdit={mode === "view"}
          saveDisabled={submitting || verificando || (disponibilidad && !disponibilidad.disponible)}
          saveLabel={submitting ? "Guardando..." : "Guardar"}
        />
      </BaseFormLayout>
    </LocalizationProvider>
  );
}