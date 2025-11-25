// Base de datos temporal de usuarios
let usuariosDB = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@visualoutlet.com",
    password: "password123",
    rol: "Administrador",
    fechaRegistro: "2024-01-15",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@visualoutlet.com",
    password: "password123",
    rol: "Vendedor",
    fechaRegistro: "2024-01-10",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Dr. Carlos Méndez",
    email: "carlos@visualoutlet.com",
    password: "password123",
    rol: "Optómetra",
    fechaRegistro: "2024-01-08",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Técnico Javier López",
    email: "javier@visualoutlet.com",
    password: "password123",
    rol: "Técnico",
    fechaRegistro: "2024-01-05",
    estado: "inactivo",
  },
];

// Obtener todos los usuarios
export function getAllUsuarios() {
  return [...usuariosDB];
}

// Obtener por ID
export function getUsuarioById(id) {
  return usuariosDB.find((u) => u.id === id);
}

// Crear usuario
export function createUsuario(data) {
  const newId = usuariosDB.length ? usuariosDB.at(-1).id + 1 : 1;
  const nuevoUsuario = { 
    id: newId, 
    fechaRegistro: new Date().toISOString().split('T')[0],
    ...data 
  };
  
  usuariosDB.push(nuevoUsuario);
  return nuevoUsuario;
}

// Actualizar usuario
export function updateUsuario(id, updated) {
  const index = usuariosDB.findIndex((u) => u.id === id);
  if (index !== -1) {
    usuariosDB[index] = { ...usuariosDB[index], ...updated };
  }
  return usuariosDB;
}

// Eliminar usuario
export function deleteUsuario(id) {
  usuariosDB = usuariosDB.filter((u) => u.id !== id);
  return usuariosDB;
}

// Cambiar estado
export function updateEstadoUsuario(id) {
  usuariosDB = usuariosDB.map((u) =>
    u.id === id
      ? { 
          ...u, 
          estado: u.estado === "activo" ? "inactivo" : "activo" 
        }
      : u
  );
  return usuariosDB;
}