import api from "../axios";

/* =========================================
   OBTENER TODOS LOS HORARIOS
========================================= */
export async function getAllAgenda() {
  const res = await api.get("/horario");
  return res.data;
}

/* =========================================
   OBTENER HORARIO POR ID
========================================= */
export async function getAgendaById(id) {
  const res = await api.get(`/horario/${id}`);
  return res.data;
}

/* =========================================
   CREAR HORARIO
========================================= */
export async function createAgenda(data) {
  const payload = {
    empleado_id: Number(data.empleado_id),
    dia: Number(data.dia),
    hora_inicio: data.hora_inicio,
    hora_final: data.hora_final,
  };

  const res = await api.post("/horario", payload);
  return res.data;
}

/* =========================================
   ACTUALIZAR HORARIO
========================================= */
export async function updateAgenda(id, updated) {
  const payload = {
    empleado_id: Number(updated.empleado_id),
    dia: Number(updated.dia),
    hora_inicio: updated.hora_inicio,
    hora_final: updated.hora_final,
  };

  const res = await api.put(`/horario/${id}`, payload);
  return res.data;
}

/* =========================================
   ELIMINAR HORARIO
========================================= */
export async function deleteAgenda(id) {
  const res = await api.delete(`/horario/${id}`);
  return res.data;
}

/* =========================================
   OBTENER EMPLEADOS
========================================= */
export async function getEmpleados() {
  const res = await api.get("/empleados");
  return res.data;
}

export function updateEstadoAgenda() {
  return [];
}
