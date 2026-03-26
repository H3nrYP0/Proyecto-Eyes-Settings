import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";

import { ComprasData } from "../../../lib/data/comprasData";

export default function Compras() {
  const navigate = useNavigate();

  const [compras,      setCompras]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false, id: null, numeroCompra: "",
  });

  // ── Carga inicial ─────────────────────────────────────────
  useEffect(() => { fetchCompras(); }, []);

  async function fetchCompras() {
    try {
      setLoading(true);
      const data = await ComprasData.getAllCompras();
      setCompras(data);
    } catch (e) {
      console.error("Error al cargar compras:", e);
    } finally {
      setLoading(false);
    }
  }

  // ── Eliminar ──────────────────────────────────────────────
  const handleDelete = (id, numeroCompra) =>
    setModalDelete({ open: true, id, numeroCompra });

  const confirmDelete = async () => {
    try {
      await ComprasData.deleteCompra(modalDelete.id);
      setCompras((prev) => prev.filter((c) => c.id !== modalDelete.id));
    } catch (e) {
      console.error("Error al eliminar compra:", e);
    } finally {
      setModalDelete({ open: false, id: null, numeroCompra: "" });
    }
  };

  // ── Cambiar estado ────────────────────────────────────────
  const toggleEstado = async (row) => {
    if (row.estado === "Anulada") return;
    try {
      await ComprasData.updateEstadoCompra(row.id, row.estado);
      // Refrescar lista para reflejar el cambio
      await fetchCompras();
    } catch (e) {
      console.error("Error al cambiar estado:", e);
    }
  };

  // ── Filtrado ──────────────────────────────────────────────
  const filteredCompras = compras.filter((compra) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (compra.proveedorNombre || '').toLowerCase().includes(term) ||
      (compra.observaciones   || '').toLowerCase().includes(term) ||
      (compra.numeroCompra    || '').toLowerCase().includes(term) ||
      String(compra.total || 0).includes(term);

    const matchesFilter = !filterEstado || compra.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const searchFilters = [
    { value: '',           label: 'Todos'       },
    { value: 'Completada', label: 'Completadas' },
    { value: 'Anulada',    label: 'Anuladas'    },
  ];

  const formatCurrency = (n) => `$${Number(n).toLocaleString("es-CO")}`;
  const formatDate     = (d) => new Date(d).toLocaleDateString('es-ES');

  const columns = [
    { field: "proveedorNombre", header: "Proveedor", render: (r) => r.proveedorNombre },
    { field: "fecha",           header: "Fecha",     render: (r) => formatDate(r.fecha) },
    { field: "total",           header: "Total",     render: (r) => formatCurrency(r.total) },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type:  "toggle-status",
      onClick: toggleEstado,
      disabled: (row) => row.estado === "Anulada",
    },
    {
      label: "Ver Detalles",
      type:  "view",
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}`),
      disabled: (row) => row.estado === "Anulada",
    },
    {
      label: "Generar PDF",
      type:  "pdf",
      onClick: (row) => navigate(`/admin/compras/detalle/${row.id}/pdf`),
      disabled: (row) => row.estado === "Anulada",
    },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Cargando compras…</div>;

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