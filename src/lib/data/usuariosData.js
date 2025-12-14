// Base de datos temporal de usuarios - VERSIÓN ACTUALIZADA
let usuariosDB = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@visualoutlet.com",
    password: "password123",
    telefono: "3001234567",
    fechaNacimiento: "1985-05-15",
    tipoDocumento: "cedula",
    numeroDocumento: "123456789",
    rol: "Administrador",
    fechaRegistro: "2024-01-15",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "María González",
    email: "maria@visualoutlet.com",
    password: "password123",
    telefono: "3109876543",
    fechaNacimiento: "1990-08-22",
    tipoDocumento: "cedula",
    numeroDocumento: "987654321",
    rol: "Vendedor",
    fechaRegistro: "2024-01-10",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Dr. Carlos Méndez",
    email: "carlos@visualoutlet.com",
    password: "password123",
    telefono: "3204567890",
    fechaNacimiento: "1982-03-10",
    tipoDocumento: "cedula",
    numeroDocumento: "456789123",
    rol: "Optómetra",
    fechaRegistro: "2024-01-08",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Técnico Javier López",
    email: "javier@visualoutlet.com",
    password: "password123",
    telefono: "3157891234",
    fechaNacimiento: "1988-11-30",
    tipoDocumento: "cedula",
    numeroDocumento: "654321987",
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

// Crear usuario - VERSIÓN COMPLETA
export function createUsuario(data) {
  const newId = usuariosDB.length ? usuariosDB.at(-1).id + 1 : 1;
  
  // Estructura completa con todos los nuevos campos
  const nuevoUsuario = {
    id: newId,
    nombre: data.nombre || '',
    email: data.email || '',
    password: data.password || '',
    telefono: data.telefono || '',
    fechaNacimiento: data.fechaNacimiento || '',
    tipoDocumento: data.tipoDocumento || 'cedula',
    numeroDocumento: data.numeroDocumento || '',
    rol: 'Vendedor', // Rol por defecto
    fechaRegistro: new Date().toISOString().split('T')[0],
    estado: data.estado || 'activo'
  };
  
  console.log('📝 Creando usuario completo:', nuevoUsuario);
  
  usuariosDB.push(nuevoUsuario);
  
  // Mostrar todos los usuarios para depuración
  console.log('📋 Base de datos actual:', usuariosDB);
  
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

// Buscar usuario por email (nueva función útil)
export function getUsuarioByEmail(email) {
  return usuariosDB.find((u) => u.email === email);
}