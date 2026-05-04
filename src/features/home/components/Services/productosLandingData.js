// =============================================================
// productosLandingData.js
// UBICACIÓN: src/features/home/components/Services/productosLandingData.js
//
// Servicio de datos de productos para el landing.
// getProductoById incluye categoría, marca y stock para ProductDetail.
// =============================================================

const BASE_URL = "https://optica-api-vad8.onrender.com";

/**
 * Obtiene todos los productos activos con imágenes, categorías y marcas.
 * Usado por FeaturesSection (carrusel) y ProductsGrid.
 */
export async function getAllProductosLanding() {
  const [productosRes, categoriasRes, marcasRes] = await Promise.all([
    fetch(`${BASE_URL}/productos`),
    fetch(`${BASE_URL}/categorias`),
    fetch(`${BASE_URL}/marcas`),
  ]);

  if (!productosRes.ok) throw new Error("Error al cargar productos");

  const [productosRaw, categorias, marcas] = await Promise.all([
    productosRes.json(),
    categoriasRes.ok ? categoriasRes.json() : [],
    marcasRes.ok    ? marcasRes.json()    : [],
  ]);

  const activos = productosRaw.filter(p => p.estado === true);

  const productosConImagenes = await Promise.all(
    activos.map(async producto => {
      let imagenes = [];
      try {
        const imgRes = await fetch(`${BASE_URL}/imagenes/producto/${producto.id}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          imagenes = Array.isArray(imgData.imagenes)
            ? imgData.imagenes
            : Array.isArray(imgData)
            ? imgData
            : [];
        }
      } catch (_) {}

      const categoria = categorias.find(c => c.id === (producto.categoria_id || producto.categoria_producto_id));
      const marca     = marcas.find(m => m.id === producto.marca_id);

      return {
        id:           producto.id,
        nombre:       producto.nombre,
        codigo:       producto.codigo || "",
        descripcion:  producto.descripcion || "",
        precioVenta:  producto.precio_venta,
        precioCompra: producto.precio_compra,
        stockActual:  producto.stock,
        stockMinimo:  producto.stock_minimo || 0,
        categoria:    categoria?.nombre || "",
        marca:        marca?.nombre || "",
        marca_id:     producto.marca_id,
        categoria_id: producto.categoria_id || producto.categoria_producto_id,
        estado:       "activo",
        imagenes:     imagenes,
        imagenPrincipal: imagenes[0]?.url || null,
      };
    })
  );

  return productosConImagenes;
}

/**
 * Obtiene un producto por ID con descripción, imágenes, categoría, marca y stock.
 * Usado por ProductDetail.
 */
export async function getProductoById(id) {
  const [productoRes, imgRes, categoriasRes, marcasRes] = await Promise.all([
    fetch(`${BASE_URL}/productos/${id}`),
    fetch(`${BASE_URL}/imagenes/producto/${id}`),
    fetch(`${BASE_URL}/categorias`),
    fetch(`${BASE_URL}/marcas`),
  ]);

  if (!productoRes.ok) throw new Error(`Producto ${id} no encontrado`);

  const [producto, categorias, marcas] = await Promise.all([
    productoRes.json(),
    categoriasRes.ok ? categoriasRes.json() : [],
    marcasRes.ok    ? marcasRes.json()    : [],
  ]);

  let imagenes = [];
  try {
    if (imgRes.ok) {
      const imgData = await imgRes.json();
      imagenes = Array.isArray(imgData.imagenes)
        ? imgData.imagenes
        : Array.isArray(imgData)
        ? imgData
        : [];
    }
  } catch (_) {}

  const categoria = categorias.find(c => c.id === (producto.categoria_id || producto.categoria_producto_id));
  const marca     = marcas.find(m => m.id === producto.marca_id);

  return {
    id:           producto.id,
    nombre:       producto.nombre,
    codigo:       producto.codigo || "",
    descripcion:  producto.descripcion || "",
    precioVenta:  producto.precio_venta,
    precioCompra: producto.precio_compra,
    stockActual:  producto.stock,
    stockMinimo:  producto.stock_minimo || 0,
    categoria:    categoria?.nombre || "",
    marca:        marca?.nombre || "",
    estado:       producto.estado ? "activo" : "inactivo",
    imagenes:     imagenes,
    imagenPrincipal: imagenes[0]?.url || null,
  };
}