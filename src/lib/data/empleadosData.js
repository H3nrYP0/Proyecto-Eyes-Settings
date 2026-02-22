import api from "../axios";

// ============================
// Obtener todos los empleados
// ============================
export async function getAllEmpleados() {
  const res = await api.get("/empleados");
  return res.data;
}

// ============================
// Obtener empleado por ID
// ============================
export async function getEmpleadoById(id) {
  try {
    const res = await api.get(`/empleados/${id}`);
    return res.data;
  } catch (error) {
    console.warn("Error al obtener empleado por ID, obteniendo de la lista completa");
    const todos = await getAllEmpleados();
    const empleado = todos.find(e => e.id === id);
    return empleado || null;
  }
}

// ============================
// Crear empleado
// ============================
export async function createEmpleado(data) {
  const payload = {
    nombre: data.nombre,
    tipo_documento: data.tipoDocumento,
    numero_documento: data.numero_documento,
    telefono: data.telefono,
    correo: data.correo,
    direccion: data.direccion,
    fecha_ingreso: data.fecha_ingreso,
    cargo: data.cargo,
    estado: data.estado === "activo"
  };

  const res = await api.post("/empleados", payload);
  return res.data;
}

// ============================
// Actualizar empleado
// ============================
export async function updateEmpleado(id, data) {
  const payload = {
    nombre: data.nombre,
    tipo_documento: data.tipoDocumento,
    numero_documento: data.numero_documento,
    telefono: data.telefono,
    correo: data.correo,
    direccion: data.direccion,
    fecha_ingreso: data.fecha_ingreso,
    cargo: data.cargo,
    estado: data.estado === "activo"
  };

  const res = await api.put(`/empleados/${id}`, payload);
  return res.data;
}

// ============================
// Eliminar empleado
// ============================
export async function deleteEmpleado(id) {
  const res = await api.delete(`/empleados/${id}`);
  return res.data;
}

// ============================
// Cambiar estado empleado
// ============================
export async function updateEstadoEmpleado(id, nuevoEstado) {
  const payload = {
    estado: nuevoEstado === "activo" // ✅ correcto
  };

  const res = await api.put(`/empleados/${id}`, payload);
  return res.data;
}