let clientesDB = [];

// ==============================
// OBTENER TODOS
// ==============================
export function getAllClientes() {
  return [...clientesDB];
}

// ==============================
// OBTENER POR ID
// ==============================
export function getClienteById(id) {
  return clientesDB.find((c) => c.id === id);
}

// ==============================
// CREAR
// ==============================
export function createCliente(data) {
  const id = Date.now();

  const nuevo = {
    id,
    estado: true,
    ...data,
  };

  clientesDB.push(nuevo);
  return nuevo;
}

// ==============================
// ACTUALIZAR DATOS
// ==============================
export function updateCliente(id, updated) {
  const index = clientesDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    clientesDB[index] = { ...clientesDB[index], ...updated };
    return clientesDB[index];
  }
  return null;
}

// ==============================
// CAMBIAR ESTADO
// ==============================
export function updateEstadoCliente(id, nuevoEstado) {
  const cliente = clientesDB.find((c) => c.id === id);

  if (cliente) {
    cliente.estado = nuevoEstado; // true o false
    return cliente;
  }

  return null;
}

// ==============================
// ELIMINAR
// ==============================
export function deleteCliente(id) {
  clientesDB = clientesDB.filter((c) => c.id !== id);
}
