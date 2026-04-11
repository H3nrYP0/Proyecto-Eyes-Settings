import { useState, useEffect } from "react";
import { FormHelperText, Box, Chip } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import esLocale from "date-fns/locale/es";

import BaseFormLayout from "@shared/components/base/BaseFormLayout";
import BaseFormSection from "@shared/components/base/BaseFormSection";
import BaseFormField from "@shared/components/base/BaseFormField";
import BaseFormActions from "@shared/components/base/BaseFormActions";
import BaseInputField from "@shared/components/base/BaseInputField";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import { metodoPagoOptions, formatPrice } from "../utils/citasUtils";

export default function CitaForm({
  mode = "create",
  title,
  onSubmit,
  onCancel,
  onEdit,
  clientes = [],
  servicios = [],
  empleados = [],
  estadosCita = [],
  diasActivos = [],
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
  // Nuevas props desde useCitaForm
  duracionActual,
  getClientesActivos,
  getServiciosActivos,
  getEmpleadosActivos,
  horaInvalida,
  getHoraErrorMessage,
  shouldDisableDate,
  shouldDisableTime,
}) {
  const isView = mode === "view";
  const isDisabled = isView || submitting;

  const [errorNotification, setErrorNotification] = useState({ visible: false, message: "" });
  const [successNotification, setSuccessNotification] = useState({ visible: false, message: "" });

  useEffect(() => {
    if (errors.general) {
      setErrorNotification({ visible: true, message: errors.general });
    } else {
      setErrorNotification({ visible: false, message: "" });
    }
  }, [errors.general]);

  useEffect(() => {
    if (!verificando && disponibilidad && disponibilidad.disponible) {
      setSuccessNotification({ visible: true, message: "✓ Horario disponible" });
    } else {
      setSuccessNotification({ visible: false, message: "" });
    }
  }, [verificando, disponibilidad]);

  const closeErrorNotification = () => setErrorNotification({ visible: false, message: "" });
  const closeSuccessNotification = () => setSuccessNotification({ visible: false, message: "" });

  const getPickerDate = () => {
    if (!formData.fecha) return null;
    if (formData.fecha instanceof Date) return formData.fecha;
    return null;
  };

  const servicioSeleccionado = servicios.find(s => s.id === parseInt(formData.servicio_id));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Cita">
          <Box sx={{ minHeight: 70, mb: 2 }}>
            <CrudNotification message={successNotification.message} type="success" isVisible={successNotification.visible} onClose={closeSuccessNotification} />
            <CrudNotification message={errorNotification.message} type="error" isVisible={errorNotification.visible} onClose={closeErrorNotification} />
          </Box>

          {/* Mostrar error de disponibilidad si existe */}
          {errorDisponibilidad && (
            <Box sx={{ mb: 2 }}>
              <CrudNotification
                message={errorDisponibilidad}
                type="error"
                isVisible={true}
                onClose={() => {}}
              />
            </Box>
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
              options={[{ value: "", label: "-- Seleccione --" }, ...getClientesActivos().map(c => ({ value: c.id, label: `${c.nombre} ${c.apellido || ""}` }))]}
              required error={!!errors.cliente_id} helperText={errors.cliente_id}
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
              options={[{ value: "", label: "-- Seleccione --" }, ...getServiciosActivos().map(s => ({ value: s.id, label: `${s.nombre}` }))]}
              required error={!!errors.servicio_id} helperText={errors.servicio_id}
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
              options={[{ value: "", label: "-- Seleccione --" }, ...getEmpleadosActivos().map(e => ({ value: e.id, label: e.nombre }))]}
              required error={!!errors.empleado_id} helperText={errors.empleado_id}
            />
          </BaseFormField>

          {/* Estado */}
          {mode !== "create" && (
            <BaseFormField>
              <BaseInputField
                label="Estado"
                name="estado_cita_id"
                select
                value={formData.estado_cita_id}
                onChange={handleChange}
                disabled={isDisabled}
                options={[{ value: "", label: "-- Seleccione --" }, ...estadosCita.map(e => ({ value: e.id, label: e.nombre }))]}
                required error={!!errors.estado_cita_id} helperText={errors.estado_cita_id}
              />
            </BaseFormField>
          )}

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
              required error={!!errors.metodo_pago} helperText={errors.metodo_pago}
            />
          </BaseFormField>

          {/* Duración */}
          <BaseFormField>
            <BaseInputField
              label="Duración (minutos)"
              name="duracion"
              type="number"
              value={duracionActual === null ? "" : duracionActual}
              disabled={true}
              required
            />
            <FormHelperText error>
              {servicioSeleccionado ? `` : "Seleccione un servicio"}
            </FormHelperText>
          </BaseFormField>

          {/* Precio del servicio */}
          <BaseFormField>
            <BaseInputField
              label="Precio"
              value={servicioSeleccionado ? formatPrice(servicioSeleccionado.precio) : "Seleccione un servicio"}
              disabled={true}
            />
            <FormHelperText>
              {servicioSeleccionado ? "Precio del servicio seleccionado" : "El precio se obtiene del servicio"}
            </FormHelperText>
          </BaseFormField>

          {/* Fecha */}
          <BaseFormField>
            <DatePicker
              label="Fecha"
              value={getPickerDate()}
              onChange={handleDateChange}
              disabled={isDisabled}
              shouldDisableDate={shouldDisableDate}
              slotProps={{ textField: { fullWidth: true, size: "small", error: !!errors.fecha, required: true } }}
            />
            <FormHelperText error>{errors.fecha || " "}</FormHelperText>
          </BaseFormField>

          {/* Hora */}
          <BaseFormField>
            <TimePicker
              label="Hora"
              value={formData.hora}
              onChange={handleTimeChange}
              disabled={isDisabled || (!isView && (!formData.fecha || !formData.servicio_id))}
              shouldDisableTime={shouldDisableTime}
              ampm={true}
              ampmInClock={true}
              slotProps={{ textField: { fullWidth: true, size: "small", error: !!errors.hora || horaInvalida, required: true } }}
            />
            <FormHelperText error>
              {errors.hora || getHoraErrorMessage() || (!formData.fecha && "Primero seleccione una fecha") || (!formData.servicio_id && "Primero seleccione un servicio") || " "}
            </FormHelperText>
          </BaseFormField>
        </BaseFormSection>

        <BaseFormActions
          onCancel={onCancel}
          onSave={async () => {
            const result = await handleSubmit();
            if (result && result.success && onSubmit) onSubmit(result.data);
          }}
          onEdit={onEdit}
          showSave={mode !== "view"}
          showEdit={mode === "view"}
          saveDisabled={submitting || verificando || (disponibilidad && !disponibilidad.disponible) || horaInvalida || !formData.hora || !formData.fecha || !formData.empleado_id || !formData.servicio_id}
          saveLabel={submitting ? "Guardando..." : "Guardar"}
        />
      </BaseFormLayout>
    </LocalizationProvider>
  );
}