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
    cambiarEstado,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  } = useCompras();

  const confirmDelete = async () => {
    const result = await eliminarCompra(modalDelete.id);
    if (result.success) closeDeleteModal();
    else alert(result.error);
  };

  const handleChangeStatus = async (row) => {
    const result = await cambiarEstado(row);
    if (!result.success) alert(result.error);
  };

  const columns = [
    { field: "proveedorNombre", header: "Proveedor" },
    { field: "fechaFormateada", header: "Fecha" },
    { field: "totalFormateado", header: "Total" },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: handleChangeStatus,
      disabled: (row) => row.estado === "Anulada",
    },
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}`),
      disabled: (row) => row.estado === "Anulada",
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
          background-color: #e5e5e5 !important;
          color: #888 !important;
          opacity: 0.7;
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
          rowClassName={(row) => row.estado === "Anulada" ? "row-anulada" : ""}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron compras para los filtros aplicados"
              : "No hay compras registradas"
          }
        />

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
      </CrudLayout>
    </>
  );
}