import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import { useProveedores } from "../hooks/useProveedores";
import "../../../../shared/styles/components/crud-table.css";

export default function Proveedores() {
  const navigate = useNavigate();
  const {
    proveedores,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarProveedor,
    cambiarEstado,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  } = useProveedores();

  const confirmDelete = async () => {
    const result = await eliminarProveedor(modalDelete.id);
    if (result.success) closeDeleteModal();
    else alert(result.error);
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    const result = await cambiarEstado(row.id, nuevoEstado);
    if (!result.success) alert(result.error);
  };

  const columns = [
    {
      field: "tipoProveedor",
      header: "Tipo",
      headerSx: { display: { xs: "none", md: "table-cell" } },
      cellSx: { display: { xs: "none", md: "table-cell" } },
      render: (item) => (
        <span className={item.tipoProveedor === "Persona Jurídica" ? "juridica" : "natural"}>
          {item.tipoProveedor}
        </span>
      ),
    },
    { field: "razonSocial", header: "Razón Social" },
    {
      field: "documento",
      header: "Documento",
      headerSx: { display: { xs: "none", sm: "table-cell" } },
      cellSx: { display: { xs: "none", sm: "table-cell" } },
    },
    {
      field: "telefono",
      header: "Teléfono",
      headerSx: { display: { xs: "none", md: "table-cell" } },
      cellSx: { display: { xs: "none", md: "table-cell" } },
    },
  ];

  const tableActions = [
    {
      label: "Ver",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => openDeleteModal(row.id, row.razonSocial),
    },
  ];

  if (loading && proveedores.length === 0) {
    return <Loading message="Cargando proveedores..." />;
  }

  return (
    <>
      <CrudLayout
        title="Proveedores"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar proveedor..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && <div className="crud-error">⚠️ {error}</div>}

        <CrudTable
          columns={columns}
          data={proveedores}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron proveedores"
              : "No hay proveedores registrados"
          }
        />

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Proveedor?"
          message={`Esta acción eliminará al proveedor "${modalDelete.razonSocial}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      </CrudLayout>

      <style>{`
        .juridica {
          background: #e0f2fe;
          color: #0369a1;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .natural {
          background: #f0fdf4;
          color: #166534;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}