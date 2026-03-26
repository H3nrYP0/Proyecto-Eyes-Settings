import api from "../axios";
import { ProveedoresData } from "./proveedoresData";

// ============================================================
//  COMPRAS DATA — conectado al backend real
//  Endpoints: /compras  y  /detalle-compra
// ============================================================

export const ComprasData = {

  // ── Backend → UI ─────────────────────────────────────────
  // Recibe:
  //   compra            — objeto crudo del backend
  //   detalles          — array completo de /detalle-compra
  //   proveedorNombre   — string ya resuelto desde la lista de proveedores
  //   catalogoProductos — array de { id, nombre, ... } del endpoint /productos
  _toUI(compra, detalles = [], proveedorNombre = "", catalogoProductos = []) {
    const productos = detalles
      .filter((d) => d.compra_id === compra.id)
      .map((d) => {
        // Cruzar con catálogo para obtener el nombre real del producto
        const prodCat = catalogoProductos.find((p) => p.id === d.producto_id);
        return {
          id:             d.id,
          productoId:     d.producto_id,
          nombre:         prodCat?.nombre
                          ?? d.producto?.nombre
                          ?? d.nombre_producto
                          ?? `Producto #${d.producto_id}`,
          cantidad:       d.cantidad,
          precioUnitario: d.precio_unidad,
          total:          d.subtotal ?? d.cantidad * d.precio_unidad,
        };
      });

    const subtotal = productos.reduce((s, p) => s + p.total, 0);
    const iva      = Math.round(subtotal * 0.19);

    return {
      id:              compra.id,
      numeroCompra:    `C-${String(compra.id).padStart(3, "0")}`,
      proveedorId:     compra.proveedor_id,
      // Prioridad: (1) cruzado desde lista, (2) anidado del backend, (3) fallback
      proveedorNombre: proveedorNombre
                       || compra.proveedor?.razon_social_o_nombre
                       || compra.proveedor?.razonSocial
                       || `Proveedor #${compra.proveedor_id}`,
      fecha:           compra.fecha ?? compra.created_at ?? new Date().toISOString(),
      productos,
      subtotal,
      iva,
      total:           compra.total ?? subtotal + iva,
      estado:          compra.estado_compra ? "Completada" : "Anulada",
      observaciones:   compra.observaciones ?? "",
    };
  },

  // ── Cargar los 4 recursos base en paralelo ────────────────
  async _fetchBase() {
    const [comprasRes, detallesRes, proveedoresList, productosRes] = await Promise.all([
      api.get("/compras"),
      api.get("/detalle-compra"),
      ProveedoresData.getAllProveedores(),   // ya mapea a UI con razonSocial
      api.get("/productos"),
    ]);
    return {
      compras:    comprasRes.data,
      detalles:   detallesRes.data,
      proveedores: proveedoresList,          // [{ id, razonSocial, ... }]
      productos:  productosRes.data,         // [{ id, nombre, ... }]
    };
  },

  // ── Obtener todas las compras ─────────────────────────────
  async getAllCompras() {
    try {
      const { compras, detalles, proveedores, productos } = await this._fetchBase();

      return compras.map((c) => {
        const prov = proveedores.find((p) => p.id === c.proveedor_id);
        return this._toUI(c, detalles, prov?.razonSocial ?? "", productos);
      });
    } catch (error) {
      console.error("Error al obtener compras:", error);
      throw error;
    }
  },

  // ── Obtener una compra por ID ─────────────────────────────
  async getCompraById(id) {
    try {
      const [compraRes, detallesRes, proveedoresList, productosRes] = await Promise.all([
        api.get(`/compras/${id}`),
        api.get("/detalle-compra"),
        ProveedoresData.getAllProveedores(),
        api.get("/productos"),
      ]);

      const prov = proveedoresList.find((p) => p.id === compraRes.data.proveedor_id);
      return this._toUI(
        compraRes.data,
        detallesRes.data,
        prov?.razonSocial ?? "",
        productosRes.data
      );
    } catch (error) {
      console.error("Error al obtener compra:", error);
      throw error;
    }
  },

  // ── Crear compra + detalles ───────────────────────────────
  async createCompra(data) {
    try {
      const subtotal = data.productos.reduce(
        (s, p) => s + p.cantidad * p.precioUnitario, 0
      );
      const iva   = Math.round(subtotal * 0.19);
      const total = subtotal + iva;

      // 1. Crear cabecera
      const compraRes = await api.post("/compras", {
        proveedor_id:  data.proveedorId,
        total,
        estado_compra: true,
        observaciones: data.observaciones ?? "",
      });

      const compraId = compraRes.data.compra.id;

      // 2. Crear detalles en paralelo
      await Promise.all(
        data.productos.map((p) =>
          api.post("/detalle-compra", {
            compra_id:     compraId,
            producto_id:   p.productoId,
            cantidad:      p.cantidad,
            precio_unidad: p.precioUnitario,
          })
        )
      );

      // 3. Retornar compra completa con todos los nombres resueltos
      return await this.getCompraById(compraId);
    } catch (error) {
      console.error("Error al crear compra:", error);
      throw error;
    }
  },

  // ── Actualizar compra ─────────────────────────────────────
  async updateCompra(id, data) {
    try {
      const subtotal = data.productos.reduce(
        (s, p) => s + p.cantidad * p.precioUnitario, 0
      );
      const iva   = Math.round(subtotal * 0.19);
      const total = subtotal + iva;

      await api.put(`/compras/${id}`, {
        proveedor_id:  data.proveedorId,
        total,
        observaciones: data.observaciones ?? "",
      });

      // Detalles nuevos (sin id) → crearlos
      const nuevos = data.productos.filter((p) => !p.id);
      if (nuevos.length) {
        await Promise.all(
          nuevos.map((p) =>
            api.post("/detalle-compra", {
              compra_id:     id,
              producto_id:   p.productoId,
              cantidad:      p.cantidad,
              precio_unidad: p.precioUnitario,
            })
          )
        );
      }

      // Detalles existentes (con id) → actualizarlos
      const existentes = data.productos.filter((p) => p.id);
      if (existentes.length) {
        await Promise.all(
          existentes.map((p) =>
            api.put(`/detalle-compra/${p.id}`, {
              cantidad:      p.cantidad,
              precio_unidad: p.precioUnitario,
            })
          )
        );
      }

      return await this.getCompraById(id);
    } catch (error) {
      console.error("Error al actualizar compra:", error);
      throw error;
    }
  },

  // ── Eliminar compra ───────────────────────────────────────
  async deleteCompra(id) {
    try {
      await api.delete(`/compras/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar compra:", error);
      throw error;
    }
  },

  // ── Cambiar estado (Completada ↔ Anulada) ─────────────────
  async updateEstadoCompra(id, estadoActual) {
    try {
      const nuevoEstado = estadoActual !== "Completada";
      await api.put(`/compras/${id}`, { estado_compra: nuevoEstado });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  },
};

// ── Exportaciones individuales (compatibilidad) ───────────────
export const getAllCompras       = () => ComprasData.getAllCompras();
export const getCompraById      = (id) => ComprasData.getCompraById(id);
export const createCompra       = (data) => ComprasData.createCompra(data);
export const updateCompra       = (id, data) => ComprasData.updateCompra(id, data);
export const deleteCompra       = (id) => ComprasData.deleteCompra(id);
export const updateEstadoCompra = (id, estado) => ComprasData.updateEstadoCompra(id, estado);