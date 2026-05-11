import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmpleadosAgenda, getEstadosCitaAgenda, getHorariosAgenda, getCitasAgenda, getNovedadesAgenda } from '../services/agendaService';
import { mapearHorariosEventos, mapearCitasEventos, mapearNovedadesEventos } from '../utils/agendaUtils';

export function useAgenda() {
  const [selectedEmpleado, setSelectedEmpleado] = useState('todos');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  // Datos estáticos — cambian muy poco, staleTime alto
  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda,
    staleTime: 10 * 60 * 1000,
  });

  const { data: estadosCita = [] } = useQuery({
    queryKey: ['estados-cita'],
    queryFn: getEstadosCitaAgenda,
    staleTime: 10 * 60 * 1000,
  });

  // Datos dinámicos — dependen de empleados/estados para el mapeo
  // Se habilitan solo cuando los datos base ya están disponibles
  const baseDatosLista = empleados.length > 0;

  const { data: horarios = [], isLoading: loadingHorarios } = useQuery({
    queryKey: ['horarios-agenda'],
    queryFn: getHorariosAgenda,
    enabled: baseDatosLista,
    staleTime: 5 * 60 * 1000,
  });

  const { data: citas = [], isLoading: loadingCitas } = useQuery({
    queryKey: ['citas-agenda'],
    queryFn: getCitasAgenda,
    enabled: baseDatosLista,
    staleTime: 2 * 60 * 1000,   // citas cambian más seguido
  });

  const { data: novedades = [], isLoading: loadingNovedades } = useQuery({
    queryKey: ['novedades-agenda'],
    queryFn: getNovedadesAgenda,
    enabled: baseDatosLista,
    staleTime: 5 * 60 * 1000,
  });

  // Mapear eventos solo cuando todos los datos están listos
  const events = useMemo(() => {
    if (!empleados.length) return [];
    return [
      ...mapearHorariosEventos(horarios,  empleados),
      ...mapearCitasEventos(citas,        empleados, estadosCita),
      ...mapearNovedadesEventos(novedades, empleados),
    ];
  }, [horarios, citas, novedades, empleados, estadosCita]);

  // Filtrar por empleado seleccionado
  const eventosFiltrados = useMemo(() => {
    if (selectedEmpleado === 'todos') return events;
    return events.filter(
      e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado)
    );
  }, [events, selectedEmpleado]);

  const loading = loadingHorarios || loadingCitas || loadingNovedades;

  return {
    events:              eventosFiltrados,
    empleados,
    loading,
    error:               null,
    selectedEmpleado,
    setSelectedEmpleado,
    errorModal,
    setErrorModal,
    // recargar: con React Query se invalidan queries desde fuera si hace falta
  };
}