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
// 🔴 NUEVO: Verificar disponibilidad
// ============================
export async function verificarDisponibilidad(empleadoId, fecha, hora, duracion = 30) {
  try {
    const res = await api.get("/verificar-disponibilidad", {
      params: {
        empleado_id: empleadoId,
        fecha: fecha,
        hora: hora,
        duracion: duracion
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    return { disponible: false, mensaje: "Error al verificar disponibilidad" };
  }
}

// ============================
// Crear cita (con manejo de errores mejorado)
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

  try {
    const res = await api.post("/citas", payload);
    return { success: true, data: res.data };
  } catch (error) {
    // 🔴 Manejar errores específicos del backend
    if (error.response?.data) {
      const errorData = error.response.data;
      return { 
        success: false, 
        error: errorData.error,
        codigo: errorData.codigo,
        horario: errorData.horario_inicio ? {
          inicio: errorData.horario_inicio,
          fin: errorData.horario_fin
        } : null
      };
    }
    throw error;
  }
}

// ============================
// Actualizar cita COMPLETA (con manejo de errores)
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

  try {
    const res = await api.put(`/citas/${id}`, payload);
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response?.data) {
      const errorData = error.response.data;
      return { 
        success: false, 
        error: errorData.error,
        codigo: errorData.codigo
      };
    }
    throw error;
  }
}

// ============================
// Actualizar SOLO el estado de la cita
// ============================
export async function updateCitaStatus(id, estado_cita_id) {
  const citaActual = await getCitaById(id);
  
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