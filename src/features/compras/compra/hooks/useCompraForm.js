import { useState, useEffect, useCallback } from "react";
import { createCompra, updateCompra } from "../services/comprasService";
import { getProveedoresActivos } from "../../proveedor/services/proveedoresService";
import { getAllProductos } from "../../producto/services/productosService";
import { EMPTY_PRODUCT_ROW, calculateTotals } from "../utils/comprasUtils";

export function useCompraForm({ mode = "create", initialData = null, onSubmitSuccess, onError }) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    proveedorId: "",
    observaciones: "",
    productos: [{ ...EMPTY_PRODUCT_ROW }],
  });

  const [errors, setErrors] = useState({});
  const [proveedores, setProveedores] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // ============================
  // Cargar datos de dependencias
  // ============================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingData(true);
        const [proveedoresData, productosData] = await Promise.all([
          getProveedoresActivos(),
          getAllProductos(),
        ]);
        
        setProveedores(proveedoresData);
        setCatalogo(
          productosData.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            precio: Number(p.precio_compra ?? p.precioCompra ?? 0),
            stock: Number(p.stock ?? p.stockActual ?? 0),
          }))
        );
      } catch (error) {
        console.error("Error cargando datos:", error);
        setApiError("No se pudieron cargar proveedores o productos.");
      } finally {
        setLoadingData(false);
      }
    };
    cargarDatos();
  }, []);

  // ============================
  // Cargar datos iniciales (edición)
  // ============================
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      proveedorId: initialData.proveedorId ?? "",
      observaciones: initialData.observaciones ?? "",
      productos: initialData.productos?.length
        ? initialData.productos.map((p) => ({
            id: p.id,
            productoId: p.productoId ?? "",
            nombre: p.nombre ?? "",
            stock: p.stock ?? 0,
            cantidad: p.cantidad,
            precioUnitario: p.precioUnitario,
            total: p.total,
          }))
        : [{ ...EMPTY_PRODUCT_ROW }],
    });
  }, [initialData]);

  // ============================
  // Calcular totales
  // ============================
  const { subtotal, iva, total } = calculateTotals(formData.productos);
  const formatCurrency = (n) => `$${Number(n).toLocaleString("es-CO")}`;

  // ============================
  // Handlers de productos
  // ============================
  const handleProductoChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const productos = [...prev.productos];
      const row = { ...productos[index] };

      if (field === "productoId") {
        const found = catalogo.find((p) => p.id === Number(value));
        row.productoId = value;
        row.nombre = found?.nombre ?? "";
        row.stock = found?.stock ?? 0;
        row.precioUnitario = found?.precio ?? 0;
        row.cantidad = Math.min(row.cantidad, found?.stock ?? row.cantidad) || 1;
        row.total = row.cantidad * row.precioUnitario;
        setErrors((e) => ({ ...e, [`prod_${index}`]: "" }));
      } else if (field === "cantidad") {
        const max = row.stock || Infinity;
        const qty = Math.max(1, Math.min(Number(value) || 1, max));
        row.cantidad = qty;
        row.total = qty * row.precioUnitario;
        setErrors((e) => ({ ...e, [`qty_${index}`]: "" }));
      } else if (field === "precioUnitario") {
        const precio = Math.max(0, Number(value) || 0);
        row.precioUnitario = precio;
        row.total = row.cantidad * precio;
        setErrors((e) => ({ ...e, [`precio_${index}`]: "" }));
      }

      productos[index] = row;
      return { ...prev, productos };
    });
  }, [catalogo]);

  const addRow = useCallback(() => {
    setFormData((prev) => ({ ...prev, productos: [...prev.productos, { ...EMPTY_PRODUCT_ROW }] }));
  }, []);

  const removeRow = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  }, []);

  // ============================
  // Handle change general
  // ============================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  // ============================
  // Validaciones
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
        if (!p.precioUnitario || p.precioUnitario <= 0) newErrors[`precio_${i}`] = "Precio requerido.";
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================
  // Submit
  // ============================
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        proveedorId: Number(formData.proveedorId),
        observaciones: formData.observaciones,
        productos: formData.productos.map((p) => ({
          id: p.id,
          productoId: Number(p.productoId),
          cantidad: Number(p.cantidad),
          precioUnitario: Number(p.precioUnitario),
        })),
      };

      let result;
      if (isCreate) {
        result = await createCompra(payload);
      } else {
        result = await updateCompra(initialData.id, payload);
      }

      onSubmitSuccess?.(result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error al guardar compra:", error);
      const errorMessage = error.response?.data?.message || "Error al guardar la compra";
      setApiError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [formData, isCreate, initialData, validate, onSubmitSuccess, onError]);

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
    handleChange,
    handleProductoChange,
    addRow,
    removeRow,
    handleSubmit,
    setFormData,
  };
}