// Base de datos temporal de marcas
let marcasDB = [
  {
    id: 1,
    nombre: "Ray-Ban",
    descripcion: "Marca líder en lentes de sol y monturas de alta gama",
    estado: "activa"
  },
  {
    id: 2,
    nombre: "Oakley",
    descripcion: "Especialistas en lentes deportivos y de alto rendimiento",
    estado: "activa"
  },
  {
    id: 3,
    nombre: "Essilor",
    descripcion: "Líder mundial en lentes oftálmicos y tecnología visual",
    estado: "activa"
  },
  {
    id: 4,
    nombre: "Johnson & Johnson",
    descripcion: "Marca confiable en lentes de contacto y productos de cuidado visual",
    estado: "activa"
  },
  {
    id: 5,
    nombre: "Nikon",
    descripcion: "Tecnología avanzada en lentes oftálmicos",
    estado: "inactiva"
  }
];

// Obtener todas las marcas
export function getAllMarcas() {
  return [...marcasDB];
}

// Obtener por ID
export function getMarcaById(id) {
  return marcasDB.find((m) => m.id === id);
}

// Crear marca
export function createMarca(data) {
  const newId = marcasDB.length ? marcasDB.at(-1).id + 1 : 1;
  const nuevaMarca = { 
    id: newId,
    ...data 
  };
  
  marcasDB.push(nuevaMarca);
  return nuevaMarca;
}

// Actualizar marca
export function updateMarca(id, updated) {
  const index = marcasDB.findIndex((m) => m.id === id);
  if (index !== -1) {
    marcasDB[index] = { ...marcasDB[index], ...updated };
  }
  return marcasDB;
}

// Eliminar marca
export function deleteMarca(id) {
  marcasDB = marcasDB.filter((m) => m.id !== id);
  return marcasDB;
}

// Cambiar estado
export function updateEstadoMarca(id) {
  marcasDB = marcasDB.map((m) =>
    m.id === id
      ? { 
          ...m, 
          estado: m.estado === "activa" ? "inactiva" : "activa" 
        }
      : m
  );
  return marcasDB;
}