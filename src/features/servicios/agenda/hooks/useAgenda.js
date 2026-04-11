import { useState, useEffect, useCallback } from 'react';
import { useAgendaData } from '../context/AgendaDataContext';
import { getHorariosAgenda, getCitasAgenda } from '../services/agendaService';
import { mapearHorariosEventos, mapearCitasEventos } from '../utils/agendaUtils';

export function useAgenda() {
  const { empleados, estadosCita, loading: dataLoading } = useAgendaData();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState('todos');
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [horariosRes, citasRes] = await Promise.allSettled([
        getHorariosAgenda(),
        getCitasAgenda(),
      ]);

      // Extraer arrays (citasRes.value ya es el array gracias a la modificación)
      const horarios = horariosRes.status === 'fulfilled' && Array.isArray(horariosRes.value) 
        ? horariosRes.value 
        : [];
      
      const citas = citasRes.status === 'fulfilled' && Array.isArray(citasRes.value) 
        ? citasRes.value 
        : [];

      const errores = [];
      if (horariosRes.status === 'rejected') errores.push('horarios');
      if (citasRes.status === 'rejected') errores.push('citas');

      if (errores.length) {
        setErrorModal({
          open: true,
          message: `No se pudieron cargar: ${errores.join(', ')}`
        });
      }

      const horariosEventos = mapearHorariosEventos(horarios, empleados);
      const citasEventos = mapearCitasEventos(citas, empleados, estadosCita);
      
      setEvents([...horariosEventos, ...citasEventos]);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la agenda');
    } finally {
      setLoading(false);
    }
  }, [empleados, estadosCita]);

  const eventosFiltrados = selectedEmpleado === 'todos' 
    ? events 
    : events.filter(e => e.extendedProps?.empleado_id === parseInt(selectedEmpleado));

  useEffect(() => {
    if (!dataLoading && empleados.length > 0) {
      cargarDatos();
    }
  }, [dataLoading, empleados, cargarDatos]);

  return {
    events: eventosFiltrados,
    empleados,
    loading: loading || dataLoading,
    error,
    selectedEmpleado,
    setSelectedEmpleado,
    errorModal,
    setErrorModal,
    recargar: cargarDatos,
  };
}