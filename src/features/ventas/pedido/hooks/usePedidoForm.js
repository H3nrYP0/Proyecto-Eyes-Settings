import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pedidosService } from "../services/pedidosService";
import { ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA, formatCurrency } from "../utils/pedidosUtils";

export function usePedidoForm({ mode = "create", initialData = null, onSuccess, onError }) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";

  const queryClient = useQueryClient();

  // ── Catálogos con React Query ─────────────────────────────────────────────
  const { data: clientes = [],  isLoading: loadingClientes  } = useQuery({
    queryKey: ["clientes-activos"],
    queryFn:  () => pedidosService.getClientesActivos(),
    staleTime: 60_000,
  });
  const { data: productos = [], isLoading: loadingProductos } = useQuery({
    queryKey: ["productos-activos"],
    queryFn:  () => pedidosService.getProductosActivos(),
    staleTime: 60_000,
  });
  const { data: servicios = [], isLoading: loadingServicios } = useQuery({
    queryKey: ["servicios-activos"],
    queryFn:  () => pedidosService.getServiciosActivos(),
    staleTime: 60_000,
  });

  const catalogLoading = loadingClientes || loadingProductos || loadingServicios;

  const [abonosInfo,   setAbonosInfo]   = useState(null);
  const [stockWarning, setStockWarning] = useState("");

  const [formData, setFormData] = useState({
    cliente_id:                "",
    metodo_pago:               "efectivo",
    metodo_entrega:            "tienda",
    direccion_entrega:         "",
    transferencia_comprobante: "",
    estado:                    "pendiente",
    abono_inicial:             "",
  });
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });
  const [saving, setSaving] = useState(false);

  // ── Cargar datos iniciales ────────────────────────────────────────────────
  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente_id:                initialData.cliente_id              ?? "",
        metodo_pago:               initialData.metodo_pago             ?? "efectivo",
        metodo_entrega:            initialData.metodo_entrega          ?? "tienda",
        direccion_entrega:         initialData.direccion_entrega       ?? "",
        transferencia_comprobante: initialData.transferencia_comprobante ?? "",
        estado:                    initialData.estado                  ?? "pendiente",
        abono_inicial:             "",
      });
      if (Array.isArray(initialData.items) && initialData.items.length > 0) {
        setItemsSeleccionados(initialData.items);
      }
      if ((isView || isEdit) && initialData.id) {
        pedidosService.getInfoAbonos(initialData.id, initialData.total ?? 0)
          .then((info) => { if (info.abonos.length > 0) setAbonosInfo(info); })
          .catch(() => {});
      }
    }
  }, [initialData, isView, isEdit]);

  const calcularTotal = () =>
    itemsSeleccionados.reduce((sum, item) => sum + (item.precio ?? 0) * item.cantidad, 0);

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
      setItemsSeleccionados(
        itemsSeleccionados.map((i) =>
          i[keyId] === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setItemsSeleccionados([
        ...itemsSeleccionados,
        {
          [keyId]:     item.id,
          nombre:      item.nombre,
          descripcion: item.descripcion,
          precio:      item.precio,
          cantidad:    1,
          stock:       esProducto ? (item.stock ?? null) : null,
          tipo:        item.tipo,
        },
      ]);
    }
  };

  const removerItem = (index) => {
    setStockWarning("");
    const nuevos = [...itemsSeleccionados];
    nuevos.splice(index, 1);
    setItemsSeleccionados(nuevos);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    setStockWarning("");
    if (nuevaCantidad < 1) { removerItem(index); return; }
    const item = itemsSeleccionados[index];
    if (item.tipo === "producto" && item.stock !== null && nuevaCantidad > item.stock) {
      setStockWarning(`No hay más unidades disponibles de "${item.nombre}" (stock máx: ${item.stock})`);
      return;
    }
    const nuevos = [...itemsSeleccionados];
    nuevos[index] = { ...nuevos[index], cantidad: nuevaCantidad };
    setItemsSeleccionados(nuevos);
  };

  // ── Guardar ───────────────────────────────────────────────────────────────
  const guardarPedido = async () => {
    if (!formData.cliente_id) {
      setNotification({ isVisible: true, message: "Por favor seleccione un cliente.", type: "error" });
      return;
    }
    if (isCreate && itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Agregue al menos un producto o servicio.", type: "error" });
      return;
    }
    if (!formData.metodo_pago) {
      setNotification({ isVisible: true, message: "Seleccione el método de pago.", type: "error" });
      return;
    }
    if (!formData.metodo_entrega) {
      setNotification({ isVisible: true, message: "Seleccione el método de entrega.", type: "error" });
      return;
    }
    if (formData.metodo_entrega === "domicilio" && !formData.direccion_entrega.trim()) {
      setNotification({ isVisible: true, message: "Ingrese la dirección de entrega.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, items: itemsSeleccionados };

      if (isEdit && initialData?.id) {
        const estadoAnterior = initialData.estado;
        const estadoNuevo    = payload.estado;

        await pedidosService.updatePedido(initialData.id, {
          metodo_pago:               payload.metodo_pago,
          metodo_entrega:            payload.metodo_entrega,
          direccion_entrega:         payload.direccion_entrega,
          transferencia_comprobante: payload.transferencia_comprobante,
          estado:                    estadoNuevo,
        });

        // Sincronizar items
        const itemsOriginales = initialData.items ?? [];
        for (const orig of itemsOriginales) {
          const aun = itemsSeleccionados.find((i) => i.id === orig.id);
          if (!aun) await pedidosService.deleteDetallePedido(orig.id);
        }
        for (const item of itemsSeleccionados) {
          if (!item.id) continue;
          const orig = itemsOriginales.find((o) => o.id === item.id);
          if (orig && orig.cantidad !== item.cantidad) {
            await pedidosService.updateDetallePedido(item.id, {
              cantidad: item.cantidad, precio_unitario: item.precio,
            });
          }
        }
        for (const item of itemsSeleccionados) {
          if (item.id) continue;
          await pedidosService.createDetallePedido({
            pedido_id:       initialData.id,
            ...(item.producto_id && { producto_id: item.producto_id }),
            ...(item.servicio_id && { servicio_id: item.servicio_id }),
            cantidad:        item.cantidad,
            precio_unitario: item.precio,
          });
        }

        // Si cambió a pagado → el back crea la venta, invalidar cache de ventas
        if (estadoNuevo === "pagado" && estadoAnterior !== "pagado") {
          await queryClient.invalidateQueries({ queryKey: ["ventas"] });
        }
        // Siempre refrescar pedidos
        await queryClient.invalidateQueries({ queryKey: ["pedidos"] });

        setNotification({ isVisible: true, message: "Pedido actualizado correctamente.", type: "success" });
        if (onSuccess) setTimeout(() => onSuccess(payload), 1200);

      } else {
        // CREAR pedido
        const nuevoPedido = await pedidosService.createPedido(payload);
        const abonoInicial = parseFloat(formData.abono_inicial);

        if (!isNaN(abonoInicial) && abonoInicial > 0 && nuevoPedido?.id) {
          const total      = calcularTotal();
          const montoAbono = Math.min(abonoInicial, total);
          await pedidosService.registrarAbono(nuevoPedido.id, montoAbono);

          // Si el abono cubre el total → marcar pagado → el back crea la venta
          if (montoAbono >= total) {
            await pedidosService.updatePedido(nuevoPedido.id, { estado: "pagado" });
            await queryClient.invalidateQueries({ queryKey: ["ventas"] });
          }
        }

        await queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        setNotification({ isVisible: true, message: "Pedido creado correctamente.", type: "success" });
        setTimeout(() => { if (onSuccess) onSuccess(); }, 1200);
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? "Error al guardar el pedido.";
      setNotification({ isVisible: true, message: msg, type: "error" });
      if (onError) onError(msg);
    } finally {
      setSaving(false);
    }
  };

  const clienteNombreVisible =
    initialData?.cliente ??
    clientes.find((c) => c.id === Number(formData.cliente_id))?.nombre ?? "";

  const mostrarTabla  = itemsSeleccionados.length > 0;
  const pedidoAnulado = formData.estado === "anulado";
  const pedidoPagado  = formData.estado === "pagado";

  return {
    clientes, productos, servicios, catalogLoading,
    abonosInfo, formData, setFormData,
    itemsSeleccionados, notification, setNotification,
    saving, isView, isEdit, isCreate,
    clienteNombreVisible, mostrarTabla, stockWarning,
    pedidoAnulado, pedidoPagado,
    calcularTotal, formatCurrency,
    agregarItem, removerItem, actualizarCantidad, guardarPedido,
    ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA,
  };
}