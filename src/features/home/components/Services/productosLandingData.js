// =============================================================
// productosLandingData.js
// =============================================================
// OPTIMIZACIÓN PRINCIPAL:
// Antes: 1 fetch por producto para imágenes → N+3 peticiones en paralelo
// Ahora: 1 sola petición a /imagenes/productos (batch) → 4 peticiones totales
//
// Si el endpoint batch no existe, cae a fetch individual con límite
// de concurrencia para no saturar el servidor.
// =============================================================

const BASE_URL = "https://optica-api-vad8.onrender.com";

// Intenta cargar todas las imágenes en una sola petición batch.
// Si el endpoint no existe (404), devuelve null para caer al fallback.
async function fetchImagenesBatch() {
  try {
    const res = await fetch(`${BASE_URL}/imagenes`);
    if (!res.ok) return null;
    const data = await res.json();
    // Espera: [{ producto_id, url, ... }] o { imagenes: [...] }
    const lista = Array.isArray(data) ? data : (data.imagenes || null);
    if (!lista) return null;
    // Convertir a Map<producto_id, imagen[]>
    const map = new Map();
    lista.forEach(img => {
      const pid = img.producto_id;
      if (!map.has(pid)) map.set(pid, []);
      map.get(pid).push(img);
    });
    return map;
  } catch {
    return null;
  }
}

// Fallback: carga imágenes de N productos con concurrencia limitada
async function fetchImagenesIndividual(ids, concurrencia = 20) {
  const map = new Map();
  for (let i = 0; i < ids.length; i += concurrencia) {
    const batch = ids.slice(i, i + concurrencia);
    await Promise.all(batch.map(async (id) => {
      try {
        const res = await fetch(`${BASE_URL}/imagenes/producto/${id}`);
        if (!res.ok) { map.set(id, []); return; }
        const data = await res.json();
        const imgs = Array.isArray(data.imagenes) ? data.imagenes
                   : Array.isArray(data)          ? data
                   : [];
        map.set(id, imgs);
      } catch {
        map.set(id, []);
      }
    }));
  }
  return map;
}

// Normaliza un producto raw al formato que usan ProductCard y ProductDetail
function normalizarProducto(producto, categoria, marca, imagenes) {
  return {
    id:              producto.id,
    nombre:          producto.nombre,
    codigo:          producto.codigo          || "",
    descripcion:     producto.descripcion     || "",
    precioVenta:     producto.precio_venta,
    precioCompra:    producto.precio_compra,
    stockActual:     producto.stock,
    stockMinimo:     producto.stock_minimo    || 0,
    categoria:       categoria?.nombre        || "",
    marca:           marca?.nombre            || "",
    marca_id:        producto.marca_id,
    categoria_id:    producto.categoria_id    || producto.categoria_producto_id,
    estado:          producto.estado ? "activo" : "inactivo",
    imagenes:        imagenes,
    imagenPrincipal: imagenes[0]?.url         || null,
  };
}

/**
 * Obtiene todos los productos activos con imágenes, categorías y marcas.
 * 4 peticiones totales (productos + categorias + marcas + imágenes batch).
 * Usado por ProductsGrid y el carrusel de FeaturesSection.
 */
export async function getAllProductosLanding() {
  // 3 peticiones base en paralelo
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
  const ids     = activos.map(p => p.id);

  // Intentar batch primero, si no existe caer a individual con límite
  let imagenesMap = await fetchImagenesBatch();
  if (!imagenesMap) {
    imagenesMap = await fetchImagenesIndividual(ids);
  }

  return activos.map(producto => {
    const categoria = categorias.find(c =>
      c.id === (producto.categoria_id || producto.categoria_producto_id)
    );
    const marca     = marcas.find(m => m.id === producto.marca_id);
    const imagenes  = imagenesMap.get(producto.id) || [];
    return normalizarProducto(producto, categoria, marca, imagenes);
  });
}

/**
 * Obtiene un producto por ID con imágenes, categoría, marca y stock.
 * Usado por ProductDetail. 4 peticiones en paralelo.
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
      const data = await imgRes.json();
      imagenes = Array.isArray(data.imagenes) ? data.imagenes
               : Array.isArray(data)          ? data
               : [];
    }
  } catch (_) {}

  const categoria = categorias.find(c =>
    c.id === (producto.categoria_id || producto.categoria_producto_id)
  );
  const marca = marcas.find(m => m.id === producto.marca_id);

  return normalizarProducto(producto, categoria, marca, imagenes);
}