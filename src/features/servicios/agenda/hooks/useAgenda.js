import { useState, useEffect, useCallback } from "react";
import {
  getHorariosAgenda,
  getEmpleadosAgenda,
  getCitasAgenda,
  getEstadosCitaAgenda,
} from "../services/agendaService";
import { mapearHorariosEventos, mapearCitasEventos } from "../utils/agendaUtils";

export function useAgenda() {
  const [events, setEvents] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState("todos");
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [horariosRes, empleadosRes, citasRes, estadosRes] = await Promise.allSettled([
        getHorariosAgenda(),
        getEmpleadosAgenda(),
        getCitasAgenda(),
        getEstadosCitaAgenda(),
      ]);

      const horarios = horariosRes.status === 'fulfilled' && Array.isArray(horariosRes.value) ? horariosRes.value : [];
      const empleados = empleadosRes.status === 'fulfilled' && Array.isArray(empleadosRes.value) ? empleadosRes.value : [];
      const citas = citasRes.status === 'fulfilled' && Array.isArray(citasRes.value) ? citasRes.value : [];
      const estados = estadosRes.status === 'fulfilled' && Array.isArray(estadosRes.value) ? estadosRes.value : [];

      const errores = [];
      if (horariosRes.status === 'rejected') errores.push('horarios');
      if (empleadosRes.status === 'rejected') errores.push('empleados');
      if (citasRes.status === 'rejected') errores.push('citas');
      if (estadosRes.status === 'rejected') errores.push('estados');

      if (errores.length) {
        setErrorModal({
          open: true,
          message: `No se pudieron cargar: ${errores.join(', ')}`
        });
      }

      setEmpleados(empleados);
      
      const horariosEventos = mapearHorariosEventos(horarios, empleados);
      const citasEventos = mapearCitasEventos(citas, empleados, estados);
      
      setEvents([...horariosEventos, ...citasEventos]);
    } catch (err) {
      setError('Error al cargar la agenda');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Filtrar eventos por empleado
  // ============================
  const eventosFiltrados = selectedEmpleado === 'todos' 
    ? events 
    : events.filter(e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado));

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    events: eventosFiltrados,
    empleados,
    loading,
    error,
    selectedEmpleado,
    setSelectedEmpleado,
    errorModal,
    setErrorModal,
    recargar: cargarDatos,
  };
}