// src/features/ventas/pedido/hooks/usePedidoForm.js

import { useState, useEffect } from "react";
import { pedidosService } from "../services/pedidosService";
import { ESTADOS_PEDIDO, METODOS_PAGO, METODOS_ENTREGA, formatCurrency } from "../utils/pedidosUtils";

export function usePedidoForm({ mode = "create", initialData = null, onSuccess, onError }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [abonosInfo, setAbonosInfo] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: "",
    metodo_pago: "efectivo",
    metodo_entrega: "tienda",
    direccion_entrega: "",
    transferencia_comprobante: "",
    estado: "pendiente",
  });
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente_id: initialData.cliente_id ?? "",
        metodo_pago: initialData.metodo_pago ?? "efectivo",
        metodo_entrega: initialData.metodo_entrega ?? "tienda",
        direccion_entrega: initialData.direccion_entrega ?? "",
        transferencia_comprobante: initialData.transferencia_comprobante ?? "",
        estado: initialData.estado ?? "pendiente",
      });

      if (Array.isArray(initialData.items) && initialData.items.length > 0) {
        setItemsSeleccionados(initialData.items);
      }

      if (isView && initialData.id && initialData.estado === "entregado") {
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
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          cantidad: 1,
          tipo: "producto",
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
      const payload = { ...formData, items: itemsSeleccionados, total: calcularTotal() };

      if (isEdit && initialData?.id) {
        await pedidosService.updatePedido(initialData.id, payload);
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
    // Estados
    clientes,
    productos,
    catalogLoading,
    abonosInfo,
    formData,
    setFormData,
    itemsSeleccionados,
    notification,
    setNotification,
    saving,
    isView,
    isEdit,
    isCreate,
    // Computed
    clienteNombreVisible,
    mostrarTabla,
    calcularTotal,
    formatCurrency,
    // Acciones
    agregarItem,
    removerItem,
    actualizarCantidad,
    guardarPedido,
    // Constantes
    ESTADOS_PEDIDO,
    METODOS_PAGO,
    METODOS_ENTREGA,
  };
}