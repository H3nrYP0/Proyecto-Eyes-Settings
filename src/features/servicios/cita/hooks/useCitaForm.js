import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createCita, updateCita } from "../services/citasService";
import { useDisponibilidad } from "./useDisponibilidad";
import { useHorariosEmpleado } from "./useHorariosEmpleado";
import { useNovedadesEmpleado } from "./useNovedadesEmpleado";
import {
  validateFecha,
  validateDuracion,
  validateHora,
  validateHoraConFecha,
  getBackendDay,
  diasSemanaMap
} from "../utils/citasUtils";

export function useCitaForm({
  mode = "create",
  initialData = null,
  clientes = [],
  servicios = [],
  empleados = [],
  estadosCita = [],
  onSubmitSuccess,
  onError,
}) {
  const isView = mode === "view";
  const citaId = mode === "edit" && initialData ? initialData.id : null;

  const [formData, setFormData] = useState({
    cliente_id: "",
    servicio_id: "",
    empleado_id: "",
    estado_cita_id: "",
    metodo_pago: "",
    fecha: null,
    hora: null,
    duracion: 30,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [horaInvalida, setHoraInvalida] = useState(false);

  // Horarios del empleado seleccionado
  const { horarios: horariosEmpleado } = useHorariosEmpleado(formData.empleado_id);

  // Novedades del empleado seleccionado (para bloquear fechas)
  const { isFechaBloqueada } = useNovedadesEmpleado(formData.empleado_id);

  // Días activos para mostrar en chips
  const diasActivos = horariosEmpleado
    .filter(h => h.activo === true)
    .map(h => ({
      dia: h.dia,
      nombre: diasSemanaMap[h.dia],
      hora_inicio: h.hora_inicio?.substring(0,5),
      hora_final: h.hora_final?.substring(0,5),
    }));

  // Disponibilidad
  const {
    verificando,
    disponibilidad,
    errorDisponibilidad,
    isAvailable,
    resetDisponibilidad,
  } = useDisponibilidad({
    empleadoId: formData.empleado_id,
    fecha: formData.fecha,
    hora: formData.hora,
    duracion: formData.duracion,
    excludeCitaId: citaId,
    isView,
  });

  // Función para crear fecha sin zona horaria
  const createLocalDate = (fechaStr) => {
    if (!fechaStr) return null;
    if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
      const [year, month, day] = fechaStr.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    if (fechaStr instanceof Date) return fechaStr;
    return new Date(fechaStr);
  };

  // Obtener duración del servicio seleccionado
  const duracionActual = useMemo(() => {
    if (!formData.servicio_id) return null;
    const servicio = servicios.find(s => s.id === parseInt(formData.servicio_id));
    return servicio?.duracion_min || null;
  }, [formData.servicio_id, servicios]);

  // Obtener horario del empleado para la fecha seleccionada
  const getHorarioDelDia = useCallback(() => {
    if (!formData.fecha || !horariosEmpleado.length) return null;
    
    const backendDay = getBackendDay(formData.fecha);
    const horarioDia = horariosEmpleado.find(h => h.dia === backendDay && h.activo === true);
    
    return horarioDia;
  }, [formData.fecha, horariosEmpleado]);

  // Verificar si la hora está dentro del rango laboral
  const validarHoraEnRango = useCallback((horaSeleccionada) => {
    if (isView) return true;
    if (!formData.fecha || !formData.empleado_id || !horaSeleccionada) return false;
    
    const horarioDia = getHorarioDelDia();
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
  }, [formData.fecha, formData.empleado_id, getHorarioDelDia, isView]);

  // Verificar si la hora seleccionada permite completar el servicio
  const validarHoraCompletaServicio = useCallback((horaSeleccionada) => {
    if (isView) return true;
    if (!formData.fecha || !formData.empleado_id || !horaSeleccionada || !duracionActual) return false;
    
    const horarioDia = getHorarioDelDia();
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
    
    let minutosFinServicio = minutos + duracionActual;
    let horasFinServicio = horas;
    while (minutosFinServicio >= 60) {
      minutosFinServicio -= 60;
      horasFinServicio++;
    }
    
    const minutosTotalesFinServicio = horasFinServicio * 60 + minutosFinServicio;
    const minutosTotalesFinJornada = finH * 60 + finM;
    
    return minutosTotalesFinServicio <= minutosTotalesFinJornada;
  }, [formData.fecha, formData.empleado_id, duracionActual, getHorarioDelDia, isView]);

  // Verificar si la hora es anterior a la actual (si es hoy)
  const validarHoraNoAnterior = useCallback((horaSeleccionada) => {
    if (isView) return true;
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
  }, [formData.fecha, isView]);

  // Validar hora completa
  const esHoraValida = useMemo(() => {
    if (isView) return true;
    if (!formData.hora) return false;
    const enRango = validarHoraEnRango(formData.hora);
    const noAnterior = validarHoraNoAnterior(formData.hora);
    const alcanzaServicio = validarHoraCompletaServicio(formData.hora);
    return enRango && noAnterior && alcanzaServicio;
  }, [formData.hora, validarHoraEnRango, validarHoraNoAnterior, validarHoraCompletaServicio, isView]);

  // Actualizar estado de hora inválida
  useEffect(() => {
    if (isView) {
      setHoraInvalida(false);
    } else {
      setHoraInvalida(formData.hora && !esHoraValida);
    }
  }, [formData.hora, esHoraValida, isView]);

  // Obtener mensaje de error de hora
  const getHoraErrorMessage = useCallback(() => {
    if (isView) return "";
    if (!formData.hora) return "";
    if (!validarHoraEnRango(formData.hora)) return "Hora fuera del horario laboral";
    if (duracionActual && !validarHoraCompletaServicio(formData.hora)) {
      return `El servicio dura ${duracionActual} minutos. Debe terminar antes del fin de la jornada.`;
    }
    if (!validarHoraNoAnterior(formData.hora)) return "La hora no puede ser anterior a la hora actual";
    return "";
  }, [formData.hora, duracionActual, validarHoraEnRango, validarHoraCompletaServicio, validarHoraNoAnterior, isView]);

  // Deshabilitar horas según duración del servicio
  const shouldDisableTime = useCallback((timeValue) => {
    if (isView) return false;
    if (!formData.fecha || !formData.empleado_id) return true;

    const horaSeleccionada = timeValue.getHours();
    const minutoSeleccionado = timeValue.getMinutes();

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

    const horarioDia = getHorarioDelDia();
    if (!horarioDia) return true;
    const horaInicio = horarioDia.hora_inicio;
    const horaFin = horarioDia.hora_final;
    if (!horaInicio || !horaFin) return true;

    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
    const minutosSeleccionados = horaSeleccionada * 60 + minutoSeleccionado;
    const minutosInicio = inicioH * 60 + inicioM;
    const minutosFin = finH * 60 + finM;

    if (minutosSeleccionados < minutosInicio || minutosSeleccionados >= minutosFin) return true;

    if (duracionActual && duracionActual > 0) {
      const minutosDesdeInicio = minutosSeleccionados - minutosInicio;
      if (minutosDesdeInicio % duracionActual !== 0) {
        return true;
      }
    }

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
  }, [formData.fecha, formData.empleado_id, duracionActual, getHorarioDelDia, isView]);

  // Deshabilitar fechas (integrando novedades del empleado)
  const shouldDisableDate = useCallback((date) => {
    if (isView) return false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(date);
    fechaComparar.setHours(0, 0, 0, 0);
    
    // Fechas pasadas
    if (fechaComparar < hoy) return true;
    
    // Si no hay empleado seleccionado, no deshabilitar por horarios ni novedades
    if (!formData.empleado_id) return false;
    
    // Verificar si la fecha está bloqueada por novedad (vacaciones, incapacidad, etc.)
    if (isFechaBloqueada(date)) return true;
    
    // Verificar horarios laborales (días activos)
    if (!diasActivos || diasActivos.length === 0) return false;
    
    const backendDay = getBackendDay(date);
    const diaActivo = diasActivos.find(d => d.dia === backendDay);
    
    return !diaActivo;
  }, [formData.empleado_id, diasActivos, isView, isFechaBloqueada]);

  // Filtros
  const getClientesActivos = useCallback(() => {
    return clientes.filter(c => c.estado === true || c.estado === "activo");
  }, [clientes]);

  const getServiciosActivos = useCallback(() => {
    return servicios.filter(s => s.estado === true);
  }, [servicios]);

  const getEmpleadosActivos = useCallback(() => {
    return empleados.filter(e => e.estado === true || e.estado === "activo");
  }, [empleados]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      cliente_id: initialData.cliente_id || "",
      servicio_id: initialData.servicio_id || "",
      empleado_id: initialData.empleado_id || "",
      estado_cita_id: initialData.estado_cita_id || "",
      metodo_pago: initialData.metodo_pago || "",
      fecha: initialData.fecha ? createLocalDate(initialData.fecha) : null,
      hora: initialData.hora && typeof initialData.hora === 'string'
        ? (() => {
            const [h, m] = initialData.hora.split(":");
            const d = new Date();
            d.setHours(parseInt(h), parseInt(m), 0);
            return d;
          })()
        : null,
      duracion: initialData.duracion || 30,
    });
  }, [initialData]);

  // Actualizar duración al seleccionar servicio
  useEffect(() => {
    if (formData.servicio_id && servicios.length > 0) {
      const servicioSeleccionado = servicios.find(s => s.id === parseInt(formData.servicio_id));
      if (servicioSeleccionado && servicioSeleccionado.duracion_min) {
        setFormData(prev => ({ ...prev, duracion: servicioSeleccionado.duracion_min }));
        if (errors.duracion) setErrors(prev => ({ ...prev, duracion: "" }));
      }
    }
  }, [formData.servicio_id, servicios]);

  // Estado por defecto en creación
  useEffect(() => {
    if (mode === "create" && estadosCita.length > 0 && !formData.estado_cita_id) {
      const estadoPendiente =
        estadosCita.find(e => e.nombre?.toLowerCase().includes("pendiente")) || estadosCita[0];
      setFormData(prev => ({ ...prev, estado_cita_id: estadoPendiente.id }));
    }
  }, [estadosCita, mode, formData.estado_cita_id]);

  // Resetear fecha y hora al cambiar empleado
  const prevEmpleadoIdRef = useRef();
  useEffect(() => {
    if (formData.empleado_id !== prevEmpleadoIdRef.current) {
      prevEmpleadoIdRef.current = formData.empleado_id;
      if (formData.empleado_id) {
        setFormData(prev => ({ ...prev, fecha: null, hora: null }));
        resetDisponibilidad();
      }
    }
  }, [formData.empleado_id, resetDisponibilidad]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (name === "empleado_id") resetDisponibilidad();
  }, [errors, resetDisponibilidad]);

  const handleDateChange = useCallback((date) => {
    setFormData(p => ({ ...p, fecha: date }));
    if (errors.fecha) setErrors(p => ({ ...p, fecha: "" }));
    resetDisponibilidad();
  }, [errors, resetDisponibilidad]);

  const handleTimeChange = useCallback((time) => {
    setFormData(p => ({ ...p, hora: time }));
    if (errors.hora) setErrors(p => ({ ...p, hora: "" }));
    resetDisponibilidad();
  }, [errors, resetDisponibilidad]);

  // Validaciones
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.cliente_id) newErrors.cliente_id = "Seleccione un cliente";
    if (!formData.servicio_id) newErrors.servicio_id = "Seleccione un servicio";
    if (!formData.empleado_id) newErrors.empleado_id = "Seleccione un empleado";
    if (!formData.estado_cita_id) newErrors.estado_cita_id = "Seleccione un estado";
    if (!formData.metodo_pago) newErrors.metodo_pago = "Seleccione un método de pago";

    const fechaValidation = validateFecha(formData.fecha);
    if (!fechaValidation.isValid) {
      newErrors.fecha = fechaValidation.message;
    } else if (formData.fecha) {
      // Verificar si la fecha está bloqueada por novedad
      if (isFechaBloqueada(formData.fecha)) {
        newErrors.fecha = "El empleado no está disponible en esta fecha (vacaciones, incapacidad, etc.)";
      } else {
        const backendDay = getBackendDay(formData.fecha);
        const horariosActivos = horariosEmpleado.filter(h => h.activo === true);
        const tieneHorario = horariosActivos.some(h => h.dia === backendDay);
        if (!tieneHorario && horariosActivos.length > 0) {
          const diasDisponibles = horariosActivos.map(h => diasSemanaMap[h.dia]).join(", ");
          newErrors.fecha = `El empleado no trabaja este día. Días disponibles: ${diasDisponibles}`;
        } else if (horariosActivos.length === 0) {
          newErrors.fecha = "El empleado no tiene horarios configurados o están inactivos.";
        }
      }
    }

    const horaValidation = validateHoraConFecha(formData.fecha, formData.hora);
    if (!horaValidation.isValid) newErrors.hora = horaValidation.message;

    const duracionValidation = validateDuracion(formData.duracion);
    if (!duracionValidation.isValid) newErrors.duracion = duracionValidation.message;

    if (!isView && disponibilidad && !disponibilidad.disponible) {
      newErrors.general = errorDisponibilidad;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isView, disponibilidad, errorDisponibilidad, horariosEmpleado, isFechaBloqueada]);

  // Submit
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const servicio = servicios.find(s => s.id === parseInt(formData.servicio_id));
      const duracionDelServicio = servicio?.duracion_min || 30;

      let fechaFormateada = null;
      if (formData.fecha) {
        const year = formData.fecha.getFullYear();
        const month = String(formData.fecha.getMonth() + 1).padStart(2, '0');
        const day = String(formData.fecha.getDate()).padStart(2, '0');
        fechaFormateada = `${year}-${month}-${day}`;
      }

      const datosEnvio = {
        ...formData,
        duracion: duracionDelServicio,
        fecha: fechaFormateada,
        hora: formData.hora ? `${formData.hora.getHours().toString().padStart(2, "0")}:${formData.hora.getMinutes().toString().padStart(2, "0")}` : null,
      };

      let result;
      if (mode === "create") {
        result = await createCita(datosEnvio);
      } else {
        result = await updateCita(initialData.id, datosEnvio);
      }

      if (result.success) {
        onSubmitSuccess?.(result.data);
        return { success: true, data: result.data };
      } else {
        onError?.(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error al guardar cita:", error);
      const errorMessage = error.response?.data?.message || "Error al guardar la cita";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [formData, mode, initialData, validate, onSubmitSuccess, onError, servicios]);

  const resetForm = useCallback(() => {
    setFormData({
      cliente_id: "",
      servicio_id: "",
      empleado_id: "",
      estado_cita_id: "",
      metodo_pago: "",
      fecha: null,
      hora: null,
      duracion: 30,
    });
    setErrors({});
    resetDisponibilidad();
  }, [resetDisponibilidad]);

  return {
    formData,
    errors,
    submitting,
    verificando,
    disponibilidad,
    errorDisponibilidad,
    isAvailable,
    horariosEmpleado,
    diasActivos,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    resetForm,
    setFormData,
    getHorarioDelDia,
    duracionActual,
    getClientesActivos,
    getServiciosActivos,
    getEmpleadosActivos,
    horaInvalida,
    getHoraErrorMessage,
    shouldDisableDate,
    shouldDisableTime,
    esHoraValida,
  };
}