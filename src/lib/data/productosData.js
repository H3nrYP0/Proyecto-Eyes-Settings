// Base de datos temporal de productos
let productosDB = [
  {
    id: 1,
    nombre: "Lente Solar Ray-Ban Aviator",
    codigo: "RB-AV-001",
    descripcion: "Lentes de sol clásicos estilo aviador",
    precioVenta: 150000,
    precioCompra: 90000,
    stockActual: 25,
    stockMinimo: 5,
    categoria: "Lentes de Sol",
    marca: "Ray-Ban",
    estado: "activo",
    imagenes: []
  },
  {
    id: 2,
    nombre: "Montura Acetato Negro",
    codigo: "OK-MT-002",
    descripcion: "Montura de acetato color negro clásico",
    precioVenta: 80000,
    precioCompra: 45000,
    stockActual: 15,
    stockMinimo: 3,
    categoria: "Monturas",
    marca: "Oakley",
    estado: "activo",
    imagenes: []
  },
  {
    id: 3,
    nombre: "Lentes de Contacto Diarios",
    codigo: "JJ-LC-003",
    descripcion: "Lentes de contacto de uso diario",
    precioVenta: 120000,
    precioCompra: 75000,
    stockActual: 8,
    stockMinimo: 10,
    categoria: "Lentes de Contacto",
    marca: "Johnson & Johnson",
    estado: "bajo-stock",
    imagenes: []
  },
  {
    id: 4,
    nombre: "Estuche para Lentes",
    codigo: "GN-AC-004",
    descripcion: "Estuche protector para lentes",
    precioVenta: 25000,
    precioCompra: 12000,
    stockActual: 30,
    stockMinimo: 5,
    categoria: "Accesorios",
    marca: "Generic",
    estado: "activo",
    imagenes: []
  }
];

// Obtener todos los productos
export function getAllProductos() {
  return [...productosDB];
}

// Obtener por ID
export function getProductoById(id) {
  return productosDB.find((p) => p.id === id);
}

// Crear producto
export function createProducto(data) {
  const newId = productosDB.length ? productosDB.at(-1).id + 1 : 1;
  const nuevoProducto = { 
    id: newId,
    estado:"activo",
    ...data 
  };
  
  productosDB.push(nuevoProducto);
  return nuevoProducto;
}

// Actualizar producto
export function updateProducto(id, updated) {
  const index = productosDB.findIndex((p) => p.id === id);
  if (index !== -1) {
    productosDB[index] = { ...productosDB[index], ...updated };
  }
  return productosDB;
}

// Eliminar producto
export function deleteProducto(id) {
  productosDB = productosDB.filter((p) => p.id !== id);
  return productosDB;
}

// Cambiar estado
export function updateEstadoProducto(id) {
  productosDB = productosDB.map((p) =>
    p.id === id
      ? { 
          ...p, 
          estado: p.estado === "activo" ? "inactivo" : "activo" 
        }
      : p
  );
  return productosDB;
}