import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";

// Importamos las funciones del backend
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

  // Cargar datos
  useEffect(() => {
    const comprasData = getAllCompras();
    setCompras(comprasData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, numeroCompra) => {
    setModalDelete({
      open: true,
      id,
      numeroCompra,
    });
  };

  const confirmDelete = () => {
    const updated = deleteCompra(modalDelete.id);
    setCompras([...updated]);
    setModalDelete({ open: false, id: null, numeroCompra: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoCompra(id);
    setCompras([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredCompras = compras.filter(compra => {
  // Aseguramos que todos los campos sean strings (o vacíos si son undefined/null)
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
  
  const matchesFilter = !filterEstado || compra.estado === filterEstado;
  
  return matchesSearch && matchesFilter;
});

  // FILTROS PARA COMPRAS
  const searchFilters = [
    { value: 'Completada', label: 'Completadas' },
    { value: 'Anulada', label: 'Anuladas' }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "proveedorNombre", header: "Proveedor" },
    { 
      field: "fecha", 
      header: "Fecha",
      render: (item) => formatDate(item.fecha)
    },
    { 
      field: "total", 
      header: "Total",
      render: (item) => formatCurrency(item.total) // ✅ QUITADA la clase amount
    },
  
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "Completada" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "Completada" ? "Completada" : "Anulada"}
        </button>
      ),
    }
  ];

  // =============================
//          ACCIONES
// =============================
const tableActions = [
  {
    label: "Ver Detalles",
    type: "view",
    onClick: (item) => navigate(`/admin/compras/detalle/${item.id}`),
  },

  {
    label: "Generar PDF",
    type: "pdf", // ← esto aplicará .unified-btn-pdf
    onClick: (item) => navigate(`/admin/compras/detalle/${item.id}/pdf`),
  }
];

  return (
    <CrudLayout
      title="Compras"
      onAddClick={() => navigate("/admin/compras/crear")}
      showSearch={true}
      searchPlaceholder="Buscar por proveedor, observaciones..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredCompras} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron compras para los filtros aplicados' : 
            'No hay compras registradas'
        }
      />

      {/* Botón para primera compra */}
      {filteredCompras.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("/admin/compras/crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Registrar Primera Compra
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Compra?"
        message={`Esta acción eliminará la compra "${modalDelete.numeroCompra}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, numeroCompra: "" })}
      />
    </CrudLayout>
  );
}