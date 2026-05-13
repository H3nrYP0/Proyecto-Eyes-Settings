import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCompra } from "../services/comprasService";
import { getProveedoresActivos } from "../../proveedor/services/proveedoresService";
import { getAllProductos } from "../../producto/services/productosService";

// ── CAMBIO 1: cantidad vacía ("") para que el usuario siempre la ingrese ──────
const EMPTY_ROW = {
  productoId: "",
  nombre: "",
  stockActual: 0,
  cantidad: "",          // era 1 → ahora vacío
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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    proveedorId: "",
    observaciones: "",
    productos: [{ ...EMPTY_ROW }],
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // ── REACT QUERY: Proveedores ───────────────────────────────────────────────
  const {
    data: proveedoresRaw = [],
    isLoading: loadingProveedores,
    refetch: recargarProveedores,
  } = useQuery({
    queryKey: ["proveedores-activos"],
    queryFn: getProveedoresActivos,
    staleTime: 1000 * 60 * 5, // 5 min — los proveedores no cambian muy seguido
  });

  const proveedores = proveedoresRaw.map((p) => ({
    ...p,
    razonSocial: p.razon_social_o_nombre || p.razonSocial || p.nombre || "Sin nombre",
  }));

  // ── REACT QUERY: Catálogo de productos ────────────────────────────────────
  const {
    data: productosRaw = [],
    isLoading: loadingProductos,
  } = useQuery({
    queryKey: ["productos-activos"],
    queryFn: getAllProductos,
    staleTime: 1000 * 60 * 5,
  });

  const catalogo = productosRaw
    .filter((p) => {
      const activo = p.estado ?? p.activo ?? p.estado_producto ?? true;
      return activo === true || activo === "activo" || activo === 1;
    })
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      stockActual: Number(p.stock ?? p.stockActual ?? 0),
      precioCompra: Number(p.precio_compra ?? p.precioCompra ?? 0),
      precioVenta: Number(p.precio_venta ?? p.precioVenta ?? 0),
    }));

  const loadingData = loadingProveedores || loadingProductos;

  // Error de carga (sin romper el hook)
  const [apiErrorCarga, setApiErrorCarga] = useState("");
  useEffect(() => {
    if (!loadingData && proveedoresRaw.length === 0 && productosRaw.length === 0) {
      // silencioso — React Query ya reintenta automáticamente
    }
  }, [loadingData, proveedoresRaw, productosRaw]);

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
            cantidad: p.cantidad,         // en vista/edición viene del backend → se respeta
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
  // ── CAMBIO 1 aplicado aquí: al seleccionar un producto,
  //    cantidad queda vacía para que el usuario la ingrese
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
          row.cantidad = "";             // era 1 → vacío para que el usuario lo defina
          row.total = 0;                 // sin cantidad definida, total = 0
          setErrors((e) => ({ ...e, [`prod_${index}`]: "" }));
        } else if (field === "cantidad") {
          // Permitir vacío mientras escribe; calcular total solo con valor válido
          const raw = String(value).replace(/[^0-9]/g, "");
          const qty = raw === "" ? "" : Math.max(1, parseInt(raw, 10));
          row.cantidad = qty;
          row.total = qty === "" ? 0 : qty * row.precioCompra;
          setErrors((e) => ({ ...e, [`qty_${index}`]: "" }));
        } else if (field === "precioCompra") {
          const precio = Math.max(0, parseCOP(value));
          row.precioCompra = precio;
          const qty = parseInt(row.cantidad, 10) || 0;
          row.total = qty * precio;
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
  // ── CAMBIO 1: cantidad vacía ("") ya es inválida → mensaje claro
  // ============================
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.proveedorId) newErrors.proveedorId = "Selecciona un proveedor.";
    if (!formData.productos.length) {
      newErrors.productos = "Agrega al menos un producto.";
    } else {
      formData.productos.forEach((p, i) => {
        if (!p.productoId) newErrors[`prod_${i}`] = "Selecciona el producto.";
        const qty = parseInt(p.cantidad, 10);
        if (p.cantidad === "" || isNaN(qty) || qty < 1)
          newErrors[`qty_${i}`] = "Ingresa una cantidad (mínimo 1).";
        if (!p.precioCompra || p.precioCompra <= 0)
          newErrors[`precioC_${i}`] = "Precio de compra requerido.";
        if (!p.precioVenta || p.precioVenta <= 0)
          newErrors[`precioV_${i}`] = "Precio de venta requerido.";
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ── REACT QUERY: Mutación para crear compra ────────────────────────────────
  const crearCompraMutation = useMutation({
    mutationFn: createCompra,
    onSuccess: (result) => {
      // Invalidar listas que dependen de compras y stock
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["productos-activos"] });
      onSubmitSuccess?.(result);
    },
    onError: (error) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al guardar la compra";
      setApiError(msg);
      onError?.(msg);
    },
  });

  // ============================
  // Submit
  // ============================
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setApiError("");
    crearCompraMutation.mutate({
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
  }, [formData, validate, crearCompraMutation]);

  return {
    formData,
    errors,
    proveedores,
    catalogo,
    loadingData,
    submitting: crearCompraMutation.isPending,
    apiError: apiError || apiErrorCarga,
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
    recargarProveedores,
  };
}