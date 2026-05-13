import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pedidosService } from "../services/pedidosService";
import { formatCurrency, ESTADOS_ABONABLE } from "../utils/pedidosUtils";

export function usePedidos() {
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  const [modalDelete, setModalDelete] = useState({ open: false, id: null, cliente: "" });
  const [modalAbono,  setModalAbono]  = useState({
    open: false, pedidoId: null,
    cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [],
  });
  const [montoAbono,   setMontoAbono]   = useState("");
  const [abonoLoading, setAbonoLoading] = useState(false);

  // ── Carga con React Query ─────────────────────────────────────────────────
  const { data: allPedidos = [], isLoading: loading } = useQuery({
    queryKey: ["pedidos"],
    queryFn:  () => pedidosService.getAllPedidos(),
    staleTime: 30_000,
  });

  const showNotif = useCallback((message, type = "success") => {
    setNotification({ isVisible: true, message, type });
  }, []);

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = useCallback((id, cliente) => {
    setModalDelete({ open: true, id, cliente });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const info = await pedidosService.getInfoAbonos(modalDelete.id, 0);
      if (info.abonos.length > 0) {
        showNotif(
          `No se puede eliminar el pedido de "${modalDelete.cliente}" porque ya tiene abonos registrados.`,
          "error"
        );
        setModalDelete({ open: false, id: null, cliente: "" });
        return;
      }
      await pedidosService.deletePedido(modalDelete.id);
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      showNotif(`Pedido de "${modalDelete.cliente}" eliminado correctamente`, "success");
    } catch (error) {
      const msg = error?.response?.data?.error ?? "No se pudo eliminar el pedido.";
      showNotif(msg, "error");
    } finally {
      setModalDelete({ open: false, id: null, cliente: "" });
    }
  }, [modalDelete.id, modalDelete.cliente, showNotif, queryClient]);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, cliente: "" });
  }, []);

  // ── Abono: abrir modal ─────────────────────────────────────────────────────
  const handleAbonar = useCallback(async (pedido) => {
    setAbonoLoading(true);
    try {
      const info = await pedidosService.getInfoAbonos(pedido.id, pedido.total);
      setModalAbono({
        open: true, pedidoId: pedido.id,
        cliente: pedido.cliente,
        total: pedido.total,
        totalAbonado:   info.totalAbonado,
        saldoPendiente: info.saldoPendiente,
        abonos:         info.abonos,
      });
      setMontoAbono("");
    } catch {
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
      // 1. Registrar el abono
      const { saldoPendiente: nuevoSaldo } = await pedidosService.registrarAbono(
        modalAbono.pedidoId, monto
      );

      if (nuevoSaldo <= 0) {
        // 2. El saldo quedó en 0 → marcar como PAGADO vía PUT
        //    Esto dispara la creación de venta en el back (update_pedido → transición a pagado)
        await pedidosService.updatePedido(modalAbono.pedidoId, { estado: "pagado" });

        // 3. Invalidar pedidos Y ventas para que la nueva venta aparezca al inicio
        await queryClient.invalidateQueries({ queryKey: ["pedidos"] });
        await queryClient.invalidateQueries({ queryKey: ["ventas"] });

        showNotif(
          `✅ Pago completo. El pedido de ${modalAbono.cliente} está Pagado y se generó la venta.`,
          "success"
        );
        setModalAbono({
          open: false, pedidoId: null, cliente: "",
          total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [],
        });
        setMontoAbono("");
      } else {
        // Abono parcial — solo refrescar info
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
        // Refrescar pedidos para actualizar abono_acumulado en la tabla
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? "Error al registrar el abono.";
      showNotif(msg, "error");
    } finally {
      setAbonoLoading(false);
    }
  }, [montoAbono, modalAbono, showNotif, queryClient]);

  const closeAbonoModal = useCallback(() => {
    setModalAbono({
      open: false, pedidoId: null, cliente: "",
      total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [],
    });
    setMontoAbono("");
  }, []);

  // ── Filtros ────────────────────────────────────────────────────────────────
  const pedidos = allPedidos.filter((pedido) => {
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

  const obtenerResumenItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return "Sin ítems";
    const totalItems    = pedido.items.length;
    const totalCantidad = pedido.items.reduce((s, i) => s + (i.cantidad ?? 1), 0);
    return `${totalItems} prod. · ${totalCantidad} und.`;
  };

  return {
    pedidos, loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    notification, setNotification,
    modalDelete, handleDelete, confirmDelete, closeDeleteModal,
    modalAbono, montoAbono, setMontoAbono,
    abonoLoading, handleAbonar, confirmAbono, closeAbonoModal,
    formatCurrency,
    obtenerResumenItems,
    ESTADOS_ABONABLE,
  };
}