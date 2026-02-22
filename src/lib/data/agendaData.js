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
export async function getAllAgenda() {
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
export async function getAgendaById(id) {
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
export async function createAgenda(data) {
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
   ACTUALIZAR HORARIO
========================================= */
export async function updateAgenda(id, updated) {
  const payload = {
    empleado_id: Number(updated.empleado_id),
    dia: Number(updated.dia),
    hora_inicio: updated.hora_inicio,
    hora_final: updated.hora_final
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
export async function deleteAgenda(id) {
  try {
    const res = await api.delete(`/horario/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando horario:", error);
    throw error;
  }
}

/* =========================================
   CAMBIAR ESTADO (ACTIVO/INACTIVO)
   NOTA: La API no tiene este endpoint directamente,
   así que hacemos un update completo
========================================= */
export async function toggleEstadoHorario(id, estadoActual) {
  try {
    // Primero obtenemos el horario actual
    const horario = await getAgendaById(id);
    
    if (!horario) throw new Error("Horario no encontrado");

    // Actualizamos el estado
    const payload = {
      ...horario,
      activo: !estadoActual
    };

    const res = await api.put(`/horario/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("Error cambiando estado del horario:", error);
    throw error;
  }
}

/* =========================================
   VERIFICAR DISPONIBILIDAD
========================================= */
export function verificarDisponibilidad(horarios, empleadoId, fecha, hora) {
  const fechaObj = new Date(fecha);
  const diaSemana = fechaObj.getDay(); // 0 = domingo, 1 = lunes, ...
  
  // Ajustar: en la API 0 = lunes, pero getDay() da 0 = domingo
  // Convertir: domingo(0) → 6, lunes(1) → 0, martes(2) → 1, etc.
  const diaApi = diaSemana === 0 ? 6 : diaSemana - 1;
  
  // Buscar horario del empleado para ese día
  const horarioDelDia = horarios.find(h => 
    h.empleado_id === empleadoId && 
    h.dia === diaApi &&
    h.activo === true
  );
  
  if (!horarioDelDia) return false;
  
  // Verificar que la hora esté dentro del rango
  // Las horas vienen como "08:00:00", comparamos solo HH:MM
  const horaComparar = hora.substring(0,5);
  const inicio = horarioDelDia.hora_inicio.substring(0,5);
  const fin = horarioDelDia.hora_final.substring(0,5);
  
  return horaComparar >= inicio && horaComparar <= fin;
}

/* =========================================
   OBTENER EMPLEADOS (desde su propio endpoint)
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
   OBTENER CITAS
========================================= */
export async function getCitas() {
  try {
    const res = await api.get("/citas");
    return res.data;
  } catch (error) {
    console.error("Error cargando citas:", error);
    return [];
  }
}

/* =========================================
   OBTENER ESTADOS DE CITA
========================================= */
export async function getEstadosCita() {
  try {
    const res = await api.get("/estado-cita");
    return res.data;
  } catch (error) {
    console.error("Error cargando estados:", error);
    return [];
  }
}