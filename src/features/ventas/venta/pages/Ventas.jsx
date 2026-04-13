import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import { useVentas } from "../hooks/useVentas";
import "../../../../shared/styles/components/crud-table.css";

export default function Ventas() {
  const navigate = useNavigate();
  const {
    ventas, loading,
    search, setSearch,
    filterEstado, setFilterEstado,
    estadoFilters,
    formatCurrency,
    COLORES_ESTADO_VENTA,
    getEstadoLabelVenta,
  } = useVentas();

  const columns = [
    {
      field: "cliente_nombre",
      header: "Cliente",
      render: (row) => row.cliente_nombre || "—",
    },
    {
      field: "fecha_venta",
      header: "Fecha",
      render: (row) => row.fecha_venta || "—",
    },
    {
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
    {
      field: "metodo_pago",
      header: "Pago",
      render: (row) => (
        <span style={{ textTransform: "capitalize" }}>{row.metodo_pago || "—"}</span>
      ),
    },
    {
      header: "Estado",
      render: (row) => {
        const estilo = COLORES_ESTADO_VENTA[row.estado] ?? { bg: "#f3f4f6", color: "#374151" };
        return (
          <span style={{
            background: estilo.bg, color: estilo.color,
            padding: "3px 10px", borderRadius: 99,
            fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap",
          }}>
            {getEstadoLabelVenta(row.estado)}
          </span>
        );
      },
    },
  ];

  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
  ];

  return (
    <CrudLayout
      title="Ventas"
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
          Cargando ventas...
        </div>
      ) : (
        <CrudTable
          columns={columns}
          data={ventas}
          actions={tableActions}
          showStatusColumn={false}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron ventas para los filtros aplicados"
              : "No hay ventas registradas"
          }
        />
      )}
    </CrudLayout>
  );
}