// src/features/servicios/citas/hooks/useNovedadesEmpleado.js
import { useState, useEffect, useCallback } from 'react';
import { getNovedadesByEmpleado } from '../../novedades/services/novedadesService';

export function useNovedadesEmpleado(empleadoId) {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarNovedades = useCallback(async () => {
    if (!empleadoId) {
      setNovedades([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getNovedadesByEmpleado(empleadoId);
      setNovedades(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar novedades del empleado');
    } finally {
      setLoading(false);
    }
  }, [empleadoId]);

  useEffect(() => {
    cargarNovedades();
  }, [cargarNovedades]);

  // Función para verificar si una fecha está bloqueada por alguna novedad
  const isFechaBloqueada = useCallback((fecha) => {
    if (!novedades.length) return false;
    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);
    
    return novedades.some(n => {
      const inicio = new Date(n.fecha_inicio);
      const fin = new Date(n.fecha_fin);
      inicio.setHours(0, 0, 0, 0);
      fin.setHours(0, 0, 0, 0);
      return fechaComparar >= inicio && fechaComparar <= fin;
    });
  }, [novedades]);

  return { novedades, loading, error, isFechaBloqueada };
}