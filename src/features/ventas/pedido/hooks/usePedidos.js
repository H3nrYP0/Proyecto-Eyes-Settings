import { useState, useEffect, useCallback } from "react";
import { pedidosService } from "../services/pedidosService";
import { formatCurrency, ESTADOS_ABONABLE } from "../utils/pedidosUtils";

export function usePedidos() {
  const [pedidos,      setPedidos]      = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading,      setLoading]      = useState(true);

  const [modalDelete, setModalDelete] = useState({ open: false, id: null, cliente: "" });
  const [modalAbono,  setModalAbono]  = useState({
    open: false, pedidoRef: null, pedidoId: null,
    cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [],
  });
  const [montoAbono,   setMontoAbono]   = useState("");
  const [abonoLoading, setAbonoLoading] = useState(false);

  // ── Cargar pedidos ─────────────────────────────────────────────────────────
  const cargarPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getAllPedidos();
      setPedidos(data ?? []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error?.response?.data ?? error?.message ?? error);
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
      await pedidosService.deletePedido(modalDelete.id);
      setPedidos((prev) => prev.filter((p) => p.id !== modalDelete.id));
    } catch (error) {
      alert(
        error?.response?.data?.error ??
        "No se pudo eliminar el pedido. Puede que ya tenga una venta asociada."
      );
    } finally {
      setModalDelete({ open: false, id: null, cliente: "" });
    }
  }, [modalDelete.id]);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, cliente: "" });
  }, []);

  // ── Abono: abrir modal ─────────────────────────────────────────────────────
  const handleAbonar = useCallback(async (pedido) => {
    setAbonoLoading(true);
    try {
      const info = await pedidosService.getInfoAbonos(pedido.id, pedido.total);
      setModalAbono({
        open: true, pedidoRef: pedido,
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
      alert("Error al cargar información de abonos.");
    } finally {
      setAbonoLoading(false);
    }
  }, []);

  // ── Abono: confirmar ───────────────────────────────────────────────────────
  const confirmAbono = useCallback(async () => {
    const monto = Number(montoAbono);

    if (!monto || monto <= 0) {
      alert("El monto del abono debe ser mayor a 0.");
      return;
    }
    if (monto > modalAbono.saldoPendiente) {
      alert(`El abono no puede exceder el saldo pendiente de ${formatCurrency(modalAbono.saldoPendiente)}.`);
      return;
    }

    setAbonoLoading(true);
    try {
      // 1. Registrar el abono en el backend
      const { saldoPendiente: nuevoSaldo } = await pedidosService.registrarAbono(
        modalAbono.pedidoId,
        monto
      );

      if (nuevoSaldo <= 0) {
        // 2. Pago completo → marcar el pedido como entregado
        //    El backend crea la Venta automáticamente al recibir estado=entregado
        await pedidosService.updatePedido(modalAbono.pedidoId, { estado: "entregado" });

        // Actualizar fila en la tabla
        setPedidos((prev) =>
          prev.map((p) => p.id === modalAbono.pedidoId ? { ...p, estado: "entregado" } : p)
        );
        alert(`✅ Pago completo. El pedido de ${modalAbono.cliente} ha sido marcado como Entregado.`);
        setModalAbono({ open: false, pedidoRef: null, pedidoId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
        setMontoAbono("");
      } else {
        // 3. Pago parcial → refrescar historial y dejar modal abierto
        const info = await pedidosService.getInfoAbonos(modalAbono.pedidoId, modalAbono.total);
        alert(`✅ Abono de ${formatCurrency(monto)} registrado. Saldo pendiente: ${formatCurrency(info.saldoPendiente)}.`);
        setModalAbono((prev) => ({
          ...prev,
          totalAbonado:   info.totalAbonado,
          saldoPendiente: info.saldoPendiente,
          abonos:         info.abonos,
        }));
        setMontoAbono("");
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? error?.message ?? "Error al registrar el abono.";
      alert(`❌ ${msg}`);
    } finally {
      setAbonoLoading(false);
    }
  }, [montoAbono, modalAbono]);

  const closeAbonoModal = useCallback(() => {
    setModalAbono({ open: false, pedidoRef: null, pedidoId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
    setMontoAbono("");
  }, []);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = (pedido.cliente || "").toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || pedido.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "",               label: "Todos los estados" },
    { value: "pendiente",      label: "Pendiente" },
    { value: "confirmado",     label: "Confirmado" },
    { value: "en_preparacion", label: "En preparación" },
    { value: "enviado",        label: "Enviado" },
    { value: "entregado",      label: "Entregado" },
    { value: "cancelado",      label: "Cancelado" },
  ];

  const obtenerDescripcionItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return "Sin ítems";
    return "Productos";
  };

  const obtenerCantidadItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return 0;
    return pedido.items.reduce((sum, item) => sum + (item.cantidad ?? 1), 0);
  };

  return {
    pedidos: filteredPedidos,
    loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    modalDelete, handleDelete, confirmDelete, closeDeleteModal,
    modalAbono, montoAbono, setMontoAbono,
    abonoLoading, handleAbonar, confirmAbono, closeAbonoModal,
    formatCurrency,
    obtenerCantidadItems,
    obtenerDescripcionItems,
    ESTADOS_ABONABLE,
  };
}