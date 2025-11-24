// Base de datos temporal de compras
let comprasDB = [
  {
    id: 1,
    numeroCompra: "C-001",
    proveedorId: 1,
    proveedorNombre: "Optical Supplies S.A.S.",
    fecha: "2024-01-15",
    productos: [
      { id: 1, nombre: "Lentes Oftálmicos", cantidad: 50, precioUnitario: 25000, total: 1250000 },
      { id: 2, nombre: "Monturas Acetato", cantidad: 30, precioUnitario: 35000, total: 1050000 }
    ],
    subtotal: 2300000,
    iva: 437000,
    total: 2737000,
    estado: "Completada",
    observaciones: "Pedido regular de lentes"
  },
  {
    id: 2,
    numeroCompra: "C-002",
    proveedorId: 2,
    proveedorNombre: "Lentes Premium",
    fecha: "2024-01-10",
    productos: [
      { id: 3, nombre: "Lentes de Contacto", cantidad: 100, precioUnitario: 15000, total: 1500000 }
    ],
    subtotal: 1500000,
    iva: 285000,
    total: 1785000,
    estado: "Completada",
    observaciones: "Lentes de contacto mensuales"
  },
  {
    id: 3,
    numeroCompra: "C-003",
    proveedorId: 3,
    proveedorNombre: "Cristales Ópticos",
    fecha: "2024-01-08",
    productos: [
      { id: 4, nombre: "Cristales Anti-reflejo", cantidad: 25, precioUnitario: 45000, total: 1125000 }
    ],
    subtotal: 1125000,
    iva: 213750,
    total: 1338750,
    estado: "Anulada",
    observaciones: "Pedido cancelado por falta de stock"
  }
];

// Obtener todas las compras
export function getAllCompras() {
  return [...comprasDB];
}

// Obtener por ID
export function getCompraById(id) {
  return comprasDB.find((c) => c.id === id);
}

// Crear compra
export function createCompra(data) {
  const newId = comprasDB.length ? comprasDB.at(-1).id + 1 : 1;
  const nuevaCompra = { 
    id: newId,
    numeroCompra: `C-${String(newId).padStart(3, '0')}`,
    ...data 
  };
  
  comprasDB.push(nuevaCompra);
  return nuevaCompra;
}

// Actualizar compra
export function updateCompra(id, updated) {
  const index = comprasDB.findIndex((c) => c.id === id);
  if (index !== -1) {
    comprasDB[index] = { ...comprasDB[index], ...updated };
  }
  return comprasDB;
}

// Eliminar compra
export function deleteCompra(id) {
  comprasDB = comprasDB.filter((c) => c.id !== id);
  return comprasDB;
}

// Cambiar estado (Completada/Anulada)
export function updateEstadoCompra(id) {
  comprasDB = comprasDB.map((c) =>
    c.id === id
      ? { 
          ...c, 
          estado: c.estado === "Completada" ? "Anulada" : "Completada" 
        }
      : c
  );
  return comprasDB;
}