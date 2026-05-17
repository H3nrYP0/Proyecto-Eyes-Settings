import { useNavigate } from "react-router-dom";
import CrudLayout       from "../../../../shared/components/crud/CrudLayout";
import CrudTable        from "../../../../shared/components/crud/CrudTable";
import Modal            from "../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import { usePedidos }   from "../hooks/usePedidos";
import { ESTADOS_ABONABLE, COLORES_ESTADO } from "../utils/pedidosUtils";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

/* ── Thumbnail del comprobante en la tabla ─────────────────────────────── */
function ComprobanteBadge({ url }) {
  if (!url) {
    return <span style={{ color: "#d1d5db", fontSize: "0.8rem" }}>—</span>;
  }

  const esImagen =
    /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url) ||
    url.includes("cloudinary.com") ||
    url.includes("res.cloudinary");

  if (esImagen) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title="Ver comprobante"
        onClick={(e) => e.stopPropagation()}
        style={{ display: "inline-block", lineHeight: 0 }}
      >
        <img
          src={url}
          alt="Comprobante"
          style={{
            width: 40, height: 40,
            objectFit: "cover",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            cursor: "zoom-in",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.12)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{ fontSize: "0.75rem", color: "#6366f1", textDecoration: "none" }}
      title={url}
    >
      🔗 Ver
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function Pedidos() {
  const navigate = useNavigate();
  const {
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
  } = usePedidos();

  const columns = [
    {
      field: "cliente",
      header: "Cliente",
      render: (row) => row.cliente || "—",
    },
    {
      field: "fechaPedido",
      header: "Fecha",
      render: (row) =>
        row.fechaPedido
          ? new Date(row.fechaPedido).toLocaleDateString("es-CO", {
              day: "2-digit", month: "short", year: "numeric",
            })
          : "—",
    },
    {
      field: "items",
      header: "Ítems",
      render: (row) => (
        <span style={{ fontSize: "0.85rem" }}>{obtenerResumenItems(row)}</span>
      ),
    },
    {
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
    {
      field: "transferencia_comprobante",
      header: "Comprobante",
      render: (row) => <ComprobanteBadge url={row.transferencia_comprobante} />,
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => {
        const col   = COLORES_ESTADO[row.estado] ?? { bg: "#f3f4f6", color: "#374151" };
        const label = row.estado
          ? row.estado.charAt(0).toUpperCase() + row.estado.slice(1)
          : "—";
        return (
          <span style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 12,
            fontSize: "0.75rem",
            fontWeight: 600,
            background: col.bg,
            color: col.color,
          }}>
            {label}
          </span>
        );
      },
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
            title={!puedeAbonar ? "Solo se puede abonar en pedidos pendientes" : "Registrar abono"}
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

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />

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
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            Cargando pedidos...
          </div>
        ) : (
          <CrudTable
            columns={columns}
            data={pedidos}
            actions={tableActions}
            showStatusColumn={false}
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
          message={`Esta acción eliminará el pedido de "${modalDelete.cliente}" permanentemente.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
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
              <p>
                <strong>Total abonado:</strong>{" "}
                <span style={{ color: "#10b981", fontWeight: 600 }}>
                  {formatCurrency(modalAbono.totalAbonado)}
                </span>
              </p>
              <p>
                <strong>Saldo pendiente:</strong>{" "}
                <span style={{ color: modalAbono.saldoPendiente > 0 ? "#ef4444" : "#10b981", fontWeight: 600 }}>
                  {formatCurrency(modalAbono.saldoPendiente)}
                </span>
              </p>
              {modalAbono.abonos.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#6b7280", marginBottom: 4 }}>
                    Historial de abonos:
                  </p>
                  <div style={{ maxHeight: 120, overflowY: "auto" }}>
                    {modalAbono.abonos.map((a) => (
                      <div key={a.id} style={{
                        display: "flex", justifyContent: "space-between",
                        fontSize: "0.82rem", padding: "4px 0",
                        borderBottom: "1px solid #f3f4f6",
                      }}>
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
          onCancel={closeAbonoModal}
        />
      </CrudLayout>
    </>
  );
}