// Base de datos temporal de pedidos
let pedidosDB = [
  {
    id: 1,
    cliente: "María González",
    clienteId: 1,
    productoServicio: "Lentes progresivos con antirreflejo",
    fechaPedido: "2024-01-15",
    fechaEntrega: "2024-01-25",
    total: 450000,
    anticipo: 150000,
    saldoPendiente: 300000,
    estado: "En proceso",
    tipo: "Venta",
    observaciones: "Cliente prefiere montura de acetato"
  },
  {
    id: 2,
    cliente: "Carlos Rodríguez",
    clienteId: 2,
    productoServicio: "Lentes de contacto mensuales",
    fechaPedido: "2024-01-10",
    fechaEntrega: "2024-01-12",
    total: 120000,
    anticipo: 120000,
    saldoPendiente: 0,
    estado: "Entregado",
    tipo: "Venta",
    observaciones: "Sin observaciones"
  },
  {
    id: 3,
    cliente: "Ana Martínez",
    clienteId: 3,
    productoServicio: "Montura + Lentes oftálmicos",
    fechaPedido: "2024-01-08",
    fechaEntrega: "2024-01-18",
    total: 280000,
    anticipo: 100000,
    saldoPendiente: 180000,
    estado: "Pendiente pago",
    tipo: "Venta",
    observaciones: "Urgente - cliente necesita para viaje"
  },
  {
    id: 4,
    cliente: "Pedro López",
    clienteId: 4,
    productoServicio: "Reparación de montura",
    fechaPedido: "2024-01-05",
    fechaEntrega: "2024-01-07",
    total: 35000,
    anticipo: 0,
    saldoPendiente: 35000,
    estado: "Entregado",
    tipo: "Servicio",
    observaciones: "Cambio de plaquetas"
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

// Registrar abono
export function registrarAbono(id, montoAbono) {
  const pedido = pedidosDB.find((p) => p.id === id);
  if (pedido) {
    pedido.saldoPendiente -= montoAbono;
    pedido.anticipo += montoAbono;
    
    // Si el saldo llega a cero, cambiar estado
    if (pedido.saldoPendiente <= 0) {
      pedido.estado = "Pagado";
    }
  }
  return pedidosDB;
}

// Cambiar estado a entregado
export function marcarComoEntregado(id) {
  const pedido = pedidosDB.find((p) => p.id === id);
  if (pedido) {
    pedido.estado = "Entregado";
  }
  return pedidosDB;
}