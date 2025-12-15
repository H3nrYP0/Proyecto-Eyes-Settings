// Base de datos temporal de campañas de salud
// Adaptado a la tabla SQL aprobada, manteniendo los estados como strings
let campanasSaludDB = [
  {
    id: 1,
    empleadoId: 1,
    empresa: "Colegio San José",
    contacto: "3001234567",
    fecha: "2025-12-23",
    hora: "10:00",
    direccion: "Calle 123 #45-67",
    estado: "proxima",
    observaciones: "Chequeo visual gratuito para estudiantes"
  },
  {
    id: 2,
    empleadoId: 2,
    empresa: "Empresa ABC Ltda",
    contacto: "3109876543",
    fecha: "2026-02-23",
    hora: "14:30",
    direccion: "Av. Principal #89-10",
    estado: "activa",
    observaciones: "Campaña para empleados"
  },
  {
    id: 3,
    empleadoId: 3,
    empresa: "Universidad Central",
    contacto: "3204567891",
    fecha: "2025-03-10",
    hora: "09:00",
    direccion: "Carrera 56 #78-90",
    estado: "finalizada",
    observaciones: "Evento ya realizado"
  },
];

// Obtener todas las campañas
export function getAllCampanasSalud() {
  return [...campanasSaludDB];
}

// Obtener por ID
export function getCampanaSaludById(id) {
  return campanasSaludDB.find((c) => c.id === id);
}

// Crear campaña
export function createCampanaSalud(data) {
  const newId = campanasSaludDB.length ? campanasSaludDB.at(-1).id + 1 : 1;
  const nuevaCampana = { 
    id: newId, 
    ...data 
  };
  
  campanasSaludDB.push(nuevaCampana);
  return nuevaCampana;
}

// Actualizar campaña
export function updateCampanaSalud(id, updated) {
  const index = campanasSaludDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    campanasSaludDB[index] = { ...campanasSaludDB[index], ...updated };
  }
  return campanasSaludDB;
}

// Eliminar campaña
export function deleteCampanaSalud(id) {
  campanasSaludDB = campanasSaludDB.filter((c) => c.id !== id);
  return campanasSaludDB;
}

// Cambiar estado
export function updateEstadoCampanaSalud(id) {
  campanasSaludDB = campanasSaludDB.map((c) =>
    c.id === id
      ? { 
          ...c, 
          estado: c.estado === "proxima" ? "activa" : 
                 c.estado === "activa" ? "finalizada" : 
                 c.estado === "finalizada" ? "inactiva" : "proxima"
        }
      : c
  );
  return campanasSaludDB;
}