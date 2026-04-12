import { useState, useEffect } from "react";
import { pedidosService } from "../services/pedidosService";
import { ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA, formatCurrency } from "../utils/pedidosUtils";

export function usePedidoForm({ mode = "create", initialData = null, onSuccess, onError }) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";

  const [clientes,      setClientes]      = useState([]);
  const [productos,     setProductos]     = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [abonosInfo,    setAbonosInfo]    = useState(null);

  const [formData, setFormData] = useState({
    cliente_id:              "",
    metodo_pago:             "efectivo",
    metodo_entrega:          "tienda",
    direccion_entrega:       "",
    transferencia_comprobante: "",
    estado:                  "pendiente",
  });
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });
  const [saving, setSaving] = useState(false);

  // Cargar catálogos
  useEffect(() => {
    const cargar = async () => {
      try {
        const [cli, prod] = await Promise.all([
          pedidosService.getClientesActivos(),
          pedidosService.getProductosActivos(),
        ]);
        setClientes(cli);
        setProductos(prod);
      } catch (err) {
        console.error("Error cargando catálogos:", err);
      } finally {
        setCatalogLoading(false);
      }
    };
    cargar();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente_id:              initialData.cliente_id ?? "",
        // El backend devuelve estado_nombre mapeado a estado por _toUI
        metodo_pago:             initialData.metodo_pago             ?? "efectivo",
        metodo_entrega:          initialData.metodo_entrega          ?? "tienda",
        direccion_entrega:       initialData.direccion_entrega       ?? "",
        transferencia_comprobante: initialData.transferencia_comprobante ?? "",
        estado:                  initialData.estado                  ?? "pendiente",
      });

      if (Array.isArray(initialData.items) && initialData.items.length > 0) {
        setItemsSeleccionados(initialData.items);
      }

      // Cargar abonos en vista (cualquier estado)
      if (isView && initialData.id) {
        pedidosService.getInfoAbonos(initialData.id, initialData.total ?? 0)
          .then((info) => { if (info.abonos.length > 0) setAbonosInfo(info); })
          .catch(() => {});
      }
    }
  }, [initialData, isView]);

  const calcularTotal = () =>
    itemsSeleccionados.reduce((sum, item) => sum + (item.precio ?? 0) * item.cantidad, 0);

  const agregarItem = (producto) => {
    const existente = itemsSeleccionados.find((i) => i.producto_id === producto.id);
    if (existente) {
      setItemsSeleccionados(
        itemsSeleccionados.map((i) =>
          i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      );
    } else {
      setItemsSeleccionados([
        ...itemsSeleccionados,
        {
          producto_id: producto.id,
          nombre:      producto.nombre,
          descripcion: producto.descripcion,
          precio:      producto.precio,
          cantidad:    1,
          tipo:        "producto",
        },
      ]);
    }
  };

  const removerItem = (index) => {
    const nuevos = [...itemsSeleccionados];
    nuevos.splice(index, 1);
    setItemsSeleccionados(nuevos);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) { removerItem(index); return; }
    const nuevos = [...itemsSeleccionados];
    nuevos[index] = { ...nuevos[index], cantidad: nuevaCantidad };
    setItemsSeleccionados(nuevos);
  };

  const guardarPedido = async () => {
    if (!formData.cliente_id) {
      setNotification({ isVisible: true, message: "Por favor seleccione un cliente.", type: "error" });
      return;
    }
    if (isCreate && itemsSeleccionados.length === 0) {
      setNotification({ isVisible: true, message: "Por favor agregue al menos un producto.", type: "error" });
      return;
    }
    if (!formData.metodo_pago) {
      setNotification({ isVisible: true, message: "Por favor seleccione el método de pago.", type: "error" });
      return;
    }
    if (!formData.metodo_entrega) {
      setNotification({ isVisible: true, message: "Por favor seleccione el método de entrega.", type: "error" });
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
        // 1. Actualizar datos del pedido (sin items ni total)
        await pedidosService.updatePedido(initialData.id, {
          metodo_pago:               payload.metodo_pago,
          metodo_entrega:            payload.metodo_entrega,
          direccion_entrega:         payload.direccion_entrega,
          transferencia_comprobante: payload.transferencia_comprobante,
          estado:                    payload.estado,
        });

        // 2. Sincronizar items: comparar originales vs actuales
        const itemsOriginales = initialData.items ?? [];

        // Items eliminados: estaban en original pero ya no están
        for (const orig of itemsOriginales) {
          const aun = itemsSeleccionados.find((i) => i.id === orig.id);
          if (!aun) {
            await pedidosService.deleteDetallePedido(orig.id);
          }
        }

        // Items modificados: mismo id pero distinta cantidad
        for (const item of itemsSeleccionados) {
          if (!item.id) continue; // item nuevo, no tiene id del backend
          const orig = itemsOriginales.find((o) => o.id === item.id);
          if (orig && orig.cantidad !== item.cantidad) {
            await pedidosService.updateDetallePedido(item.id, {
              cantidad: item.cantidad,
              precio_unitario: item.precio,
            });
          }
        }

        // Items nuevos: están en actuales pero no tienen id (se agregaron en el form)
        for (const item of itemsSeleccionados) {
          if (item.id) continue; // ya existe en el backend
          await pedidosService.createDetallePedido({
            pedido_id:      initialData.id,
            producto_id:    item.producto_id,
            cantidad:       item.cantidad,
            precio_unitario: item.precio,
          });
        }

        setNotification({ isVisible: true, message: "Pedido actualizado correctamente.", type: "success" });
        if (onSuccess) onSuccess(payload);
      } else {
        await pedidosService.createPedido(payload);
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
    initialData?.cliente ?? clientes.find((c) => c.id === Number(formData.cliente_id))?.nombre ?? "";

  const mostrarTabla = itemsSeleccionados.length > 0;

  return {
    clientes, productos, catalogLoading,
    abonosInfo, formData, setFormData,
    itemsSeleccionados, notification, setNotification,
    saving, isView, isEdit, isCreate,
    clienteNombreVisible, mostrarTabla,
    calcularTotal, formatCurrency,
    agregarItem, removerItem, actualizarCantidad, guardarPedido,
    ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA,
  };
}