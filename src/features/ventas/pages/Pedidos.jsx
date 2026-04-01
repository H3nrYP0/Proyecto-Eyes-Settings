import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

import { PedidosData } from "../../../lib/data/pedidosData";

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  // Modal eliminar
  const [modalDelete, setModalDelete] = useState({ open: false, id: null, cliente: "" });

  // Modal abono
  const [modalAbono, setModalAbono] = useState({
    open:           false,
    pedidoRef:      null, // pedido completo, necesario para el flujo de abono
    pedidoId:       null,
    ventaId:        null,
    cliente:        "",
    total:          0,
    totalAbonado:   0,
    saldoPendiente: 0,
    abonos:         [],
  });
  const [montoAbono, setMontoAbono]   = useState("");
  const [abonoLoading, setAbonoLoading] = useState(false);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const data = await PedidosData.getAllPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleDelete = (id, cliente) => {
    setModalDelete({ open: true, id, cliente });
  };

  const confirmDelete = async () => {
    try {
      await PedidosData.deletePedido(modalDelete.id);
      setPedidos((prev) => prev.filter((p) => p.id !== modalDelete.id));
    } catch (error) {
      alert(
        error?.response?.data?.error
          ?? "No se pudo eliminar el pedido. Puede que ya tenga una venta asociada."
      );
    } finally {
      setModalDelete({ open: false, id: null, cliente: "" });
    }
  };

  // Se puede abonar en cualquier estado activo excepto entregado y cancelado
  const ESTADOS_ABONABLE = ["pendiente", "confirmado", "en_preparacion", "enviado"];

  // ── Abono: abrir modal ────────────────────────────────────────────────────
  const handleAbonar = async (pedido) => {
    setAbonoLoading(true);
    try {
      // Cargar abonos existentes si ya hay una venta
      const info = await PedidosData.getInfoAbonos(pedido.id, pedido.total);
      setModalAbono({
        open:            true,
        pedidoRef:       pedido, // guardamos el pedido completo para el flujo
        pedidoId:        pedido.id,
        ventaId:         info.ventaId,
        cliente:         pedido.cliente,
        total:           pedido.total,
        totalAbonado:    info.totalAbonado,
        saldoPendiente:  info.saldoPendiente,
        abonos:          info.abonos,
      });
      setMontoAbono("");
    } catch (error) {
      console.error("Error al cargar abonos:", error);
      alert("Error al cargar información de abonos.");
    } finally {
      setAbonoLoading(false);
    }
  };

  // ── Abono: confirmar ──────────────────────────────────────────────────────
  const confirmAbono = async () => {
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
      const { pagoCompleto } = await PedidosData.registrarAbonoConFlujo(
        modalAbono.pedidoRef,
        monto,
        modalAbono.totalAbonado  // totalAbonadoActual antes de este abono
      );

      const nuevoTotalAbonado = modalAbono.totalAbonado + monto;
      const nuevoSaldo = Math.max(0, modalAbono.total - nuevoTotalAbonado);

      if (pagoCompleto) {
        // Pago completo → actualizar fila a entregado
        setPedidos((prev) =>
          prev.map((p) =>
            p.id === modalAbono.pedidoId ? { ...p, estado: "entregado" } : p
          )
        );
        alert(`✅ Pago completo. El pedido de ${modalAbono.cliente} ha sido marcado como Entregado.`);
        setModalAbono({ open: false, pedidoRef: null, pedidoId: null, ventaId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
        setMontoAbono("");
      } else {
        // Pago parcial → actualizar el modal con el nuevo saldo, dejar abierto
        alert(`✅ Abono de ${formatCurrency(monto)} registrado. Saldo pendiente: ${formatCurrency(nuevoSaldo)}.`);
        // Recargar info de abonos para reflejar el nuevo historial
        const info = await PedidosData.getInfoAbonos(modalAbono.pedidoId, modalAbono.total);
        setModalAbono((prev) => ({
          ...prev,
          totalAbonado:   info.totalAbonado,
          saldoPendiente: info.saldoPendiente,
          abonos:         info.abonos,
          ventaId:        info.ventaId,
        }));
        setMontoAbono("");
      }
    } catch (error) {
      const msg = error?.response?.data?.error ?? error?.message ?? "Error al registrar el abono.";
      alert(`❌ ${msg}`);
    } finally {
      setAbonoLoading(false);
    }
  };

  // ── Helpers de presentación ───────────────────────────────────────────────
  const formatCurrency = (amount) => `$${(amount || 0).toLocaleString("es-CO")}`;

  const obtenerDescripcionItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return "Sin ítems";
    return "Productos";
  };

  const obtenerCantidadItems = (pedido) => {
    if (!pedido.items || pedido.items.length === 0) return 0;
    return pedido.items.reduce((sum, item) => sum + (item.cantidad ?? 1), 0);
  };

  // ── Filtros ───────────────────────────────────────────────────────────────
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch  = (pedido.cliente || "").toLowerCase().includes(search.toLowerCase());
    const matchesEstado  = !filterEstado || pedido.estado === filterEstado;
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

  // ── Columnas ──────────────────────────────────────────────────────────────
  const COLORES_ESTADO = {
    pendiente:      { bg: "#fef3c7", color: "#92400e" },
    confirmado:     { bg: "#dbeafe", color: "#1e40af" },
    en_preparacion: { bg: "#ede9fe", color: "#5b21b6" },
    enviado:        { bg: "#d1fae5", color: "#065f46" },
    entregado:      { bg: "#dcfce7", color: "#166534" },
    cancelado:      { bg: "#fee2e2", color: "#991b1b" },
  };

  const columns = [
    {
      field: "cliente",
      header: "Cliente",
      render: (row) => row.cliente || "—",
    },
    {
      field: "items",
      header: "Productos",
      render: (row) => {
        const cantidad = obtenerCantidadItems(row);
        return cantidad > 0
          ? `${cantidad} ${cantidad === 1 ? "ítem" : "ítems"}`
          : "Sin ítems";
      },
    },
    {
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
    {
      field: "abono",
      header: "Abonar",
      render: (row) => {
        const puedeAbonar = ESTADOS_ABONABLE.includes(row.estado);
        return (
          <button
            className="crud-btn crud-btn-primary"
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            onClick={(e) => { e.stopPropagation(); handleAbonar(row); }}
            disabled={!puedeAbonar || abonoLoading}
            title={!puedeAbonar ? "Solo disponible en pedidos confirmados, en preparación o enviados" : "Registrar abono"}
          >
            Abonar
          </button>
        );
      },
    },
  ];

  const tableActions = [
    { label: "Ver Detalles", type: "view",   onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: "Editar",       type: "edit",   onClick: (row) => navigate(`editar/${row.id}`) },
    { label: "Eliminar",     type: "delete", onClick: (row) => handleDelete(row.id, row.cliente) },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        tr.row-entregado td { background-color: #f0fdf4 !important; }
        tr.row-cancelado td { background-color: #fef2f2 !important; color: #9ca3af !important; opacity: 0.8; }
        .crud-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .abono-historial { max-height: 140px; overflow-y: auto; margin-top: 8px; }
        .abono-row { display: flex; justify-content: space-between; font-size: 0.82rem;
          padding: 4px 0; border-bottom: 1px solid #f3f4f6; }
      `}</style>

      <CrudLayout
        title="Pedidos"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por cliente..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            Cargando pedidos...
          </div>
        ) : (
          <CrudTable
            columns={columns}
            data={filteredPedidos}
            actions={tableActions}
            rowClassName={(row) =>
              row.estado === "entregado" ? "row-entregado"
              : row.estado === "cancelado" ? "row-cancelado"
              : ""
            }
            emptyMessage={
              search || filterEstado
                ? "No se encontraron pedidos para los filtros aplicados"
                : "No hay pedidos registrados"
            }
          />
        )}

        {/* Modal eliminar */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Pedido?"
          message={`Esta acción eliminará el pedido de "${modalDelete.cliente}" y no se puede deshacer. No se puede eliminar si ya generó una venta.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() => setModalDelete({ open: false, id: null, cliente: "" })}
        />

        {/* Modal abono */}
        <Modal
          open={modalAbono.open}
          type="info"
          title="Registrar Abono"
          message={
            <div>
              <p><strong>Cliente:</strong> {modalAbono.cliente}</p>
              <p><strong>Total del pedido:</strong> {formatCurrency(modalAbono.total)}</p>
              <p><strong>Total abonado:</strong>{" "}
                <span style={{ color: "#10b981", fontWeight: 600 }}>
                  {formatCurrency(modalAbono.totalAbonado)}
                </span>
              </p>
              <p><strong>Saldo pendiente:</strong>{" "}
                <span style={{ color: modalAbono.saldoPendiente > 0 ? "#ef4444" : "#10b981", fontWeight: 600 }}>
                  {formatCurrency(modalAbono.saldoPendiente)}
                </span>
              </p>

              {/* Historial de abonos */}
              {modalAbono.abonos.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#6b7280", marginBottom: 4 }}>
                    Historial de abonos:
                  </p>
                  <div className="abono-historial">
                    {modalAbono.abonos.map((a) => (
                      <div key={a.id} className="abono-row">
                        <span style={{ color: "#6b7280" }}>
                          {a.fecha ? new Date(a.fecha).toLocaleDateString("es-CO") : "—"}
                        </span>
                        <span style={{ color: "#10b981", fontWeight: 600 }}>
                          +{formatCurrency(a.monto_abonado)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input nuevo abono */}
              {modalAbono.saldoPendiente > 0 ? (
                <div style={{ marginTop: 15 }}>
                  <label htmlFor="montoAbono" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Nuevo abono:
                  </label>
                  <input
                    id="montoAbono"
                    type="number"
                    min="1"
                    max={modalAbono.saldoPendiente}
                    value={montoAbono}
                    onChange={(e) => setMontoAbono(e.target.value)}
                    style={{
                      width: "100%", padding: "8px", marginTop: 6,
                      border: "1px solid #d1d5db", borderRadius: 6, fontSize: "1rem",
                    }}
                    placeholder="Ingrese el monto"
                    autoFocus
                  />
                </div>
              ) : (
                <p style={{ marginTop: 12, color: "#10b981", fontWeight: 600, textAlign: "center" }}>
                  ✅ Pedido completamente pagado
                </p>
              )}
            </div>
          }
          confirmText={abonoLoading ? "Registrando..." : "Registrar Abono"}
          cancelText="Cerrar"
          showCancel
          onConfirm={modalAbono.saldoPendiente > 0 ? confirmAbono : undefined}
          onCancel={() => {
            setModalAbono({ open: false, pedidoId: null, ventaId: null, cliente: "", total: 0, totalAbonado: 0, saldoPendiente: 0, abonos: [] });
            setMontoAbono("");
          }}
        />
      </CrudLayout>
    </>
  );
}