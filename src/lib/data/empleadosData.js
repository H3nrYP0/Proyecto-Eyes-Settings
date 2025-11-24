// Base de datos temporal de empleados
let empleadosDB = [
  {
    id: 1,
    nombre: "Dr. Carlos Méndez",
    tipo_documento: "cedula",
    numero_documento: "123456789",
    telefono: "3001234567",
    email: "carlos.mendez@optica.com",
    cargo: "Optómetra",
    fecha_ingreso: "2023-01-15",
    direccion: "Calle 123 #45-67, Bogotá",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Dra. Ana Rodríguez",
    tipo_documento: "cedula",
    numero_documento: "987654321",
    telefono: "3109876543",
    email: "ana.rodriguez@optica.com",
    cargo: "Optómetra",
    fecha_ingreso: "2023-03-20",
    direccion: "Av. Principal #89-10, Bogotá",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Técnico Javier López",
    tipo_documento: "cedula",
    numero_documento: "456789123",
    telefono: "3204567891",
    email: "javier.lopez@optica.com",
    cargo: "Técnico",
    fecha_ingreso: "2023-02-10",
    direccion: "Carrera 56 #78-90, Bogotá",
    estado: "activo",
  },
];

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