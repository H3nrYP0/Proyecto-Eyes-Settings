// Base de datos temporal de pedidos
let pedidosDB = [
  {
    id: 1,
    cliente: "Juan Pérez",
    productoServicio: "Lentes Progresivos Transitions",
    tipo: "Venta",
    fechaPedido: "2024-01-15",
    fechaEntrega: "2024-01-25",
    total: 450000,
    abono: 150000,
    saldoPendiente: 300000,
    estado: "En proceso",
    observaciones: "Cliente prefiere montura negra"
  },
  {
    id: 2,
    cliente: "María González",
    productoServicio: "Examen de la Vista Completo",
    tipo: "Servicio",
    fechaPedido: "2024-01-16",
    fechaEntrega: "2024-01-16",
    total: 50000,
    abono: 50000,
    saldoPendiente: 0,
    estado: "Entregado",
    observaciones: "Sin observaciones"
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    productoServicio: "Lentes de Sol Ray-Ban",
    tipo: "Venta",
    fechaPedido: "2024-01-14",
    fechaEntrega: "2024-01-20",
    total: 280000,
    abono: 0,
    saldoPendiente: 280000,
    estado: "Pendiente pago",
    observaciones: "Urgente - viaja el 21"
  }
];

// Obtener todos los pedidos
export function getAllPedidos() {
  return [...pedidosDB];
}

// Obtener por ID
export function getPedidoById(id) {
  return pedidosDB.find((p) => p.id === id);
}

// Crear pedido
export function createPedido(data) {
  const newId = pedidosDB.length ? pedidosDB.at(-1).id + 1 : 1;
  const nuevoPedido = { 
    id: newId, 
    saldoPendiente: data.total - (data.abono || 0),
    ...data 
  };
  
  pedidosDB.push(nuevoPedido);
  return nuevoPedido;
}

// Actualizar pedido
export function updatePedido(id, updated) {
  const index = pedidosDB.findIndex((p) => p.id === id);
  if (index !== -1) {
    pedidosDB[index] = { ...pedidosDB[index], ...updated };
  }
  return pedidosDB;
}

// Eliminar pedido
export function deletePedido(id) {
  pedidosDB = pedidosDB.filter((p) => p.id !== id);
  return pedidosDB;
}

// Marcar como entregado
export function marcarComoEntregado(id) {
  const index = pedidosDB.findIndex((p) => p.id === id);
  if (index !== -1) {
    pedidosDB[index] = { 
      ...pedidosDB[index], 
      estado: "Entregado" 
    };
  }
  return pedidosDB;
}