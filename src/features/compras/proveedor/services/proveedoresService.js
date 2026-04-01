import api from "../../../../lib/axios";

// ============================
// Obtener todos los proveedores
// ============================
export async function getAllProveedores() {
  const res = await api.get("/proveedores");
  return res.data;
}

// ============================
// Obtener proveedores activos
// ============================
export async function getProveedoresActivos() {
  const proveedores = await getAllProveedores();
  return proveedores.filter(p => p.estado === true);
}

// ============================
// Obtener proveedor por ID
// ============================
export async function getProveedorById(id) {
  try {
    const res = await api.get(`/proveedores/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    return null;
  }
}

// ============================
// Crear proveedor
// ============================
export async function createProveedor(data) {
  const payload = {
    tipo_proveedor: data.tipoProveedor,
    tipo_documento: data.tipoDocumento,
    documento: data.documento,
    razon_social_o_nombre: data.razonSocial,
    contacto: data.contactoNombre,
    telefono: data.telefono,
    correo: data.correo,
    departamento: data.departamento,
    municipio: data.municipio,
    direccion: data.direccion,
    estado: data.estado === true,
  };
  const res = await api.post("/proveedores", payload);
  return res.data;
}

// ============================
// Actualizar proveedor
// ============================
export async function updateProveedor(id, data) {
  const payload = {
    tipo_proveedor: data.tipoProveedor,
    tipo_documento: data.tipoDocumento,
    documento: data.documento,
    razon_social_o_nombre: data.razonSocial,
    contacto: data.contactoNombre,
    telefono: data.telefono,
    correo: data.correo,
    departamento: data.departamento,
    municipio: data.municipio,
    direccion: data.direccion,
    estado: data.estado === true,
  };
  const res = await api.put(`/proveedores/${id}`, payload);
  return res.data;
}

// ============================
// Cambiar estado del proveedor
// ============================
export async function toggleEstadoProveedor(id, nuevoEstado) {
  const payload = { estado: nuevoEstado };
  const res = await api.put(`/proveedores/${id}`, payload);
  return res.data;
}

// ============================
// Eliminar proveedor
// ============================
export async function deleteProveedor(id) {
  const res = await api.delete(`/proveedores/${id}`);
  return res.data;
}