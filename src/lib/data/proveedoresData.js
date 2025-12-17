// Base de datos temporal de proveedores - ACTUALIZADA
let proveedoresDB = [
  {
    id: 1,
    tipo_proveedor: "Persona Jurídica",
    tipoDocumento: "NIT",
    documento: "9001234567",
    razon_social_o_Nombre: "Optical Supplies S.A.S.",
    Contacto: "Juan Pérez",
    telefono: "3001234567",
    correo: "juan@optical.com",
    departamento: "Bogotá D.C.",
    municipio: "Bogotá D.C.",
    direccion: "Calle 123 #45-67, Barrio Centro",
    estado: true
  },
  {
    id: 2,
    tipo_proveedor: "Persona Natural",
    tipoDocumento: "NIT",
    documento: "8009876543",
    razon_social_o_Nombre: "Lentes Premium Ltda",
    Contacto: "María García",
    telefono: "3109876543",
    correo: "maria@lentespremium.com",
    departamento: "Antioquia",
    municipio: "Medellín",
    direccion: "Av. Principal #89-10, Poblado",
    estado: true
  },
  {
    id: 3,
    tipo_proveedor: "Persona Jurídica",
    tipoDocumento: "NIT",
    documento: "9015557890",
    razon_social_o_Nombre: "Cristales Ópticos S.A.",
    Contacto: "Carlos Rodríguez",
    telefono: "3205557890",
    correo: "carlos@cristalesopticos.com",
    departamento: "Valle del Cauca",
    municipio: "Cali",
    direccion: "Carrera 50 #25-80, Granada",
    estado: false
  },
  {
    id: 4,
    tipo_proveedor: "Persona Natural",
    tipoDocumento: "NIT",
    documento: "7003332221",
    razon_social_o_Nombre: "Accesorios Visuales",
    Contacto: "Ana Martínez",
    telefono: "3153332222",
    correo: "ana@accesoriosvisuales.com",
    departamento: "Atlántico",
    municipio: "Barranquilla",
    direccion: "Calle 80 #12-34, Norte Centro Histórico",
    estado: true
  }
];

// Función para obtener el próximo ID disponible
function getNextId() {
  if (proveedoresDB.length === 0) return 1;
  const maxId = Math.max(...proveedoresDB.map(p => p.id));
  return maxId + 1;
}

// Obtener todos los proveedores
export function getAllProveedores() {
  // Convertir estado booleano a string para la UI si es necesario
  return proveedoresDB.map(proveedor => ({
    ...proveedor,
    estado: proveedor.estado ? "Activo" : "Inactivo",
    tipo: proveedor.tipo_proveedor,
    razonSocial: proveedor.razon_social_o_Nombre,
    contacto: proveedor.Contacto,
    nit: proveedor.documento,
    ciudad: proveedor.municipio
  }));
}

// Obtener por ID
export function getProveedorById(id) {
  const proveedor = proveedoresDB.find((p) => p.id === Number(id));
  if (!proveedor) return null;
  
  // Convertir a formato compatible con el formulario anterior
  return {
    ...proveedor,
    tipo: proveedor.tipo_proveedor,
    razonSocial: proveedor.razon_social_o_Nombre,
    contacto: proveedor.Contacto,
    nit: proveedor.documento,
    ciudad: proveedor.municipio,
    estado: proveedor.estado ? "Activo" : "Inactivo",
    // Para compatibilidad con los nuevos campos
    tipoDocumento: proveedor.tipoDocumento || 'NIT',
    documento: proveedor.documento,
    contacto_nombre: proveedor.Contacto,
    razon_social: proveedor.razon_social_o_Nombre,
    departamento: proveedor.departamento,
    municipio: proveedor.municipio
  };
}

// Crear proveedor (nuevo formato)
export function createProveedor(data) {
  const newId = getNextId();
  
  // Asegurar que los campos tengan el formato correcto para la BD
  const nuevoProveedor = {
    id: newId,
    tipo_proveedor: data.tipo_proveedor || data.tipo || 'Persona Jurídica',
    tipoDocumento: data.tipoDocumento || 'NIT',
    documento: data.documento || data.nit || '',
    razon_social_o_Nombre: data.razon_social_o_Nombre || data.razon_social || data.razonSocial || '',
    Contacto: data.Contacto || data.contacto_nombre || data.contacto || '',
    telefono: data.telefono || '',
    correo: data.correo || '',
    departamento: data.departamento || '',
    municipio: data.municipio || data.ciudad || '',
    direccion: data.direccion || '',
    estado: data.estado === undefined ? true : data.estado
  };
  
  proveedoresDB.push(nuevoProveedor);
  return nuevoProveedor;
}

// Actualizar proveedor (compatible con ambos formatos)
export function updateProveedor(id, updatedData) {
  const index = proveedoresDB.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  
  // Convertir datos del formulario al formato de la BD
  const datosActualizados = {
    tipo_proveedor: updatedData.tipo_proveedor || updatedData.tipo || proveedoresDB[index].tipo_proveedor,
    tipoDocumento: updatedData.tipoDocumento || proveedoresDB[index].tipoDocumento,
    documento: updatedData.documento || updatedData.nit || proveedoresDB[index].documento,
    razon_social_o_Nombre: updatedData.razon_social_o_Nombre || updatedData.razon_social || updatedData.razonSocial || proveedoresDB[index].razon_social_o_Nombre,
    Contacto: updatedData.Contacto || updatedData.contacto_nombre || updatedData.contacto || proveedoresDB[index].Contacto,
    telefono: updatedData.telefono || proveedoresDB[index].telefono,
    correo: updatedData.correo || proveedoresDB[index].correo,
    departamento: updatedData.departamento || proveedoresDB[index].departamento,
    municipio: updatedData.municipio || updatedData.ciudad || proveedoresDB[index].municipio,
    direccion: updatedData.direccion || proveedoresDB[index].direccion,
    estado: updatedData.estado === undefined ? 
      (updatedData.estado === 'Activo' ? true : 
       updatedData.estado === 'Inactivo' ? false : 
       proveedoresDB[index].estado) : 
      updatedData.estado
  };
  
  proveedoresDB[index] = { 
    ...proveedoresDB[index], 
    ...datosActualizados 
  };
  
  return proveedoresDB[index];
}

// =================================================
// FUNCIONES CORREGIDAS - ESTAS SON LAS QUE FALLABAN
// =================================================

// Eliminar proveedor - CORREGIDA
export function deleteProveedor(id) {
  proveedoresDB = proveedoresDB.filter((p) => p.id !== Number(id));
  // CORRECCIÓN: Devuelve el array completo formateado, no solo el objeto eliminado
  return getAllProveedores();
}

// Cambiar estado - CORREGIDA
export function updateEstadoProveedor(id) {
  const index = proveedoresDB.findIndex((p) => p.id === Number(id));
  if (index === -1) return getAllProveedores(); // CORRECCIÓN: Devuelve array
  
  // Cambiar el estado
  proveedoresDB[index].estado = !proveedoresDB[index].estado;
  
  // CORRECCIÓN: Devuelve el array completo formateado, no solo el objeto actualizado
  return getAllProveedores();
}

// =================================================
// FUNCIONES ADICIONALES (sin cambios necesarios)
// =================================================

// Función para búsqueda de proveedores
export function searchProveedores(query) {
  const searchTerm = query.toLowerCase();
  return proveedoresDB.filter(proveedor => 
    proveedor.razon_social_o_Nombre.toLowerCase().includes(searchTerm) ||
    proveedor.documento.includes(searchTerm) ||
    proveedor.Contacto.toLowerCase().includes(searchTerm) ||
    proveedor.correo.toLowerCase().includes(searchTerm)
  ).map(proveedor => ({
    ...proveedor,
    estado: proveedor.estado ? "Activo" : "Inactivo",
    tipo: proveedor.tipo_proveedor,
    razonSocial: proveedor.razon_social_o_Nombre,
    contacto: proveedor.Contacto,
    nit: proveedor.documento,
    ciudad: proveedor.municipio
  }));
}

// Función para obtener proveedores activos
export function getProveedoresActivos() {
  return proveedoresDB
    .filter(p => p.estado)
    .map(proveedor => ({
      ...proveedor,
      estado: "Activo",
      tipo: proveedor.tipo_proveedor,
      razonSocial: proveedor.razon_social_o_Nombre,
      contacto: proveedor.Contacto,
      nit: proveedor.documento,
      ciudad: proveedor.municipio
    }));
}

// Función para obtener estadísticas
export function getProveedoresStats() {
  const total = proveedoresDB.length;
  const activos = proveedoresDB.filter(p => p.estado).length;
  const inactivos = total - activos;
  
  return {
    total,
    activos,
    inactivos,
    porcentajeActivos: total > 0 ? (activos / total * 100).toFixed(1) : 0
  };
}