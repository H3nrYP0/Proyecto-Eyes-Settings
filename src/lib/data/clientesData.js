import api from "../axios";

// ============================
// Obtener todos los clientes
// ============================
export async function getAllClientes() {
  const res = await api.get("/clientes");
  return res.data;
}

// ============================
// Obtener cliente por ID
// ============================
export async function getClienteById(id) {
  try {
    const res = await api.get(`/clientes/${id}`);
    return res.data;
  } catch (error) {
    console.warn("Error al obtener cliente por ID, obteniendo de la lista completa");
    const todos = await getAllClientes();
    const cliente = todos.find(c => c.id === id);
    return cliente || null;
  }
}

// ============================
// Crear cliente
// ============================
export async function createCliente(data) {
  // Mapeo correcto de campos con valores cortos para tipo_documento
  const payload = {
    nombre: data.nombre,
    apellido: data.apellido,
    // Mapear a valores cortos (máx 4 caracteres)
    tipo_documento: data.tipoDocumento === "cedula" ? "CC" : 
                    data.tipoDocumento === "cedula_extranjeria" ? "CE" : 
                    data.tipoDocumento === "pasaporte" ? "PA" : "OTRO",
    numero_documento: data.documento,
    fecha_nacimiento: data.fechaNacimiento,
    genero: data.genero,
    telefono: data.telefono || "",
    correo: data.correo || "",
    municipio: data.ciudad,
    direccion: data.direccion || "",
    ocupacion: "",
    telefono_emergencia: "",
    estado: true
  };

  console.log("Enviando payload al backend:", payload);

  const res = await api.post("/clientes", payload);
  return res.data;
}

// ============================
// Actualizar cliente
// ============================
export async function updateCliente(id, data) {
  const payload = {
    nombre: data.nombre,
    apellido: data.apellido,
    tipo_documento: data.tipoDocumento === "cedula" ? "CC" : 
                    data.tipoDocumento === "cedula_extranjeria" ? "CE" : 
                    data.tipoDocumento === "pasaporte" ? "PA" : "OTRO",
    numero_documento: data.documento,
    fecha_nacimiento: data.fechaNacimiento,
    genero: data.genero,
    telefono: data.telefono || "",
    correo: data.correo || "",
    municipio: data.ciudad,
    direccion: data.direccion || "",
    ocupacion: "",
    telefono_emergencia: ""
  };

  console.log("Actualizando cliente con payload:", payload);

  const res = await api.put(`/clientes/${id}`, payload);
  return res.data;
}

// ============================
// Eliminar cliente
// ============================
export async function deleteCliente(id) {
  const res = await api.delete(`/clientes/${id}`);
  return res.data;
}

// ============================
// Cambiar estado cliente
// ============================
export async function updateEstadoCliente(id, nuevoEstado) {
  const estadoBooleano = typeof nuevoEstado === "string" 
    ? nuevoEstado === "activo" 
    : nuevoEstado;

  const payload = {
    estado: estadoBooleano
  };

  const res = await api.put(`/clientes/${id}`, payload);
  return res.data;
}