import { useState, useEffect, useCallback } from "react";
import { verificarDisponibilidad } from "../services/citasService";

export function useDisponibilidad({ empleadoId, fecha, hora, duracion = 30, excludeCitaId = null, isView = false }) {
  const [verificando, setVerificando] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState("");

  // Función para formatear fecha sin zona horaria
  const formatLocalDate = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date;
  };

  // Función para formatear hora
  const formatLocalTime = (time) => {
    if (!time) return null;
    if (time instanceof Date) {
      return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
    }
    return time;
  };

  const verificar = useCallback(async () => {
    if (isView) return;
    if (!empleadoId || !fecha || !hora) {
      setDisponibilidad(null);
      setErrorDisponibilidad("");
      return;
    }

    setVerificando(true);
    setErrorDisponibilidad("");

    try {
      const fechaStr = formatLocalDate(fecha);
      const horaStr = formatLocalTime(hora);

      const resultado = await verificarDisponibilidad(
        empleadoId,
        fechaStr,
        horaStr,
        duracion,
        excludeCitaId
      );

      setDisponibilidad(resultado);
      if (!resultado.disponible) {
        setErrorDisponibilidad(resultado.mensaje);
      }
    } catch (error) {
      console.error("Error verificando disponibilidad:", error);
      setErrorDisponibilidad("Error al verificar disponibilidad");
    } finally {
      setVerificando(false);
    }
  }, [empleadoId, fecha, hora, duracion, excludeCitaId, isView]);

  useEffect(() => {
    const timeoutId = setTimeout(verificar, 500);
    return () => clearTimeout(timeoutId);
  }, [verificar]);

  useEffect(() => {
    if (empleadoId) {
      setDisponibilidad(null);
      setErrorDisponibilidad("");
    }
  }, [empleadoId]);

  return {
    verificando,
    disponibilidad,
    errorDisponibilidad,
    isAvailable: disponibilidad?.disponible === true,
    horario: disponibilidad?.horario,
    resetDisponibilidad: () => {
      setDisponibilidad(null);
      setErrorDisponibilidad("");
    },
  };
}