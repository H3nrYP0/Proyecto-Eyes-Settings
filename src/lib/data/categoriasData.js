// Base de datos temporal de categorías
let categoriasDB = [
  {
    id: 1,
    nombre: "Monturas",
    descripcion: "Armazones y monturas para lentes oftálmicos",
    estado: "activa",
  },
  {
    id: 2,
    nombre: "Lentes de Sol",
    descripcion: "Gafas de sol con protección UV",
    estado: "activa",
  },
  {
    id: 3,
    nombre: "Lentes de Contacto",
    descripcion: "Lentes blandos y rígidos",
    estado: "activa",
  },
  {
    id: 4,
    nombre: "Accesorios",
    descripcion: "Estuches, paños y productos de limpieza",
    estado: "activa",
  },
];

// Obtener todas las categorías
export function getAllCategorias() {
  return [...categoriasDB];
}

// Obtener por ID
export function getCategoriaById(id) {
  return categoriasDB.find((c) => c.id === id);
}

// Crear categoría
export function createCategoria(data) {
  const newId = categoriasDB.length ? categoriasDB.at(-1).id + 1 : 1;
  const nuevaCategoria = { 
    id: newId, 
    ...data 
  };
  
  categoriasDB.push(nuevaCategoria);
  return nuevaCategoria;
}

// Actualizar categoría
export function updateCategoria(id, updated) {
  const index = categoriasDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    categoriasDB[index] = { ...categoriasDB[index], ...updated };
  }
  return categoriasDB;
}

// Eliminar categoría
export function deleteCategoria(id) {
  categoriasDB = categoriasDB.filter((c) => c.id !== id);
  return categoriasDB;
}

// Cambiar estado
export function updateEstadoCategoria(id) {
  categoriasDB = categoriasDB.map((c) =>
    c.id === id
      ? { 
          ...c, 
          estado: c.estado === "activa" ? "inactiva" : "activa" 
        }
      : c
  );
  return categoriasDB;
}