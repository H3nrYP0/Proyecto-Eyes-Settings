import api from "../axios";

// ============================
// Obtener todos los estados de cita
// ============================
export async function getAllEstadosCita() {
  try {
    // CORREGIDO: cambiado de "/estados-cita" a "/estado-cita" (sin la 's')
    const res = await api.get("/estado-cita");
    return res.data;
  } catch (error) {
    console.error("Error cargando estados de cita:", error);
    return [];
  }
}

// ============================
// Obtener estado de cita por ID
// ============================
export async function getEstadoCitaById(id) {
  try {
    // CORREGIDO: cambiado de "/estados-cita" a "/estado-cita"
    const res = await api.get("/estado-cita");
    const estados = res.data || [];
    return estados.find((e) => e.id === id);
  } catch (error) {
    console.error("Error cargando estado de cita:", error);
    return null;
  }
}