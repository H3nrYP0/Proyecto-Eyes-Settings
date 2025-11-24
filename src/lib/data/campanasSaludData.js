// Base de datos temporal de campañas de salud
let campanasSaludDB = [
  {
    id: 1,
    nombre: "Chequeo Visual Gratuito",
    descripcion: "Campaña de exámenes visuales sin costo",
    fechaInicio: "2024-02-01",
    fechaFin: "2024-02-29",
    descuento: 100,
    estado: "proxima",
  },
  {
    id: 2,
    nombre: "Descuento en Lentes de Sol",
    descripcion: "Promoción especial en lentes de sol Ray-Ban",
    fechaInicio: "2024-01-15",
    fechaFin: "2024-01-31",
    descuento: 20,
    estado: "activa",
  },
  {
    id: 3,
    nombre: "Campaña Escolar",
    descripcion: "Descuentos especiales para estudiantes",
    fechaInicio: "2024-01-10",
    fechaFin: "2024-01-25",
    descuento: 15,
    estado: "finalizada",
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