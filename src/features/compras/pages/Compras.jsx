import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";

// Backend
import {
  getAllCompras,
  deleteCompra,
  updateEstadoCompra,
} from "../../../lib/data/comprasData";

export default function Compras() {
  const navigate = useNavigate();

  const [compras, setCompras] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    numeroCompra: "",
  });

  // =============================
  //        CARGA DE DATOS
  // =============================
  useEffect(() => {
    setCompras(getAllCompras());
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, numeroCompra) => {
    setModalDelete({ open: true, id, numeroCompra });
  };

  const confirmDelete = () => {
    const updated = deleteCompra(modalDelete.id);
    setCompras([...updated]);
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (row) => {
    if (row.estado === "Anulada") return; // 🔒 bloqueo total
    const updated = updateEstadoCompra(row.id);
    setCompras([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredCompras = compras.filter((compra) => {
    const proveedor = (compra.proveedorNombre || '').toLowerCase();
    const observaciones = (compra.observaciones || '').toLowerCase();
    const numeroCompra = (compra.numeroCompra || '').toLowerCase();
    const total = (compra.total || 0).toString();
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      proveedor.includes(searchTerm) ||
      observaciones.includes(searchTerm) ||
      numeroCompra.includes(searchTerm) ||
      total.includes(searchTerm);

    const matchesFilter =
      !filterEstado || compra.estado === filterEstado;

    return matchesSearch && matchesFilter;
  });

  // =============================
  //          FILTROS
  // =============================
  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'Completada', label: 'Completadas' },
    { value: 'Anulada', label: 'Anuladas' },
  ];

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES');

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    {
      field: "proveedorNombre",
      header: "Proveedor",
      render: (row) => row.proveedorNombre,
    },
    {
      field: "fecha",
      header: "Fecha",
      render: (row) => formatDate(row.fecha),
    },
    {
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: toggleEstado,
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
      onClick: (row) =>
        navigate(`/admin/compras/detalle/${row.id}/pdf`),
      disabled: (row) => row.estado === "Anulada",
    },
  ];

  return (
    <>
      {/* ✅ ESTILO QUE SÍ SE APLICA EN CRUDTABLE */}
      <style>
        {`
          tr.row-anulada td {
            background-color: #e5e5e5 !important;
            color: #888 !important;
            opacity: 0.7;
          }
        `}
      </style>

      <CrudLayout
        title="Compras"
        onAddClick={() => navigate("/admin/compras/crear")}
        showSearch
        searchPlaceholder="Buscar por proveedor, observaciones..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        <CrudTable
          columns={columns}
          data={filteredCompras}
          actions={tableActions}
          rowClassName={(row) =>
            row.estado === "Anulada" ? "row-anulada" : ""
          }
          emptyMessage={
            search || filterEstado
              ? "No se encontraron compras para los filtros aplicados"
              : "No hay compras registradas"
          }
        />

        {/* BOTÓN PRIMERA COMPRA */}
        {filteredCompras.length === 0 && !search && !filterEstado && (
          <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)" }}>
            <button
              onClick={() => navigate("/admin/compras/crear")}
              className="btn-primary"
            >
              Registrar Primera Compra
            </button>
          </div>
        )}

        {/* MODAL ELIMINAR */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Compra?"
          message={`Esta acción eliminará la compra "${modalDelete.numeroCompra}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() =>
            setModalDelete({ open: false, id: null, numeroCompra: "" })
          }
        />
      </CrudLayout>
    </>
  );
}