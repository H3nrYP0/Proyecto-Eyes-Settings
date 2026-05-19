import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getEmpleadosAgenda,
  getEstadosCitaAgenda,
  getHorariosAgenda,
  getCitasAgenda,
  getNovedadesAgenda,
} from '@servicios/agenda';
import {
  mapearHorariosEventos,
  mapearCitasEventos,
  mapearNovedadesEventos,
} from '@servicios/agenda';

/**
 * Hook personalizado para la lógica de la agenda.
 * Obtiene empleados, estados, horarios, citas y novedades mediante React Query,
 * los normaliza a eventos de FullCalendar y filtra por empleado.
 * 
 * @returns {Object} - Eventos listos para el calendario, empleados, estado de carga, errores y filtros.
 */
export function useAgenda() {
  // Estado local del filtro por empleado
  const [selectedEmpleado, setSelectedEmpleado] = useState('todos');
  // Estado para mostrar errores en modal
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  // ============================ CONSULTAS ============================
  // Empleados (staleTime 10 minutos)
  const { data: empleados = [], error: errorEmpleados } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda,
    staleTime: 10 * 60 * 1000,
  });

  // Estados de cita (staleTime 10 minutos)
  const { data: estadosCita = [], error: errorEstados } = useQuery({
    queryKey: ['estados-cita'],
    queryFn: getEstadosCitaAgenda,
    staleTime: 10 * 60 * 1000,
  });

  // Solo después de tener empleados, se habilitan las siguientes consultas
  const baseDatosLista = empleados.length > 0;

  // Horarios (depende de empleados)
  const {
    data: horarios = [],
    isLoading: loadingHorarios,
    error: errorHorarios,
  } = useQuery({
    queryKey: ['horarios-agenda'],
    queryFn: getHorariosAgenda,
    enabled: baseDatosLista,
    staleTime: 5 * 60 * 1000,
  });

  // Citas (depende de empleados)
  const {
    data: citas = [],
    isLoading: loadingCitas,
    error: errorCitas,
  } = useQuery({
    queryKey: ['citas-agenda'],
    queryFn: getCitasAgenda,
    enabled: baseDatosLista,
    staleTime: 2 * 60 * 1000,
  });

  // Novedades (depende de empleados)
  const {
    data: novedades = [],
    isLoading: loadingNovedades,
    error: errorNovedades,
  } = useQuery({
    queryKey: ['novedades-agenda'],
    queryFn: getNovedadesAgenda,
    enabled: baseDatosLista,
    staleTime: 5 * 60 * 1000,
  });

  // Combina cualquier error que ocurra
  const error = errorEmpleados || errorEstados || errorHorarios || errorCitas || errorNovedades;

  // ============================ MAPEO A EVENTOS ============================
  const events = useMemo(() => {
    if (!empleados.length) return [];
    return [
      ...mapearHorariosEventos(horarios, empleados),
      ...mapearCitasEventos(citas, empleados, estadosCita),
      ...mapearNovedadesEventos(novedades, empleados),
    ];
  }, [horarios, citas, novedades, empleados, estadosCita]);

  // ============================ FILTRADO POR EMPLEADO ============================
  const eventosFiltrados = useMemo(() => {
    if (selectedEmpleado === 'todos') return events;
    return events.filter(
      (e) => e.extendedProps?.empleado_id === parseInt(selectedEmpleado)
    );
  }, [events, selectedEmpleado]);

  const loading = loadingHorarios || loadingCitas || loadingNovedades;

  return {
    events: eventosFiltrados,
    empleados,
    loading,
    error,
    selectedEmpleado,
    setSelectedEmpleado,
    errorModal,
    setErrorModal,
  };
}