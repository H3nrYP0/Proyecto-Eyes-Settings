import { useState, useEffect, useCallback, useRef } from "react";
import { createCita, updateCita } from "../services/citasService";
import { useDisponibilidad } from "./useDisponibilidad";
import { useHorariosEmpleado } from "./useHorariosEmpleado";
import {
  validateFecha,
  validateDuracion,
  validateHora,
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

  // Horarios del empleado seleccionado
  const { horarios: horariosEmpleado } = useHorariosEmpleado(formData.empleado_id);

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

  // Cargar datos iniciales
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      cliente_id: initialData.cliente_id || "",
      servicio_id: initialData.servicio_id || "",
      empleado_id: initialData.empleado_id || "",
      estado_cita_id: initialData.estado_cita_id || "",
      metodo_pago: initialData.metodo_pago || "",
      fecha: initialData.fecha ? new Date(initialData.fecha) : null,
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

  // Resetear fecha y hora al cambiar empleado (solo si realmente cambió)
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

  // Validaciones (incluye día laborable)
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
      const dayIndex = getBackendDay(formData.fecha);
      const horariosActivos = horariosEmpleado.filter(h => h.activo === true);
      const tieneHorario = horariosActivos.some(h => h.dia === dayIndex);
      if (!tieneHorario && horariosActivos.length > 0) {
        const diasDisponibles = horariosActivos.map(h => diasSemanaMap[h.dia]).join(", ");
        newErrors.fecha = `El empleado no trabaja este día. Días disponibles: ${diasDisponibles}`;
      } else if (horariosActivos.length === 0) {
        newErrors.fecha = "El empleado no tiene horarios configurados o están inactivos.";
      }
    }

    const horaValidation = validateHora(formData.hora);
    if (!horaValidation.isValid) newErrors.hora = horaValidation.message;

    const duracionValidation = validateDuracion(formData.duracion);
    if (!duracionValidation.isValid) newErrors.duracion = duracionValidation.message;

    if (!isView && disponibilidad && !disponibilidad.disponible) {
      newErrors.general = errorDisponibilidad;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isView, disponibilidad, errorDisponibilidad, horariosEmpleado]);

  // Submit
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const datosEnvio = {
        ...formData,
        fecha: formData.fecha ? formData.fecha.toISOString().split("T")[0] : null,
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
  }, [formData, mode, initialData, validate, onSubmitSuccess, onError]);

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
  };
}