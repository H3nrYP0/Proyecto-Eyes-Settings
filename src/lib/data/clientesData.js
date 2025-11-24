// Base de datos temporal de clientes
let clientesDB = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "cedula",
    documento: "123456789",
    telefono: "3001234567",
    correo: "juan.perez@email.com",
    ciudad: "Bogotá",
    direccion: "Calle 123 #45-67",
    fechaNacimiento: "1990-05-15",
    genero: "masculino",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    tipoDocumento: "cedula",
    documento: "987654321",
    telefono: "3109876543",
    correo: "maria.gonzalez@email.com",
    ciudad: "Medellín",
    direccion: "Carrera 56 #78-90",
    fechaNacimiento: "1985-08-22",
    genero: "femenino",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Rodríguez",
    tipoDocumento: "cedula",
    documento: "456789123",
    telefono: "3204567891",
    correo: "carlos.rodriguez@email.com",
    ciudad: "Cali",
    direccion: "Avenida 7 #23-45",
    fechaNacimiento: "1992-12-10",
    genero: "masculino",
  },
];

// Obtener todos los clientes
export function getAllClientes() {
  return [...clientesDB];
}

// Obtener por ID
export function getClienteById(id) {
  return clientesDB.find((c) => c.id === id);
}

// Crear cliente
export function createCliente(data) {
  const newId = clientesDB.length ? clientesDB.at(-1).id + 1 : 1;
  const nuevoCliente = { 
    id: newId, 
    ...data 
  };
  
  clientesDB.push(nuevoCliente);
  return nuevoCliente;
}

// Actualizar cliente
export function updateCliente(id, updated) {
  const index = clientesDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    clientesDB[index] = { ...clientesDB[index], ...updated };
  }
  return clientesDB;
}

// Eliminar cliente
export function deleteCliente(id) {
  clientesDB = clientesDB.filter((c) => c.id !== id);
  return clientesDB;
}