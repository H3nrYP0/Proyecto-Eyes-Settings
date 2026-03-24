import api from "../../../../../lib/axios";

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
// OBTENER CITAS
// ============================
export async function getCitasAgenda() {
  try {
    const res = await api.get("/citas");
    return res.data;
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