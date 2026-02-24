import api from "../axios";

// Mapeo de días (0 = lunes, 1 = martes, ... 6 = domingo)
export const diasSemana = [
  { value: 0, label: "Lunes" },
  { value: 1, label: "Martes" },
  { value: 2, label: "Miércoles" },
  { value: 3, label: "Jueves" },
  { value: 4, label: "Viernes" },
  { value: 5, label: "Sábado" },
  { value: 6, label: "Domingo" }
];

/* =========================================
   OBTENER TODOS LOS HORARIOS
========================================= */
export async function getAllHorarios() {
  try {
    const res = await api.get("/horario");
    return res.data;
  } catch (error) {
    console.error("Error cargando horarios:", error);
    return [];
  }
}

/* =========================================
   OBTENER HORARIO POR ID
========================================= */
export async function getHorarioById(id) {
  try {
    const res = await api.get(`/horario/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando horario:", error);
    return null;
  }
}

/* =========================================
   OBTENER HORARIOS POR EMPLEADO
========================================= */
export async function getHorariosByEmpleado(empleadoId) {
  try {
    const res = await api.get(`/horario/empleado/${empleadoId}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando horarios del empleado:", error);
    return [];
  }
}

/* =========================================
   CREAR HORARIO
========================================= */
export async function createHorario(data) {
  const payload = {
    empleado_id: Number(data.empleado_id),
    dia: Number(data.dia),
    hora_inicio: data.hora_inicio,
    hora_final: data.hora_final
  };

  try {
    const res = await api.post("/horario", payload);
    return res.data;
  } catch (error) {
    console.error("Error creando horario:", error);
    throw error;
  }
}

/* =========================================
   ACTUALIZAR HORARIO (incluye estado)
========================================= */
export async function updateHorario(id, updated) {
  const payload = {
    empleado_id: Number(updated.empleado_id),
    dia: Number(updated.dia),
    hora_inicio: updated.hora_inicio,
    hora_final: updated.hora_final,
    activo: updated.activo  // 👈 Incluir estado
  };

  try {
    const res = await api.put(`/horario/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error actualizando horario:", error);
    throw error;
  }
}

/* =========================================
   ELIMINAR HORARIO
========================================= */
export async function deleteHorario(id) {
  try {
    const res = await api.delete(`/horario/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando horario:", error);
    throw error;
  }
}

/* =========================================
   OBTENER EMPLEADOS (para selects)
========================================= */
export async function getEmpleados() {
  try {
    const res = await api.get("/empleados");
    return res.data;
  } catch (error) {
    console.error("Error cargando empleados:", error);
    return [];
  }
}

/* =========================================
   ACTUALIZAR SOLO ESTADO (USA EL MISMO PUT)
========================================= */
export async function updateEstadoHorario(id, activo) {
  // Primero obtenemos el horario actual
  const horario = await getHorarioById(id);
  
  // Actualizamos solo el estado
  return updateHorario(id, {
    empleado_id: horario.empleado_id,
    dia: horario.dia,
    hora_inicio: horario.hora_inicio.substring(0,5),
    hora_final: horario.hora_final.substring(0,5),
    activo: activo
  });
}