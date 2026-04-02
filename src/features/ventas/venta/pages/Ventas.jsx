import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import { useVentas } from "../hooks/useVentas";
import { getEstadoBadge } from "../utils/ventasUtils";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

export default function Ventas() {
  const navigate = useNavigate();
  const {
    ventas,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    modalDelete,
    confirmDelete,
    closeDeleteModal,
    formatCurrency,
    eliminarVenta,
    ESTADOS_VENTA,
  } = useVentas();

  // Definir columnas aquí (con JSX permitido)
  const columns = [
    { field: "id", header: "ID", render: (row) => `V-${row.id}` },
    { field: "cliente_nombre", header: "Cliente" },
    { field: "fecha_venta", header: "Fecha" },
    { field: "total", header: "Total", render: (row) => formatCurrency(row.total) },
    { field: "metodo_pago", header: "Pago", render: (row) => row.metodo_pago || "—" },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span className={`badge badge-${getEstadoBadge(row.estado)}`}>
          {ESTADOS_VENTA.find(e => e.value === row.estado)?.label || row.estado}
        </span>
      ),
    },
  ];

  // Definir acciones (sin JSX, solo objetos)
  const tableActions = [
    { label: "Ver Detalles", type: "view" },
    { label: "Editar", type: "edit" },
    { label: "Eliminar", type: "delete", onClick: (row) => eliminarVenta(row.id, row.cliente_nombre) },
  ];

  // Inyectar navigate en tableActions
  const actionsWithNavigate = tableActions.map(action => ({
    ...action,
    onClick: (row) => {
      if (action.type === "view") navigate(`detalle/${row.id}`);
      else if (action.type === "edit") navigate(`editar/${row.id}`);
      else if (action.type === "delete") action.onClick(row);
    }
  }));

  if (loading && ventas.length === 0) {
    return (
      <CrudLayout title="Ventas" showSearch={false}>
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
          Cargando ventas...
        </div>
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Ventas"
        showSearch
        searchPlaceholder="Buscar por cliente o ID..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && <div className="crud-error">⚠️ {error}</div>}

        <CrudTable
          columns={columns}
          data={ventas}
          actions={actionsWithNavigate}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron ventas para los filtros aplicados"
              : "No hay ventas registradas"
          }
        />

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Venta?"
          message={`Esta acción eliminará la venta de "${modalDelete.cliente}" y no se puede deshacer. No se puede eliminar si tiene abonos asociados.`}
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