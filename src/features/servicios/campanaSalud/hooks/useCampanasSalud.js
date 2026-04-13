// features/servicios/campanaSalud/hooks/useCampanasSalud.js

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getAllCampanasSalud,
  deleteCampanaSalud,
  updateCampanaSalud,
} from '../services/campanasSaludService';
import { getEstadosCita } from '../services/estadosCitaCampanaService';
import { ESTADOS_BLOQUEADOS, ESTADO_CITA } from '../utils/constants';
import { formatearFechaLocal, horaA12 } from '../utils/campanasSaludUtils';

export const useCampanasSalud = () => {
  const [campanas, setCampanas] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: '',
  });
  const isMounted = useRef(true);
  const estadosCitaRef = useRef([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const timeoutRef = useRef(null);

  const showNotification = (type, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification({ open: true, type, message });
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        setNotification((prev) => ({ ...prev, open: false }));
      }
      timeoutRef.current = null;
    }, 5000);
  };

  const hideNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    isMounted.current = true;
    const fetchEstados = async () => {
      try {
        const data = await getEstadosCita();
        if (isMounted.current) {
          setEstadosCita(data);
          estadosCitaRef.current = data;
        }
      } catch (err) {
        if (isMounted.current) {
          setError('Error al cargar los estados de cita');
        }
      }
    };
    fetchEstados();
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const transformCampana = useCallback((campana) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCampana = new Date(campana.fecha);
    fechaCampana.setHours(0, 0, 0, 0);

    const estadoObj = estadosCitaRef.current.find((e) => e.id === campana.estado_cita_id);
    const estadoNombre = estadoObj?.nombre || 'Pendiente';
    const bloqueada = ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id);
    const todosLosEstados = estadosCitaRef.current.map((e) => e.nombre);

    return {
      id: campana.id,
      empleado_id: campana.empleado_id,
      empleado_nombre: campana.empleado_nombre || 'No asignado',
      empresa: campana.empresa,
      contacto: campana.contacto || '-',
      fecha: campana.fecha,
      fechaFormateada: formatearFechaLocal(campana.fecha),
      fechaObj: fechaCampana,
      hora: campana.hora ? horaA12(campana.hora) : '-',
      horaRaw: campana.hora || '',
      direccion: campana.direccion || '-',
      observaciones: campana.observaciones || '-',
      estado_cita_id: campana.estado_cita_id,
      estado: estadoNombre,
      estadosDisponibles: todosLosEstados,
      esEditable: !bloqueada,
      esEliminable: !bloqueada,
    };
  }, []);

  const loadCampanas = useCallback(async (skipAutoUpdate = false) => {
    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    try {
      let data = await getAllCampanasSalud();

      if (!skipAutoUpdate && !isInitialLoad) {
        const promises = [];
        const estadosActuales = estadosCitaRef.current;
        for (const campana of data) {
          if (campana.estado_cita_id === ESTADOS_BLOQUEADOS[0] || campana.estado_cita_id === ESTADOS_BLOQUEADOS[1]) continue;
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          const fechaCampana = new Date(campana.fecha);
          fechaCampana.setHours(0, 0, 0, 0);
          if (fechaCampana < hoy) {
            const completada = estadosActuales.find((e) => e.nombre.toLowerCase() === 'completada');
            const nuevoId = completada ? completada.id : ESTADO_CITA.COMPLETADA;
            if (nuevoId !== campana.estado_cita_id) {
              promises.push(updateCampanaSalud(campana.id, { estado_cita_id: nuevoId }));
            }
          }
        }
        if (promises.length) {
          await Promise.all(promises);
          data = await getAllCampanasSalud();
        }
      }

      if (isMounted.current) {
        setCampanas(data.map(transformCampana));
        if (isInitialLoad) setIsInitialLoad(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.response?.data?.error || 'Error al cargar las campañas');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [transformCampana, isInitialLoad]);

  useEffect(() => {
    if (estadosCita.length > 0) {
      loadCampanas(true);
    }
  }, [estadosCita, loadCampanas]);

  useEffect(() => {
    if (estadosCita.length === 0) return;
    const intervalo = setInterval(() => {
      loadCampanas();
    }, 60 * 60 * 1000);
    return () => clearInterval(intervalo);
  }, [estadosCita, loadCampanas]);

  const handleCambioEstado = async (param1, param2) => {
    let campana, nuevoEstadoNombre;
    if (typeof param1 === 'object' && param1.id) {
      campana = param1;
      nuevoEstadoNombre = param2;
    } else {
      const id = param1;
      campana = campanas.find(c => c.id === id);
      nuevoEstadoNombre = param2;
    }
    if (!campana) {
      showNotification('error', 'Campaña no encontrada');
      return { success: false };
    }

    const estadoSeleccionado = estadosCitaRef.current.find((e) => e.nombre === nuevoEstadoNombre);
    if (!estadoSeleccionado) {
      showNotification('error', 'Estado no válido');
      return { success: false };
    }

    if (ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) {
      showNotification(
        'warning',
        `No se puede cambiar el estado: la campaña "${campana.empresa}" está ${campana.estado.toLowerCase()} y no admite modificaciones.`
      );
      return { success: false };
    }

    try {
      await updateCampanaSalud(campana.id, { estado_cita_id: estadoSeleccionado.id });
      await loadCampanas();
      showNotification('success', `Estado de la campaña "${campana.empresa}" actualizado correctamente`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al actualizar el estado';
      showNotification('error', msg);
      return { success: false, error: msg };
    }
  };

  const handleDelete = async (id) => {
    const campana = campanas.find((c) => c.id === id);
    if (campana && ESTADOS_BLOQUEADOS.includes(campana.estado_cita_id)) {
      showNotification(
        'warning',
        `No se puede eliminar la campaña "${campana.empresa}": está ${campana.estado.toLowerCase()} y no admite eliminación.`
      );
      return { success: false };
    }
    try {
      await deleteCampanaSalud(id);
      await loadCampanas();
      showNotification('success', `Campaña "${campana?.empresa || ''}" eliminada correctamente`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al eliminar la campaña';
      showNotification('error', msg);
      return { success: false, error: msg };
    }
  };

  return {
    campanas,
    loading,
    error,
    notification,
    handleDelete,
    handleCambioEstado,
    hideNotification,
    showNotification,
  };
};