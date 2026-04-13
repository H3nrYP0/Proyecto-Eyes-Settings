// src/features/home/components/Services/productosLandingData.js
// Servicio de productos para el landing — incluye imágenes desde /imagenes/producto/:id

const BASE_URL = "https://optica-api-vad8.onrender.com";

/**
 * Obtiene todos los productos activos con sus imágenes, categorías y marcas.
 * Usado por FeaturesSection (carrusel) y ProductsGrid (grid de tarjetas).
 */
export async function getAllProductosLanding() {
  // 1. Cargar productos, categorías y marcas en paralelo
  const [productosRes, categoriasRes, marcasRes] = await Promise.all([
    fetch(`${BASE_URL}/productos`),
    fetch(`${BASE_URL}/categorias`),
    fetch(`${BASE_URL}/marcas`),
  ]);

  if (!productosRes.ok) throw new Error("Error al cargar productos");

  const [productosRaw, categorias, marcas] = await Promise.all([
    productosRes.json(),
    categoriasRes.ok ? categoriasRes.json() : [],
    marcasRes.ok ? marcasRes.json() : [],
  ]);

  // 2. Solo productos activos
  const activos = productosRaw.filter((p) => p.estado === true);

  // 3. Cargar imágenes de cada producto en paralelo
  const productosConImagenes = await Promise.all(
    activos.map(async (producto) => {
      let imagenes = [];
      try {
        const imgRes = await fetch(`${BASE_URL}/imagenes/producto/${producto.id}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          // El backend puede devolver { imagenes: [...] } o directamente [...]
          imagenes = Array.isArray(imgData.imagenes)
            ? imgData.imagenes
            : Array.isArray(imgData)
            ? imgData
            : [];
        }
      } catch (_) {
        // Sin imágenes — se usará el emoji de fallback
      }

      const categoria = categorias.find((c) => c.id === producto.categoria_id);
      const marca = marcas.find((m) => m.id === producto.marca_id);

      return {
        id: producto.id,
        nombre: producto.nombre,
        codigo: producto.codigo || "",
        descripcion: producto.descripcion || "",
        precioVenta: producto.precio_venta,
        precioCompra: producto.precio_compra,
        stockActual: producto.stock,
        stockMinimo: producto.stock_minimo,
        categoria: categoria?.nombre || "",
        marca: marca?.nombre || "",
        marca_id: producto.marca_id,
        categoria_id: producto.categoria_id,
        estado: "activo",
        // imagenes: array de { id, url } — usado por ProductCard (imagenes[0].url)
        imagenes: imagenes,
        // imagenPrincipal: string url | null — usado por FeaturesSection
        imagenPrincipal: imagenes[0]?.url || null,
      };
    })
  );

  return productosConImagenes;
}

/**
 * Obtiene un producto por ID con su descripción e imágenes.
 * Usado por ProductCard cuando el usuario hace flip para ver detalles.
 */
export async function getProductoById(id) {
  const [productoRes, imgRes] = await Promise.all([
    fetch(`${BASE_URL}/productos/${id}`),
    fetch(`${BASE_URL}/imagenes/producto/${id}`),
  ]);

  if (!productoRes.ok) throw new Error(`Producto ${id} no encontrado`);
  const producto = await productoRes.json();

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

  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precioVenta: producto.precio_venta,
    stockActual: producto.stock,
    imagenes,
    imagenPrincipal: imagenes[0]?.url || null,
  };
}