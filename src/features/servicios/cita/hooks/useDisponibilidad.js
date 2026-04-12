import { useState, useEffect, useCallback } from 'react';
import { verificarDisponibilidad } from '../services/citasService';

export function useDisponibilidad({ empleadoId, fecha, hora, duracion, excludeCitaId, isView = false }) {
  const [verificando, setVerificando] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const verificar = useCallback(async () => {
    if (isView) return;
    if (!empleadoId || !fecha || !hora) return;
    setVerificando(true);
    const result = await verificarDisponibilidad(empleadoId, fecha, hora, duracion, excludeCitaId);
    if (result.success) {
      setDisponibilidad(result.data);
      setErrorDisponibilidad(null);
      setIsAvailable(result.data.disponible);
    } else {
      setDisponibilidad(null);
      setErrorDisponibilidad(result.error);
      setIsAvailable(false);
    }
    setVerificando(false);
  }, [empleadoId, fecha, hora, duracion, excludeCitaId, isView]);

  const resetDisponibilidad = useCallback(() => {
    setDisponibilidad(null);
    setErrorDisponibilidad(null);
    setIsAvailable(false);
  }, []);

  useEffect(() => {
    verificar();
  }, [verificar]);

  return {
    verificando,
    disponibilidad,
    errorDisponibilidad,
    isAvailable,
    resetDisponibilidad,
  };
}