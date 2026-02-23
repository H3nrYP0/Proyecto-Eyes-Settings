// ============================
// VERSIÓN MOCK CON LOCALSTORAGE
// ============================

// Key para localStorage
const STORAGE_KEY = 'pedidos_data';

// Datos iniciales por defecto
const DATOS_INICIALES = [
  {
    id: 1,
    cliente: "Juan Pérez",
    fechaPedido: "2024-01-15",
    fechaEntrega: "2024-01-25",
    estado: "En proceso",
    tipo: "Productos",
    total: 450000,
    abono: 150000,
    saldoPendiente: 300000,
    observaciones: "Cliente prefiere montura negra",
    items: [
      {
        id: 1,
        nombre: "Lentes de sol",
        descripcion: "Protección UV",
        precio: 120000,
        cantidad: 2,
        tipo: "producto"
      },
      {
        id: 3,
        nombre: "Lentes progresivos",
        descripcion: "Alta definición",
        precio: 250000,
        cantidad: 1,
        tipo: "producto"
      }
    ]
  },
  {
    id: 2,
    cliente: "María González",
    fechaPedido: "2024-01-16",
    fechaEntrega: "2024-01-16",
    estado: "Entregado",
    tipo: "Servicios",
    total: 50000,
    abono: 50000,
    saldoPendiente: 0,
    observaciones: "Sin observaciones",
    items: [
      {
        id: 5,
        nombre: "Consulta oftalmológica",
        descripcion: "Examen completo",
        precio: 50000,
        cantidad: 1,
        tipo: "servicio"
      }
    ]
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    fechaPedido: "2024-01-14",
    fechaEntrega: "2024-01-20",
    estado: "Pendiente",
    tipo: "Productos",
    total: 280000,
    abono: 0,
    saldoPendiente: 280000,
    observaciones: "Urgente - viaja el 21",
    items: [
      {
        id: 1,
        nombre: "Lentes de sol",
        descripcion: "Protección UV",
        precio: 120000,
        cantidad: 1,
        tipo: "producto"
      },
      {
        id: 2,
        nombre: "Armazón metálico",
        descripcion: "Color plateado",
        precio: 85000,
        cantidad: 1,
        tipo: "producto"
      },
      {
        id: 4,
        nombre: "Estuche para lentes",
        descripcion: "Cuero sintético",
        precio: 35000,
        cantidad: 2,
        tipo: "producto"
      }
    ]
  }
];

// Función para inicializar/cargar datos
const getPedidosDB = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATOS_INICIALES));
    return [...DATOS_INICIALES];
  } catch (error) {
    console.error("Error al cargar datos de localStorage:", error);
    return [...DATOS_INICIALES];
  }
};

// Función para guardar datos
const savePedidosDB = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar datos en localStorage:", error);
  }
};

// Obtener todos los pedidos
export function getAllPedidos() {
  return getPedidosDB();
}

// Obtener por ID
export function getPedidoById(id) {
  const pedidos = getPedidosDB();
  return pedidos.find((p) => p.id === id);
}

// Crear pedido
export function createPedido(data) {
  const pedidos = getPedidosDB();
  const newId = pedidos.length ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
  
  const nuevoPedido = { 
    id: newId, 
    ...data,
    abono: 0,
    saldoPendiente: data.total || 0
  };
  
  pedidos.push(nuevoPedido);
  savePedidosDB(pedidos);
  return nuevoPedido;
}

// Actualizar pedido
export function updatePedido(id, updated) {
  const pedidos = getPedidosDB();
  const index = pedidos.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    // Mantener abono y saldoPendiente si no vienen en updated
    pedidos[index] = { 
      ...pedidos[index], 
      ...updated,
      abono: updated.abono !== undefined ? updated.abono : pedidos[index].abono,
      saldoPendiente: updated.saldoPendiente !== undefined ? updated.saldoPendiente : pedidos[index].saldoPendiente
    };
    savePedidosDB(pedidos);
    return pedidos[index];
  }
  return null;
}

// Eliminar pedido
export function deletePedido(id) {
  const pedidos = getPedidosDB();
  const nuevosPedidos = pedidos.filter((p) => p.id !== id);
  savePedidosDB(nuevosPedidos);
  return nuevosPedidos;
}

// Actualizar estado del pedido
export function updateEstadoPedido(id, nuevoEstado) {
  const pedidos = getPedidosDB();
  const index = pedidos.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    pedidos[index].estado = nuevoEstado;
    savePedidosDB(pedidos);
    return pedidos[index];
  }
  return null;
}

// Marcar como entregado (mantener por compatibilidad)
export function marcarComoEntregado(id) {
  const pedidos = getPedidosDB();
  const index = pedidos.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    pedidos[index].estado = "Entregado";
    savePedidosDB(pedidos);
    return pedidos;
  }
  return pedidos;
}

// Registrar abono
export function registrarAbono(id, montoAbono) {
  const pedidos = getPedidosDB();
  const index = pedidos.findIndex((p) => p.id === id);
  
  if (index !== -1) {
    const pedido = pedidos[index];
    const nuevoAbono = (pedido.abono || 0) + montoAbono;
    const nuevoSaldoPendiente = pedido.total - nuevoAbono;
    
    pedidos[index] = {
      ...pedido,
      abono: nuevoAbono,
      saldoPendiente: nuevoSaldoPendiente,
      estado: nuevoSaldoPendiente <= 0 ? "Pagado" : pedido.estado
    };
    
    savePedidosDB(pedidos);
    return pedidos[index];
  }
  return null;
}