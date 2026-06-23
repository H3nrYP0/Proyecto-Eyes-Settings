import api from '@lib/axios';

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
// OBTENER CITAS (CON PAGINACIÓN FORZADA)
// ============================
export async function getCitasAgenda() {
  try {
    // 🔥 Forzar paginación para obtener siempre { data: [], pagination: {...} }
    const res = await api.get("/citas?page=1&per_page=1000");
    // Ahora res.data.data siempre existirá
    return res.data.data || [];
  } catch (error) {
    console.error("Error cargando citas:", error);
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

// ============================
// OBTENER NOVEDADES PARA AGENDA
// ============================
export async function getNovedadesAgenda() {
  try {
    const res = await api.get("/novedades");
    return res.data;
  } catch (error) {
    console.error("Error cargando novedades:", error);
    return [];
  }
}