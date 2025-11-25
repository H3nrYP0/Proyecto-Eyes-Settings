// Base de datos temporal de proveedores
let proveedoresDB = [
  {
    id: 1,
    tipo: "Persona Jurídica",
    razonSocial: "Optical Supplies S.A.S.",
    nit: "900123456-7",
    contacto: "Juan Pérez",
    telefono: "+57 300 123 4567",
    correo: "juan@optical.com",
    ciudad: "Bogotá",
    direccion: "Calle 123 #45-67",
    estado: "Activo"
  },
  {
    id: 2,
    tipo: "Persona Natural",
    razonSocial: "Lentes Premium Ltda",
    nit: "800987654-3",
    contacto: "María García",
    telefono: "+57 310 987 6543",
    correo: "maria@lentespremium.com",
    ciudad: "Medellín",
    direccion: "Av. Principal #89-10",
    estado: "Activo"
  },
  {
    id: 3,
    tipo: "Persona Jurídica",
    razonSocial: "Cristales Ópticos S.A.",
    nit: "901555789-0",
    contacto: "Carlos Rodríguez",
    telefono: "+57 320 555 7890",
    correo: "carlos@cristalesopticos.com",
    ciudad: "Cali",
    direccion: "Carrera 50 #25-80",
    estado: "Inactivo"
  },
  {
    id: 4,
    tipo: "Persona Natural",
    razonSocial: "Accesorios Visuales",
    nit: "700333222-1",
    contacto: "Ana Martínez",
    telefono: "+57 315 333 2222",
    correo: "ana@accesoriosvisuales.com",
    ciudad: "Barranquilla",
    direccion: "Calle 80 #12-34",
    estado: "Activo"
  }
];

// Obtener todos los proveedores
export function getAllProveedores() {
  return [...proveedoresDB];
}

// Obtener por ID
export function getProveedorById(id) {
  return proveedoresDB.find((p) => p.id === id);
}

// Crear proveedor
export function createProveedor(data) {
  const newId = proveedoresDB.length ? proveedoresDB.at(-1).id + 1 : 1;
  const nuevoProveedor = { 
    id: newId,
    ...data 
  };
  
  proveedoresDB.push(nuevoProveedor);
  return nuevoProveedor;
}

// Actualizar proveedor
export function updateProveedor(id, updated) {
  const index = proveedoresDB.findIndex((p) => p.id === id);
  if (index !== -1) {
    proveedoresDB[index] = { ...proveedoresDB[index], ...updated };
  }
  return proveedoresDB;
}

// Eliminar proveedor
export function deleteProveedor(id) {
  proveedoresDB = proveedoresDB.filter((p) => p.id !== id);
  return proveedoresDB;
}

// Cambiar estado
export function updateEstadoProveedor(id) {
  proveedoresDB = proveedoresDB.map((p) =>
    p.id === id
      ? { 
          ...p, 
          estado: p.estado === "Activo" ? "Inactivo" : "Activo" 
        }
      : p
  );
  return proveedoresDB;
}