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
  const res = await api.get("/empleados");
  const empleados = res.data || [];
  return empleados.find((e) => e.id === id);
}

// ============================
// Crear empleado
// ============================
export async function createEmpleado(data) {
  // Adaptar de camelCase a snake_case para el backend
  const payload = {
    nombre: data.nombre,
    tipo_documento: data.tipoDocumento,
    numero_documento: data.numero_documento,
    telefono: data.telefono,
    correo: data.correo, // Si el backend tiene campo correo
    direccion: data.direccion,
    fecha_ingreso: data.fecha_ingreso,
    cargo: data.cargo,
    estado: data.estado === "activo" // Convertir a boolean
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
    estado: nuevoEstado === "activo" // true / false
  };

  const res = await api.put(`/empleados/${id}`, payload);
  return res.data;
}