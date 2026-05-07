import { useState, useEffect, useCallback } from "react";
import { pedidosService } from "../services/pedidosService";
import { formatCurrency, ESTADOS_ABONABLE } from "../utils/pedidosUtils";

export function usePedidos() {
  const [pedidos,      setPedidos]      = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading,      setLoading]      = useState(true);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  const [modalDelete, setModalDelete] = useState({ open: false, id: null, cliente: "" });
  const [modalAbono,  setModalAbono]  = useState({
    open: false, pedidoId: null,
    cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [],
  });
  const [montoAbono,   setMontoAbono]   = useState("");
  const [abonoLoading, setAbonoLoading] = useState(false);

  const showNotif = useCallback((message, type = "success") => {
    setNotification({ isVisible: true, message, type });
  }, []);

  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAllPedidos();
      setPedidos(data ?? []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarPedidos(); }, [cargarPedidos]);

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id, cliente) => {
    setModalDelete({ open: true, id, cliente });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const info = await pedidosService.getInfoAbonos(modalDelete.id, 0);
      if (info.abonos.length > 0) {
        showNotif(
          `No se puede eliminar el pedido de "${modalDelete.cliente}" porque ya tiene abonos registrados. Anúlelo cambiando el estado a "Anulado".`,
          "error"
        );
        setModalDelete({ open: false, id: null, cliente: "" });
        return;
      }
      await pedidosService.deletePedido(modalDelete.id);
      setPedidos((prev) => prev.filter((p) => p.id !== modalDelete.id));
      showNotif(`Pedido de "${modalDelete.cliente}" eliminado correctamente`, "success");
    } catch (error) {
      const msg = error?.response?.data?.error ??
        "No se pudo eliminar el pedido.";
      showNotif(msg, "error");
    } finally {
      setModalDelete({ open: false, id: null, cliente: "" });
    }
  }, [modalDelete.id, modalDelete.cliente, showNotif]);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, cliente: "" });
  }, []);

  // ── Abono: abrir modal ─────────────────────────────────────────────────────
  const handleAbonar = useCallback(async (pedido) => {
    setAbonoLoading(true);
    try {
      const info = await pedidosService.getInfoAbonos(pedido.id, pedido.total);
      setModalAbono({
        open: true,
        pedidoId:       pedido.id,
        cliente:        pedido.cliente,
        total:          pedido.total,
        totalAbonado:   info.totalAbonado,
        saldoPendiente: info.saldoPendiente,
        abonos:         info.abonos,
      });
      setMontoAbono("");
    } catch (error) {
      console.error("Error al cargar abonos:", error);
      showNotif("Error al cargar información de abonos.", "error");
    } finally {
      setAbonoLoading(false);
    }
  }, [showNotif]);

  // ── Abono: confirmar ───────────────────────────────────────────────────────
  const confirmAbono = useCallback(async () => {
    const monto = Number(montoAbono);
    if (!monto || monto <= 0) {
      showNotif("El monto del abono debe ser mayor a 0.", "error");
      return;
    }
    if (monto > modalAbono.saldoPendiente) {
      showNotif(
        `El abono no puede exceder el saldo pendiente de ${formatCurrency(modalAbono.saldoPendiente)}.`,
        "error"
      );
      return;
    }

    setAbonoLoading(true);
    try {
      // El backend ahora cambia automáticamente el estado a "pagado"
      // cuando el abono cubre el total, así que no necesitamos hacer PUT adicional.
      const { saldoPendiente: nuevoSaldo } = await pedidosService.registrarAbono(
        modalAbono.pedidoId, monto
      );

      if (nuevoSaldo <= 0) {
        // Actualizar estado en la lista local a "pagado"
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === modalAbono.pedidoId ? { ...p, estado: "pagado" } : p
          )
        );
        showNotif(
          `✅ Pago completo. El pedido de ${modalAbono.cliente} ha sido marcado como Pagado.`,
          "success"
        );
        setModalAbono({ open: false, pedidoId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
        setMontoAbono("");
      } else {
        const info = await pedidosService.getInfoAbonos(modalAbono.pedidoId, modalAbono.total);
        showNotif(
          `Abono de ${formatCurrency(monto)} registrado. Saldo pendiente: ${formatCurrency(info.saldoPendiente)}.`,
          "success"
        );
        setModalAbono((prev) => ({
          ...prev,
          totalAbonado:   info.totalAbonado,
          saldoPendiente: info.saldoPendiente,
          abonos:         info.abonos,
        }));
        setMontoAbono("");
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? "Error al registrar el abono.";
      showNotif(msg, "error");
    } finally {
      setAbonoLoading(false);
    }
  }, [montoAbono, modalAbono, showNotif]);

  const closeAbonoModal = useCallback(() => {
    setModalAbono({ open: false, pedidoId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
    setMontoAbono("");
  }, []);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = (pedido.cliente || "").toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || pedido.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "",          label: "Todos los estados" },
    { value: "pendiente", label: "Pendiente" },
    { value: "pagado",    label: "Pagado" },
    { value: "anulado",   label: "Anulado" },
  ];

  const obtenerCantidadItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return 0;
    return pedido.items.reduce((sum, item) => sum + (item.cantidad ?? 1), 0);
  };

  const obtenerResumenItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return "Sin ítems";
    const totalItems = pedido.items.length;
    const totalCantidad = pedido.items.reduce((sum, i) => sum + (i.cantidad ?? 1), 0);
    return `${totalItems} prod. · ${totalCantidad} und.`;
  };

  return {
    pedidos: filteredPedidos,
    loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    notification, setNotification,
    modalDelete, handleDelete, confirmDelete, closeDeleteModal,
    modalAbono, montoAbono, setMontoAbono,
    abonoLoading, handleAbonar, confirmAbono, closeAbonoModal,
    formatCurrency,
    obtenerCantidadItems,
    obtenerResumenItems,
    ESTADOS_ABONABLE,
  };
}