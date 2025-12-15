// Base de datos temporal de servicios - ACTUALIZADA
let serviciosDB = [
  {
    id: 1,
    nombre: "Cita general",
    descripcion: "Consulta optométrica completa para evaluación visual",
    duracion_min: 30,
    precio: 50000,
    empleadoId: 1,
    estado: true,
  },
  {
    id: 2,
    nombre: "Campaña de salud",
    descripcion: "Servicio especial de campañas de salud visual",
    duracion_min: 45,
    precio: 80000,
    empleadoId: 2,
    estado: true,
  },
  {
    id: 3,
    nombre: "Adaptación lentes de contacto",
    descripcion: "Prueba y adaptación de lentes de contacto",
    duracion_min: 60,
    precio: 75000,
    empleadoId: 1,
    estado: true,
  },
  {
    id: 4,
    nombre: "Examen de la vista",
    descripcion: "Evaluación completa de la agudeza visual",
    duracion_min: 40,
    precio: 60000,
    empleadoId: 2,
    estado: false,
  }
];

// Función para obtener el próximo ID disponible
function getNextId() {
  if (serviciosDB.length === 0) return 1;
  const maxId = Math.max(...serviciosDB.map(s => s.id));
  return maxId + 1;
}

// Obtener todos los servicios (formateados para la UI)
export function getAllServicios() {
  // Convertir estado booleano a string para la UI
  return serviciosDB.map(servicio => ({
    ...servicio,
    estado: servicio.estado ? "activo" : "inactivo",
    duracion: `${servicio.duracion_min} min`,
    duracion_min: servicio.duracion_min, // Mantener original
    // Formatear precio
    precio_formatted: `$${servicio.precio.toLocaleString()}`,
    // Mantener compatibilidad
    empleado: servicio.empleadoId ? `Empleado #${servicio.empleadoId}` : 'No asignado'
  }));
}

// Obtener por ID
export function getServicioById(id) {
  const servicio = serviciosDB.find((s) => s.id === Number(id));
  if (!servicio) return null;
  
  return {
    ...servicio,
    duracion: `${servicio.duracion_min} min`,
    estado: servicio.estado ? "activo" : "inactivo",
    empleado: servicio.empleadoId ? `Empleado #${servicio.empleadoId}` : 'No asignado',
  };
}

// Crear servicio
export function createServicio(data) {
  const newId = getNextId();
  
  const nuevoServicio = {
    id: newId,
    nombre: data.nombre || '',
    descripcion: data.descripcion || '',
    duracion_min: data.duracion_min || data.duracion || 30,
    precio: data.precio || 0,
    empleadoId: data.empleadoId || data.empleado || null,
    estado: data.estado === "activo" ? true : 
            data.estado === "inactivo" ? false : 
            data.estado === undefined ? true : data.estado
  };
  
  serviciosDB.push(nuevoServicio);
  return nuevoServicio;
}

// Actualizar servicio
export function updateServicio(id, updatedData) {
  const index = serviciosDB.findIndex((s) => s.id === Number(id));
  if (index === -1) return null;
  
  const datosActualizados = {
    nombre: updatedData.nombre || serviciosDB[index].nombre,
    descripcion: updatedData.descripcion || serviciosDB[index].descripcion,
    duracion_min: updatedData.duracion_min || updatedData.duracion || serviciosDB[index].duracion_min,
    precio: updatedData.precio || serviciosDB[index].precio,
    empleadoId: updatedData.empleadoId || serviciosDB[index].empleadoId,
    estado: updatedData.estado === "activo" ? true : 
            updatedData.estado === "inactivo" ? false : 
            updatedData.estado === undefined ? serviciosDB[index].estado : updatedData.estado
  };
  
  serviciosDB[index] = { 
    ...serviciosDB[index], 
    ...datosActualizados 
  };
  
  return serviciosDB[index];
}

// Eliminar servicio - DEVUELVE ARRAY COMPLETO
export function deleteServicio(id) {
  serviciosDB = serviciosDB.filter((s) => s.id !== Number(id));
  // Devolver todos los servicios formateados
  return getAllServicios();
}

// Cambiar estado - DEVUELVE ARRAY COMPLETO
export function updateEstadoServicio(id) {
  const index = serviciosDB.findIndex((s) => s.id === Number(id));
  if (index === -1) return getAllServicios();
  
  // Cambiar el estado booleano
  serviciosDB[index].estado = !serviciosDB[index].estado;
  
  // Devolver todos los servicios formateados
  return getAllServicios();
}

// Función para búsqueda de servicios
export function searchServicios(query) {
  const searchTerm = query.toLowerCase();
  return serviciosDB
    .filter(servicio => 
      servicio.nombre.toLowerCase().includes(searchTerm) ||
      servicio.descripcion.toLowerCase().includes(searchTerm)
    )
    .map(servicio => ({
      ...servicio,
      estado: servicio.estado ? "activo" : "inactivo",
      duracion: `${servicio.duracion_min} min`,
      precio_formatted: `$${servicio.precio.toLocaleString()}`
    }));
}

// Función para obtener servicios activos
export function getServiciosActivos() {
  return serviciosDB
    .filter(s => s.estado)
    .map(servicio => ({
      ...servicio,
      estado: "activo",
      duracion: `${servicio.duracion_min} min`,
      precio_formatted: `$${servicio.precio.toLocaleString()}`
    }));
}

// Función para obtener servicios por empleado
export function getServiciosByEmpleado(empleadoId) {
  return serviciosDB
    .filter(s => s.empleadoId === Number(empleadoId) && s.estado)
    .map(servicio => ({
      ...servicio,
      estado: "activo",
      duracion: `${servicio.duracion_min} min`,
      precio_formatted: `$${servicio.precio.toLocaleString()}`
    }));
}

// Función para obtener estadísticas
export function getServiciosStats() {
  const total = serviciosDB.length;
  const activos = serviciosDB.filter(s => s.estado).length;
  const inactivos = total - activos;
  const precioPromedio = total > 0 
    ? serviciosDB.reduce((sum, s) => sum + s.precio, 0) / total
    : 0;
  
  return {
    total,
    activos,
    inactivos,
    precioPromedio: precioPromedio.toFixed(2),
    porcentajeActivos: total > 0 ? (activos / total * 100).toFixed(1) : 0
  };
}