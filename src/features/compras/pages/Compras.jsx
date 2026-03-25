import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";

import {
  getAllCompras,
  deleteCompra,
  updateEstadoCompra,
} from "../../../lib/data/comprasData";

export default function Compras() {
  const navigate = useNavigate();

  const [compras, setCompras]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false, id: null, numeroCompra: "",
  });

  // ── Carga inicial ──────────────────────────────────────────
  const cargarCompras = async () => {
    try {
      setLoading(true);
      const data = await getAllCompras();
      setCompras(data);
    } catch (err) {
      console.error("Error al cargar compras:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  // ── Eliminar ───────────────────────────────────────────────
  const handleDelete = (id, numeroCompra) =>
    setModalDelete({ open: true, id, numeroCompra });

  const confirmDelete = async () => {
    try {
      await deleteCompra(modalDelete.id);
      await cargarCompras();
    } catch (err) {
      console.error("Error al eliminar compra:", err);
    } finally {
      setModalDelete({ open: false, id: null, numeroCompra: "" });
    }
  };

  // ── Cambiar estado ─────────────────────────────────────────
  const toggleEstado = async (row) => {
    if (row.estado === "Anulada") return;
    try {
      await updateEstadoCompra(row.id, row.estado);
      await cargarCompras();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  // ── Filtrado local ─────────────────────────────────────────
  const filteredCompras = compras.filter((compra) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (compra.proveedorNombre || '').toLowerCase().includes(term) ||
      (compra.observaciones   || '').toLowerCase().includes(term) ||
      (compra.numeroCompra    || '').toLowerCase().includes(term) ||
      String(compra.total     || '').includes(term);

    const matchesFilter = !filterEstado || compra.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  // ── Helpers ────────────────────────────────────────────────
  const formatCurrency = (v) => `$${Number(v).toLocaleString()}`;
  const formatDate     = (d) => new Date(d).toLocaleDateString('es-ES');

  // ── Columnas ───────────────────────────────────────────────
  const columns = [
    { field: "proveedorNombre", header: "Proveedor", render: (row) => row.proveedorNombre },
    { field: "fecha",  header: "Fecha",  render: (row) => formatDate(row.fecha)  },
    { field: "total",  header: "Total",  render: (row) => formatCurrency(row.total) },
  ];

  // ── Acciones ───────────────────────────────────────────────
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
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}/pdf`),
      disabled: (row) => row.estado === "Anulada",
    },
  ];

  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'Completada', label: 'Completadas' },
    { value: 'Anulada',    label: 'Anuladas'    },
  ];

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
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
            Cargando compras...
          </div>
        ) : (
          <CrudTable
            columns={columns}
            data={filteredCompras}
            actions={tableActions}
            rowClassName={(row) => row.estado === "Anulada" ? "row-anulada" : ""}
            emptyMessage={
              search || filterEstado
                ? "No se encontraron compras para los filtros aplicados"
                : "No hay compras registradas"
            }
          />
        )}

        {/* Botón primera compra */}
        {!loading && filteredCompras.length === 0 && !search && !filterEstado && (
          <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)" }}>
            <button
              onClick={() => navigate("/admin/compras/crear")}
              className="btn-primary"
            >
              Registrar Primera Compra
            </button>
          </div>
        )}

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
          onCancel={() => setModalDelete({ open: false, id: null, numeroCompra: "" })}
        />
      </CrudLayout>
    </>
  );
}