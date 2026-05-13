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

export function useAgenda() {
  const [selectedEmpleado, setSelectedEmpleado] = useState('todos');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  // Datos estáticos – cambian poco
  const {
    data: empleados = [],
    error: errorEmpleados,
  } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: estadosCita = [],
    error: errorEstados,
  } = useQuery({
    queryKey: ['estados-cita'],
    queryFn: getEstadosCitaAgenda,
    staleTime: 10 * 60 * 1000,
  });

  const baseDatosLista = empleados.length > 0;

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

  // Error combinado
  const error =
    errorEmpleados ||
    errorEstados ||
    errorHorarios ||
    errorCitas ||
    errorNovedades;

  // Mapeo de eventos
  const events = useMemo(() => {
    if (!empleados.length) return [];
    return [
      ...mapearHorariosEventos(horarios, empleados),
      ...mapearCitasEventos(citas, empleados, estadosCita),
      ...mapearNovedadesEventos(novedades, empleados),
    ];
  }, [horarios, citas, novedades, empleados, estadosCita]);

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