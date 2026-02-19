import api from "../axios";

// ============================
// Obtener todos los estados de cita
// ============================
export async function getAllEstadosCita() {
  try {
    const res = await api.get("/estados-cita");
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
    const res = await api.get("/estados-cita");
    const estados = res.data || [];
    return estados.find((e) => e.id === id);
  } catch (error) {
    console.error("Error cargando estado de cita:", error);
    return null;
  }
}