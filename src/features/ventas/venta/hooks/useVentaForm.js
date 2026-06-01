import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ventasService } from "../services/ventasService";
import { ESTADOS_VENTA, METODOS_PAGO, METODOS_ENTREGA, formatCurrency } from "../utils/ventasUtils";

export function useVentaForm({ mode = "view", initialData = null, onSuccess, onError }) {
  const isView   = mode === "view";
  const isCreate = mode === "create";

  const queryClient = useQueryClient();

  // ── Catálogos — solo en crear ─────────────────────────────────────────────
  const { data: clientes = [],  isLoading: loadingClientes  } = useQuery({
    queryKey: ["clientes-activos"],
    queryFn:  () => ventasService.getClientesActivos(),
    enabled:  isCreate,
    staleTime: 60_000,
  });
  const { data: productos = [], isLoading: loadingProductos } = useQuery({
    queryKey: ["productos-activos"],
    queryFn:  () => ventasService.getProductosActivos(),
    enabled:  isCreate,
    staleTime: 60_000,
  });
  const { data: servicios = [], isLoading: loadingServicios } = useQuery({
    queryKey: ["servicios-activos"],
    queryFn:  () => ventasService.getServiciosActivos(),
    enabled:  isCreate,
    staleTime: 60_000,
  });

  const catalogLoading = isCreate && (loadingClientes || loadingProductos || loadingServicios);

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    cliente_id:                "",
    metodo_pago:               "efectivo",
    metodo_entrega:            "tienda",
    direccion_entrega:         "",
    transferencia_comprobante: "",
  });
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [stockWarning, setStockWarning] = useState("");
  const [saving,       setSaving]       = useState(false);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  // ── Para view: leer de initialData directamente ───────────────────────────
  const detalles = initialData?.detalles ?? [];
  const abonos   = initialData?.abonos   ?? [];

  // ── Total ─────────────────────────────────────────────────────────────────
  const calcularTotal = () =>
    itemsSeleccionados.reduce((s, i) => s + (i.precio ?? 0) * i.cantidad, 0);

  const calcularTotalAbonado = () =>
    abonos.reduce((s, a) => s + (a.monto_abonado || 0), 0);

  const saldoPendiente = (initialData?.total ?? 0) - calcularTotalAbonado();

  // ── Agregar item ──────────────────────────────────────────────────────────
  const agregarItem = (item) => {
    setStockWarning("");
    const esProducto = item.tipo === "producto";
    const keyId = esProducto ? "producto_id" : "servicio_id";
    const existente = itemsSeleccionados.find((i) => i[keyId] === item.id);

    if (existente) {
      if (esProducto && existente.cantidad >= (item.stock ?? Infinity)) {
        setStockWarning(`Límite de stock alcanzado para "${item.nombre}" (${item.stock} disponibles)`);
        return;
      }
      setItemsSeleccionados((prev) =>
        prev.map((i) => i[keyId] === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      );
    } else {
      setItemsSeleccionados((prev) => [
        ...prev,
        { [keyId]: item.id, nombre: item.nombre, descripcion: item.descripcion,
          precio: item.precio, cantidad: 1,
          stock: esProducto ? (item.stock ?? null) : null,
          tipo: item.tipo },
      ]);
    }
  };

  const removerItem = (index) => {
    setStockWarning("");
    setItemsSeleccionados((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    setStockWarning("");
    if (nuevaCantidad < 1) { removerItem(index); return; }
    const item = itemsSeleccionados[index];
    if (item.tipo === "producto" && item.stock !== null && nuevaCantidad > item.stock) {
      setStockWarning(`Stock máx. para "${item.nombre}": ${item.stock}`);
      return;
    }
    setItemsSeleccionados((prev) =>
      prev.map((it, i) => i === index ? { ...it, cantidad: nuevaCantidad } : it)
    );
  };

  // ── Crear venta directa ───────────────────────────────────────────────────
  const crearVenta = async (overrides = {}) => {
    if (!formData.cliente_id) {
      setNotification({ isVisible: true, message: "Seleccione un cliente.", type: "error" });
      return;
    }
    if (itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Agregue al menos un producto o servicio.", type: "error" });
      return;
    }
    if (!formData.metodo_pago) {
      setNotification({ isVisible: true, message: "Seleccione el método de pago.", type: "error" });
      return;
    }
    if (formData.metodo_entrega === "domicilio" && !formData.direccion_entrega.trim()) {
      setNotification({ isVisible: true, message: "Ingrese la dirección de entrega.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      await ventasService.createVenta({ ...formData, ...overrides, items: itemsSeleccionados });
      // Invalidar cache para que la lista se actualice con la nueva venta al inicio
      await queryClient.invalidateQueries({ queryKey: ["ventas"] });
      setNotification({ isVisible: true, message: "Venta registrada correctamente.", type: "success" });
      setTimeout(() => { if (onSuccess) onSuccess(); }, 1200);
    } catch (error) {
      const msg = error?.response?.data?.error ?? "Error al crear la venta.";
      setNotification({ isVisible: true, message: msg, type: "error" });
      if (onError) onError(msg);
    } finally {
      setSaving(false);
    }
  };

  const clienteNombreVisible =
    clientes.find((c) => c.id === Number(formData.cliente_id))?.nombre ?? "";

  const mostrarTabla = itemsSeleccionados.length > 0;

  return {
    clientes, productos, servicios, catalogLoading,
    stockWarning,
    formData, setFormData,
    itemsSeleccionados,
    detalles, abonos,
    saving,
    notification, setNotification,
    isView, isCreate,
    clienteNombreVisible, mostrarTabla,
    agregarItem, removerItem, actualizarCantidad,
    crearVenta,
    calcularTotal, calcularTotalAbonado,
    saldoPendiente,
    formatCurrency,
    ESTADOS_VENTA, METODOS_PAGO, METODOS_ENTREGA,
  };
}