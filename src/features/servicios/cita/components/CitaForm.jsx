import { useState, useEffect, useMemo } from "react";
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

import { metodoPagoOptions, getBackendDay } from "../utils/citasUtils";

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
  getHorarioDelDia,
}) {
  const isView = mode === "view";
  const isDisabled = isView || submitting;

  const [errorNotification, setErrorNotification] = useState({ visible: false, message: "" });
  const [successNotification, setSuccessNotification] = useState({ visible: false, message: "" });
  const [horaInvalida, setHoraInvalida] = useState(false);

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

  // Filtros
  const getClientesActivos = () => clientes.filter(c => c.estado === true || c.estado === "activo");
  const getServiciosActivos = () => servicios.filter(s => s.estado === true);
  const getEmpleadosActivos = () => empleados.filter(e => e.estado === true || e.estado === "activo");

  // Obtener duración del servicio seleccionado (sin valor por defecto)
  const duracionActual = useMemo(() => {
    if (!formData.servicio_id) return null;
    const servicio = servicios.find(s => s.id === parseInt(formData.servicio_id));
    return servicio?.duracion_min || null;
  }, [formData.servicio_id, servicios]);

  // Verificar si la hora seleccionada permite completar el servicio
  const validarHoraCompletaServicio = (horaSeleccionada) => {
    if (!formData.fecha || !formData.empleado_id || !horaSeleccionada || !duracionActual) return false;
    
    const horarioDia = getHorarioDelDia ? getHorarioDelDia() : null;
    if (!horarioDia) return false;
    
    const horaFin = horarioDia.hora_final;
    if (!horaFin) return false;
    
    const [finH, finM] = horaFin.split(':').map(Number);
    
    let horas, minutos;
    if (horaSeleccionada instanceof Date) {
      horas = horaSeleccionada.getHours();
      minutos = horaSeleccionada.getMinutes();
    } else {
      return false;
    }
    
    // Calcular hora de finalización del servicio
    let minutosFinServicio = minutos + duracionActual;
    let horasFinServicio = horas;
    while (minutosFinServicio >= 60) {
      minutosFinServicio -= 60;
      horasFinServicio++;
    }
    
    const minutosTotalesFinServicio = horasFinServicio * 60 + minutosFinServicio;
    const minutosTotalesFinJornada = finH * 60 + finM;
    
    return minutosTotalesFinServicio <= minutosTotalesFinJornada;
  };

  // Verificar si la hora está dentro del rango laboral
  const validarHoraEnRango = (horaSeleccionada) => {
    if (!formData.fecha || !formData.empleado_id || !horaSeleccionada) return false;
    
    const horarioDia = getHorarioDelDia ? getHorarioDelDia() : null;
    if (!horarioDia) return false;
    
    const horaInicio = horarioDia.hora_inicio;
    const horaFin = horarioDia.hora_final;
    
    if (!horaInicio || !horaFin) return false;
    
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
    
    let horas, minutos;
    if (horaSeleccionada instanceof Date) {
      horas = horaSeleccionada.getHours();
      minutos = horaSeleccionada.getMinutes();
    } else {
      return false;
    }
    
    const minutosSeleccionados = horas * 60 + minutos;
    const minutosInicio = inicioH * 60 + inicioM;
    const minutosFin = finH * 60 + finM;
    
    return minutosSeleccionados >= minutosInicio && minutosSeleccionados < minutosFin;
  };

  // Verificar si la hora es anterior a la actual (si es hoy)
  const validarHoraNoAnterior = (horaSeleccionada) => {
    if (!formData.fecha || !horaSeleccionada) return true;
    
    const hoy = new Date();
    const fechaSeleccionada = new Date(formData.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    
    const esHoy = fechaSeleccionada.getTime() === hoy.getTime();
    
    if (esHoy && horaSeleccionada instanceof Date) {
      const ahora = new Date();
      const horaSeleccionadaMs = new Date(fechaSeleccionada);
      horaSeleccionadaMs.setHours(horaSeleccionada.getHours(), horaSeleccionada.getMinutes(), 0, 0);
      
      return horaSeleccionadaMs >= ahora;
    }
    
    return true;
  };

  // Validar hora completa
  const esHoraValida = useMemo(() => {
    if (!formData.hora) return false;
    const enRango = validarHoraEnRango(formData.hora);
    const noAnterior = validarHoraNoAnterior(formData.hora);
    const alcanzaServicio = validarHoraCompletaServicio(formData.hora);
    return enRango && noAnterior && alcanzaServicio;
  }, [formData.hora, formData.fecha, formData.empleado_id, duracionActual]);

  useEffect(() => {
    setHoraInvalida(formData.hora && !esHoraValida);
  }, [formData.hora, esHoraValida]);

  // Deshabilitar fechas
  const shouldDisableDate = (date) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(date);
    fechaComparar.setHours(0, 0, 0, 0);
    
    if (fechaComparar < hoy) return true;
    
    if (!formData.empleado_id) return false;
    if (!diasActivos || diasActivos.length === 0) return false;
    
    const backendDay = getBackendDay(date);
    const diaActivo = diasActivos.find(d => d.dia === backendDay);
    
    return !diaActivo;
  };

  // Deshabilitar horas según duración del servicio
  const shouldDisableTime = (timeValue) => {
    if (!formData.fecha || !formData.empleado_id) return true;

    const horaSeleccionada = timeValue.getHours();
    const minutoSeleccionado = timeValue.getMinutes();

    // Validar hora actual si es hoy
    const hoy = new Date();
    const fechaSeleccionada = new Date(formData.fecha);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    const esHoy = fechaSeleccionada.getTime() === hoy.getTime();
    if (esHoy) {
      const ahora = new Date();
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      if (horaSeleccionada < horaActual) return true;
      if (horaSeleccionada === horaActual && minutoSeleccionado < minutoActual) return true;
    }

    // Validar horario laboral
    const horarioDia = getHorarioDelDia ? getHorarioDelDia() : null;
    if (!horarioDia) return true;
    const horaInicio = horarioDia.hora_inicio;
    const horaFin = horarioDia.hora_final;
    if (!horaInicio || !horaFin) return true;

    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
    const minutosSeleccionados = horaSeleccionada * 60 + minutoSeleccionado;
    const minutosInicio = inicioH * 60 + inicioM;
    const minutosFin = finH * 60 + finM;

    // Fuera del horario laboral
    if (minutosSeleccionados < minutosInicio || minutosSeleccionados >= minutosFin) return true;

    // Validación por duración (solo si hay duración)
    if (duracionActual && duracionActual > 0) {
      const minutosDesdeInicio = minutosSeleccionados - minutosInicio;
      if (minutosDesdeInicio % duracionActual !== 0) {
        return true;
      }
    }

    // Verificar si alcanza a terminar el servicio
    if (duracionActual) {
      let minutosFinServicio = minutoSeleccionado + duracionActual;
      let horasFinServicio = horaSeleccionada;
      while (minutosFinServicio >= 60) {
        minutosFinServicio -= 60;
        horasFinServicio++;
      }
      const minutosTotalesFinServicio = horasFinServicio * 60 + minutosFinServicio;
      if (minutosTotalesFinServicio > minutosFin) return true;
    }

    return false;
  };

  const getPickerDate = () => {
    if (!formData.fecha) return null;
    if (formData.fecha instanceof Date) return formData.fecha;
    return null;
  };

  const isSaveDisabled = submitting || verificando || (disponibilidad && !disponibilidad.disponible) || horaInvalida || !formData.hora || !formData.fecha || !formData.empleado_id || !formData.servicio_id;

  const getHoraErrorMessage = () => {
    if (!formData.hora) return "";
    if (!validarHoraEnRango(formData.hora)) return "Hora fuera del horario laboral";
    if (duracionActual && !validarHoraCompletaServicio(formData.hora)) {
      return `⚠️ El servicio dura ${duracionActual} minutos. Debe terminar antes del fin de la jornada (${getHorarioDelDia?.()?.hora_final?.substring(0,5)}).`;
    }
    if (!validarHoraNoAnterior(formData.hora)) return "La hora no puede ser anterior a la hora actual";
    return "";
  };

  // Obtener nombre del servicio seleccionado
  const servicioSeleccionado = servicios.find(s => s.id === parseInt(formData.servicio_id));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Cita">
          <Box sx={{ minHeight: 70, mb: 2 }}>
            {/* SOLO CrudNotification - Eliminados los Alert */}
            <CrudNotification message={successNotification.message} type="success" isVisible={successNotification.visible} onClose={closeSuccessNotification} />
            <CrudNotification message={errorNotification.message} type="error" isVisible={errorNotification.visible} onClose={closeErrorNotification} />
          </Box>

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

          {/* Servicio - Con duración visible */}
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

          {/* Duración - Solo lectura, sin valor por defecto */}
          <BaseFormField>
            <BaseInputField
              label="Duración (minutos)"
              name="duracion"
              type="number"
              value={duracionActual === null ? "" : duracionActual}
              disabled={true}
              required
              helperText={servicioSeleccionado ? `` : "Seleccione un servicio para ver la duración"}
            />
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
              disabled={isDisabled || !formData.fecha || !formData.servicio_id}
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
            if (result.success && onSubmit) onSubmit(result.data);
          }}
          onEdit={onEdit}
          showSave={mode !== "view"}
          showEdit={mode === "view"}
          saveDisabled={isSaveDisabled}
          saveLabel={submitting ? "Guardando..." : "Guardar"}
        />
      </BaseFormLayout>
    </LocalizationProvider>
  );
}