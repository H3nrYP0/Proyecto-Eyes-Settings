import api from "../../../../../lib/axios";

// ============================
// OBTENER TODOS LOS HORARIOS
// ============================
export async function getAllHorarios() {
  try {
    const res = await api.get("/horario");
    return res.data;
  } catch (error) {
    console.error("Error cargando horarios:", error);
    return [];
  }
}

// ============================
// OBTENER HORARIO POR ID
// ============================
export async function getHorarioById(id) {
  try {
    const res = await api.get(`/horario/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando horario:", error);
    return null;
  }
}

// ============================
// OBTENER HORARIOS POR EMPLEADO
// ============================
export async function getHorariosByEmpleado(empleadoId) {
  try {
    const res = await api.get(`/horario/empleado/${empleadoId}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando horarios del empleado:", error);
    return [];
  }
}

// ============================
// CREAR HORARIO
// ============================
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

// ============================
// ACTUALIZAR HORARIO
// ============================
export async function updateHorario(id, data) {
  const payload = {
    empleado_id: Number(data.empleado_id),
    dia: Number(data.dia),
    hora_inicio: data.hora_inicio,
    hora_final: data.hora_final,
    activo: data.activo !== undefined ? data.activo : true
  };

  try {
    const res = await api.put(`/horario/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error actualizando horario:", error);
    throw error;
  }
}

// ============================
// ELIMINAR HORARIO
// ============================
export async function deleteHorario(id) {
  try {
    const res = await api.delete(`/horario/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando horario:", error);
    throw error;
  }
}

// ============================
// ACTUALIZAR SOLO ESTADO
// ============================
export async function updateEstadoHorario(id, activo) {
  const horario = await getHorarioById(id);
  if (!horario) throw new Error("Horario no encontrado");

  return updateHorario(id, {
    empleado_id: horario.empleado_id,
    dia: horario.dia,
    hora_inicio: horario.hora_inicio?.substring(0, 5),
    hora_final: horario.hora_final?.substring(0, 5),
    activo: activo
  });
}