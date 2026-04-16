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
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarCompra,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
    modalAnular,
    abrirModalAnular,
    cerrarModalAnular,
    confirmarAnular,
  } = useCompras();

  const confirmDelete = async () => {
    const result = await eliminarCompra(modalDelete.id);
    if (result.success) closeDeleteModal();
    else alert(result.error);
  };

  const columns = [
    { field: "proveedorNombre", header: "Proveedor" },
    { field: "fechaFormateada", header: "Fecha" },
    { field: "totalFormateado", header: "Total" },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: "0.78rem",
            fontWeight: 600,
            backgroundColor: row.estado === "Anulada" ? "#f3f4f6" : "#dcfce7",
            color: row.estado === "Anulada" ? "#9ca3af" : "#16a34a",
          }}
        >
          {row.estado || "—"}
        </span>
      ),
    },
  ];

  const tableActions = [
    {
      label: "Anular",
      type: "toggle-status",
      onClick: (row) => abrirModalAnular(row),
      disabled: (row) => row.estado === "Anulada",
    },
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}`),
    },
    {
      label: "Generar PDF",
      type: "pdf",
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}/pdf`),
      disabled: (row) => row.estado === "Anulada",
    },
  ];

  if (loading && compras.length === 0) {
    return <Loading message="Cargando compras..." />;
  }

  return (
    <>
      <style>{`
        tr.row-anulada td {
          background-color: #ececec !important;
          color: #9ca3af !important;
          opacity: 0.75;
        }
        tr.row-anulada td button,
        tr.row-anulada td a {
          pointer-events: none;
          opacity: 0.35;
        }
      `}</style>

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

        <CrudTable
          columns={columns}
          data={compras}
          actions={tableActions}
          rowClassName={(row) => (row.estado === "Anulada" ? "row-anulada" : "")}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron compras para los filtros aplicados"
              : "No hay compras registradas"
          }
        />

        {/* Modal eliminar */}
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

        {/* Modal anular */}
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