import api from "../../../../lib/axios";

// ============================
// OBTENER HORARIOS PARA AGENDA
// ============================
export async function getHorariosAgenda() {
  try {
    const res = await api.get("/horario");
    return res.data;
  } catch (error) {
    console.error("Error cargando horarios:", error);
    return [];
  }
}

// ============================
// OBTENER EMPLEADOS
// ============================
export async function getEmpleadosAgenda() {
  try {
    const res = await api.get("/empleados");
    return res.data;
  } catch (error) {
    console.error("Error cargando empleados:", error);
    return [];
  }
}

// ============================
// OBTENER CITAS (con paginación)
// ============================
export async function getCitasAgenda() {
  try {
    const res = await api.get("/citas");
    // El endpoint devuelve { data: [], total, page, per_page, total_pages }
    return res.data.data || [];
  } catch (error) {
    console.error("Error cargando citas:", error);
    return [];
  }
}

// ============================
// OBTENER NOVEDADES PARA AGENDA
// ============================
export async function getNovedadesAgenda() {
  try {
    const res = await api.get("/novedades");
    return res.data; // array de novedades
  } catch (error) {
    console.error("Error cargando novedades:", error);
    return [];
  }
}

// ============================
// OBTENER ESTADOS DE CITA
// ============================
export async function getEstadosCitaAgenda() {
  try {
    const res = await api.get("/estado-cita");
    return res.data;
  } catch (error) {
    console.error("Error cargando estados:", error);
    return [];
  }
}
