// Base de datos temporal de empleados
let empleadosDB = [
  {
    id: 1,
    tipoDocumento: "Cédula",
    numero_documento: "123456789",
    nombre: "Carlos Méndez",
    telefono: "3001112233",
    direccion: "Calle 123 #45-67",
    fecha_ingreso: "2023-01-15",
    cargo: "Optometrista",
    estado: "activo",
  },
  {
    id: 2,
    tipoDocumento: "Cédula",
    numero_documento: "987654321",
    nombre: "Ana Rodríguez",
    telefono: "3104445566",
    direccion: "Avenida 456 #78-90",
    fecha_ingreso: "2023-03-20",
    cargo: "Optometrista",
    estado: "activo",
  },
  {
    id: 3,
    tipoDocumento: "Cédula",
    numero_documento: "456789123",
    nombre: "Javier López",
    telefono: "3207778899",
    direccion: "Carrera 789 #12-34",
    fecha_ingreso: "2023-02-10",
    cargo: "Técnico",
    estado: "activo",
  },
];

// Listas para selects
export const tiposDocumento = ["Cédula", "Pasaporte", "Cédula Extranjería"];
export const cargosList = ["Optometrista", "Técnico", "Administrativo", "Vendedor", "Gerente"];
export const generosList = ["Masculino", "Femenino", "Otro"];

// Obtener todos los empleados
export function getAllEmpleados() {
  return [...empleadosDB];
}

// Obtener por ID
export function getEmpleadoById(id) {
  return empleadosDB.find((e) => e.id === id);
}

// Crear empleado
export function createEmpleado(data) {
  const newId = empleadosDB.length ? empleadosDB.at(-1).id + 1 : 1;
  const nuevoEmpleado = { 
    id: newId, 
    ...data 
  };
  
  empleadosDB.push(nuevoEmpleado);
  return nuevoEmpleado;
}

// Actualizar empleado
export function updateEmpleado(id, updated) {
  const index = empleadosDB.findIndex((e) => e.id === id);
  if (index !== -1) {
    empleadosDB[index] = { ...empleadosDB[index], ...updated };
  }
  return empleadosDB;
}

// Eliminar empleado
export function deleteEmpleado(id) {
  empleadosDB = empleadosDB.filter((e) => e.id !== id);
  return empleadosDB;
}

// Cambiar estado
export function updateEstadoEmpleado(id) {
  empleadosDB = empleadosDB.map((e) =>
    e.id === id
      ? { 
          ...e, 
          estado: e.estado === "activo" ? "inactivo" : "activo" 
        }
      : e
  );
  return empleadosDB;
}