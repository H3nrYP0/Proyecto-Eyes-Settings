import { useState, useEffect, useCallback } from "react";
import { verificarDisponibilidad } from "../services/citasService";

export function useDisponibilidad({ empleadoId, fecha, hora, duracion = 30, excludeCitaId = null, isView = false }) {
  const [verificando, setVerificando] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState("");

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
      const fechaStr = fecha.toISOString().split("T")[0];
      const horaStr = `${hora.getHours().toString().padStart(2, "0")}:${hora.getMinutes().toString().padStart(2, "0")}`;

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