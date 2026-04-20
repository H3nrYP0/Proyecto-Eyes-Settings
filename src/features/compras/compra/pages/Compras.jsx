import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import { useCompras } from "../hooks/useCompras";
import "../../../../shared/styles/components/crud-table.css";

export default function Compras() {
  const navigate = useNavigate();
  const {
    compras,
    loading,
    error,
    search,        setSearch,
    filterEstado,  setFilterEstado,
    estadoFilters,
    eliminarCompra,
    modalDelete,   openDeleteModal, closeDeleteModal,
    modalAnular,   abrirModalAnular, cerrarModalAnular, confirmarAnular,
  } = useCompras();

  const confirmDelete = async () => {
    const result = await eliminarCompra(modalDelete.id);
    if (result.success) closeDeleteModal();
    else alert(result.error);
  };

  // ─── Columnas ─────────────────────────────────────────────────────────────
  // La columna "Estado" se renderiza manualmente aquí para no tocar CrudTable.
  // showStatusColumn={false} le dice a CrudTable que no renderice su propio badge.
  const columns = [
    { field: "proveedorNombre", header: "Proveedor" },
    { field: "fechaFormateada", header: "Fecha"     },
    { field: "totalFormateado", header: "Total"     },
    {
      field: "estado",
      header: "Estado",
      render: (row) => {
        const anulada = row.estado === null || row.estado === undefined;
        return (
          <button
            onClick={() => !anulada && abrirModalAnular(row)}
            disabled={anulada}
            style={{
              minWidth: 95,
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: anulada ? "default" : "pointer",
              border: `1px solid ${anulada ? "#d1d5db" : "#16a34a"}`,
              backgroundColor: anulada ? "#f3f4f6" : "#f0fdf4",
              color: anulada ? "#9ca3af" : "#16a34a",
              whiteSpace: "nowrap",
            }}
          >
            {anulada ? "Anulada" : "Completada"}
          </button>
        );
      },
    },
  ];

  // ─── Acciones — bloqueadas cuando la fila está anulada ────────────────────
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick:  (row) => row.estado !== null && navigate(`/admin/compras/detalle/${row.id}`),
      disabled: (row) => row.estado === null,
    },
    {
      label: "Generar PDF",
      type: "pdf",
      onClick:  (row) => row.estado !== null && navigate(`/admin/compras/detalle/${row.id}/pdf`),
      disabled: (row) => row.estado === null,
    },
  ];

  // Datos enriquecidos: las filas anuladas llevan estilo gris
  // Se inyecta _rowStyle que CrudTable ignora (no lo usa), y se aplica
  // wrapeando la tabla en un <div> con CSS que selecciona por data-anulada.
  const comprasConEstilo = compras.map((c) => ({
    ...c,
    // Sobreescribimos estado para que CrudTable no lo use (showStatusColumn=false)
  }));

  if (loading && compras.length === 0) {
    return <Loading message="Cargando compras..." />;
  }

  return (
    <>
      <CrudLayout
        title="Compras"
        onAddClick={() => navigate("/admin/compras/crear")}
        showSearch
        searchPlaceholder="Buscar por proveedor, observaciones..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {error && <div className="crud-error">⚠️ {error}</div>}

        {/* Wrapper que pone gris las filas anuladas usando CSS puro.
            CrudTable no se toca — el estilo aplica solo aquí. */}
        <style>{`
          .compras-tabla tr:has(button[disabled][style*="9ca3af"]) {
            background-color: #f9fafb !important;
            opacity: 0.65;
            pointer-events: none;
          }
          .compras-tabla tr:has(button[disabled][style*="9ca3af"]) td {
            color: #9ca3af !important;
          }
        `}</style>
        <div className="compras-tabla">
          <CrudTable
            columns={columns}
            data={comprasConEstilo}
            actions={tableActions}
            showStatusColumn={false}
            emptyMessage={
              search || filterEstado
                ? "No se encontraron compras para los filtros aplicados"
                : "No hay compras registradas"
            }
          />
        </div>

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Compra?"
          message={`Esta acción eliminará la compra "${modalDelete.numeroCompra}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />

        <Modal
          open={modalAnular.open}
          type="warning"
          title="¿Anular Compra?"
          message="Esta acción anulará la compra de forma permanente. No se podrá revertir."
          confirmText="Sí, anular"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmarAnular}
          onCancel={cerrarModalAnular}
        />
      </CrudLayout>
    </>
  );
}