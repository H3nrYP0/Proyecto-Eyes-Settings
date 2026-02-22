import api from "../axios";

// ============================
// Obtener todas las citas
// ============================
export async function getAllCitas() {
  const res = await api.get("/citas");
  return res.data;
}

// ============================
// Obtener cita por ID
// ============================
export async function getCitaById(id) {
  const res = await api.get("/citas");
  const citas = res.data || [];
  return citas.find((c) => c.id === id);
}

// ============================
// Crear cita
// ============================
export async function createCita(data) {
  const payload = {
    cliente_id: data.cliente_id,
    servicio_id: data.servicio_id,
    empleado_id: data.empleado_id,
    estado_cita_id: data.estado_cita_id,
    metodo_pago: data.metodo_pago,
    hora: data.hora,
    duracion: data.duracion,
    fecha: data.fecha
  };

  const res = await api.post("/citas", payload);
  return res.data;
}

// ============================
// Actualizar cita COMPLETA
// ============================
export async function updateCita(id, data) {
  const payload = {
    cliente_id: data.cliente_id,
    servicio_id: data.servicio_id,
    empleado_id: data.empleado_id,
    estado_cita_id: data.estado_cita_id,
    metodo_pago: data.metodo_pago,
    hora: data.hora,
    duracion: data.duracion,
    fecha: data.fecha
  };

  const res = await api.put(`/citas/${id}`, payload);
  return res.data;
}

// ============================
// Actualizar SOLO el estado de la cita
// ============================
export async function updateCitaStatus(id, estado_cita_id) {
  // Primero obtenemos la cita actual
  const citaActual = await getCitaById(id);
  
  // Actualizamos solo el estado
  const payload = {
    cliente_id: citaActual.cliente_id,
    servicio_id: citaActual.servicio_id,
    empleado_id: citaActual.empleado_id,
    estado_cita_id: estado_cita_id,
    metodo_pago: citaActual.metodo_pago,
    hora: citaActual.hora,
    duracion: citaActual.duracion,
    fecha: citaActual.fecha
  };

  const res = await api.put(`/citas/${id}`, payload);
  return res.data;
}

// ============================
// Eliminar cita
// ============================
export async function deleteCita(id) {
  const res = await api.delete(`/citas/${id}`);
  return res.data;
}