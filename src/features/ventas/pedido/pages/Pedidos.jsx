import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import { usePedidos } from "../hooks/usePedidos";
import { ESTADOS_ABONABLE } from "../utils/pedidosUtils";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Pedidos() {
  const navigate = useNavigate();
  const {
    pedidos, loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    modalDelete, handleDelete, confirmDelete, closeDeleteModal,
    modalAbono, montoAbono, setMontoAbono,
    abonoLoading, handleAbonar, confirmAbono, closeAbonoModal,
    formatCurrency,
    obtenerCantidadItems, obtenerDescripcionItems,
  } = usePedidos();

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
        if (cantidad === 0) return <span style={{ color: "#9ca3af" }}>Sin productos</span>;
        return (
          <span>
            {cantidad} {cantidad === 1 ? "producto" : "productos"}
          </span>
        );
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
            title={!puedeAbonar ? "No disponible en este estado" : "Registrar abono"}
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
      <style>{`
        tr.row-entregado td { background-color: #f0fdf4 !important; }
        tr.row-cancelado td { background-color: #fef2f2 !important; color: #9ca3af !important; opacity: 0.8; }
        .crud-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .abono-row { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; border-bottom: 1px solid #f3f4f6; }
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
            data={pedidos}
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

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Pedido?"
          message={`Esta acción eliminará el pedido de "${modalDelete.cliente}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />

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