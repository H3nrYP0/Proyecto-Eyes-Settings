import { useState, useEffect, useCallback } from "react";
import { createCompra } from "../services/comprasService";
import { getProveedoresActivos } from "../../proveedor/services/proveedoresService";
import { getAllProductos } from "../../producto/services/productosService";

const EMPTY_ROW = {
  productoId: "",
  nombre: "",
  stockActual: 0,
  cantidad: 1,
  precioCompra: 0,
  precioVenta: 0,
  total: 0,
};

// ============================
// Parsear valor COP a número puro
// Acepta: "1.200.000", "$1.200.000", "1200000"
// ============================
function parseCOP(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const clean = String(value).replace(/\$|\./g, "").replace(",", ".");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function useCompraForm({ mode = "create", initialData = null, onSubmitSuccess, onError }) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    proveedorId: "",
    observaciones: "",
    productos: [{ ...EMPTY_ROW }],
  });

  const [errors, setErrors] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // ============================
  // Cargar proveedores (reutilizable para refrescar)
  // ============================
  const cargarProveedores = useCallback(async () => {
    const data = await getProveedoresActivos();
    setProveedores(
      data.map((p) => ({
        ...p,
        razonSocial: p.razon_social_o_nombre || p.razonSocial || p.nombre || "Sin nombre",
      }))
    );
  }, []);

  // ============================
  // Cargar todos los datos iniciales
  // ============================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoadingData(true);
        const [productosData] = await Promise.all([
          getAllProductos(),
          cargarProveedores(),
        ]);

        setCatalogo(
          productosData
            .filter((p) => {
              // Cubrir los campos que puede mandar el backend para "activo"
              const activo = p.estado ?? p.activo ?? p.estado_producto ?? true;
              return activo === true || activo === "activo" || activo === 1;
            })
            .map((p) => ({
              id: p.id,
              nombre: p.nombre,
              stockActual: Number(p.stock ?? p.stockActual ?? 0),
              precioCompra: Number(p.precio_compra ?? p.precioCompra ?? 0),
              precioVenta: Number(p.precio_venta ?? p.precioVenta ?? 0),
            }))
        );
      } catch (err) {
        console.error("Error cargando datos:", err);
        setApiError("No se pudieron cargar proveedores o productos.");
      } finally {
        setLoadingData(false);
      }
    };
    cargar();
  }, [cargarProveedores]);

  // ============================
  // Cargar datos iniciales en vista/edición
  // ============================
  useEffect(() => {
    if (!initialData) return;
    setFormData({
      proveedorId: initialData.proveedorId ?? initialData.proveedor_id ?? "",
      observaciones: initialData.observaciones ?? "",
      productos: initialData.productos?.length
        ? initialData.productos.map((p) => ({
            id: p.id,
            productoId: p.productoId ?? "",
            nombre: p.nombre ?? "",
            stockActual: p.stockActual ?? 0,
            cantidad: p.cantidad,
            precioCompra: p.precioCompra ?? p.precioUnitario ?? 0,
            precioVenta: p.precioVenta ?? 0,
            total: p.total,
          }))
        : [{ ...EMPTY_ROW }],
    });
  }, [initialData]);

  // ============================
  // Totales
  // ============================
  const subtotal = formData.productos.reduce((acc, p) => acc + (p.total || 0), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  // ============================
  // Formatear como COP: $1.200.000
  // ============================
  const formatCurrency = (n) =>
    `$${Number(n || 0).toLocaleString("es-CO")}`;

  // ============================
  // Cambios en fila de producto
  // ============================
  const handleProductoChange = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const productos = [...prev.productos];
        const row = { ...productos[index] };

        if (field === "productoId") {
          const found = catalogo.find((p) => p.id === Number(value));
          row.productoId = value;
          row.nombre = found?.nombre ?? "";
          row.stockActual = found?.stockActual ?? 0;
          row.precioCompra = found?.precioCompra ?? 0;
          row.precioVenta = found?.precioVenta ?? 0;
          row.cantidad = 1;
          row.total = row.cantidad * row.precioCompra;
          setErrors((e) => ({ ...e, [`prod_${index}`]: "" }));
        } else if (field === "cantidad") {
          const qty = Math.max(1, parseInt(value) || 1);
          row.cantidad = qty;
          row.total = qty * row.precioCompra;
          setErrors((e) => ({ ...e, [`qty_${index}`]: "" }));
        } else if (field === "precioCompra") {
          // Parsear desde formato COP
          const precio = Math.max(0, parseCOP(value));
          row.precioCompra = precio;
          row.total = row.cantidad * precio;
          setErrors((e) => ({ ...e, [`precioC_${index}`]: "" }));
        } else if (field === "precioVenta") {
          const precio = Math.max(0, parseCOP(value));
          row.precioVenta = precio;
          setErrors((e) => ({ ...e, [`precioV_${index}`]: "" }));
        }

        productos[index] = row;
        return { ...prev, productos };
      });
    },
    [catalogo]
  );

  const addRow = useCallback(() => {
    setFormData((prev) => ({ ...prev, productos: [...prev.productos, { ...EMPTY_ROW }] }));
  }, []);

  const removeRow = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors]
  );

  // ============================
  // Validación
  // ============================
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.proveedorId) newErrors.proveedorId = "Selecciona un proveedor.";
    if (!formData.productos.length) {
      newErrors.productos = "Agrega al menos un producto.";
    } else {
      formData.productos.forEach((p, i) => {
        if (!p.productoId) newErrors[`prod_${i}`] = "Selecciona el producto.";
        if (!p.cantidad || p.cantidad < 1) newErrors[`qty_${i}`] = "Mínimo 1.";
        if (!p.precioCompra || p.precioCompra <= 0) newErrors[`precioC_${i}`] = "Precio de compra requerido.";
        if (!p.precioVenta || p.precioVenta <= 0) newErrors[`precioV_${i}`] = "Precio de venta requerido.";
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================
  // Submit — manda todo al backend en un solo POST /compras
  // El backend (Flask) incrementa el stock internamente
  // ============================
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      const result = await createCompra({
        proveedorId: formData.proveedorId,
        observaciones: formData.observaciones,
        productos: formData.productos.map((p) => ({
          productoId: Number(p.productoId),
          cantidad: Number(p.cantidad),
          precioCompra: Number(p.precioCompra),
          precioVenta: Number(p.precioVenta),
          stockActual: Number(p.stockActual),
        })),
      });
      onSubmitSuccess?.(result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error al guardar compra:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al guardar la compra";
      setApiError(msg);
      onError?.(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  }, [formData, validate, onSubmitSuccess, onError]);

  return {
    formData,
    errors,
    proveedores,
    catalogo,
    loadingData,
    submitting,
    apiError,
    subtotal,
    iva,
    total,
    formatCurrency,
    parseCOP,
    handleChange,
    handleProductoChange,
    addRow,
    removeRow,
    handleSubmit,
    setFormData,
    recargarProveedores: cargarProveedores,
  };
}