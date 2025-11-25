import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllProveedores,
  deleteProveedor,
  updateEstadoProveedor,
} from "../../../lib/data/proveedoresData";

export default function Proveedores() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    razonSocial: "",
  });

  // Cargar datos
  useEffect(() => {
    const proveedoresData = getAllProveedores();
    setProveedores(proveedoresData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, razonSocial) => {
    setModalDelete({
      open: true,
      id,
      razonSocial,
    });
  };

  const confirmDelete = () => {
    const updated = deleteProveedor(modalDelete.id);
    setProveedores([...updated]);
    setModalDelete({ open: false, id: null, razonSocial: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoProveedor(id);
    setProveedores([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredProveedores = proveedores.filter(proveedor => {
    const matchesSearch = 
      proveedor.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.nit.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.contacto.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.ciudad.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.correo.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.tipo.toLowerCase().includes(search.toLowerCase()) ||
      proveedor.telefono.includes(search);
    
    const matchesFilter = !filterEstado || proveedor.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA PROVEEDORES
  const searchFilters = [
    { value: 'Activo', label: 'Activos' },
    { value: 'Inactivo', label: 'Inactivos' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { 
      field: "tipo", 
      header: "Tipo",
      render: (item) => (
        <span className={`badge-${item.tipo === "Persona Jurídica" ? 'juridica' : 'natural'}`}>
          {item.tipo}
        </span>
      )
    },
    { field: "razonSocial", header: "Razón Social" },
    { field: "nit", header: "NIT" },
    { field: "contacto", header: "Contacto" },
    { field: "telefono", header: "Teléfono" },
    { 
      field: "correo", 
      header: "Correo",
      render: (item) => (
        <a href={`mailto:${item.correo}`} className="email-link">
          {item.correo}
        </a>
      )
    },
    { field: "ciudad", header: "Ciudad" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "Activo" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "Activo" ? "✅ Activo" : "❌ Inactivo"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.razonSocial),
    },
  ];

  return (
    <CrudLayout
      title="🚚 Proveedores"
      description="Administra los proveedores de productos para la óptica."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por razón social, NIT, contacto..."
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
        data={filteredProveedores} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron proveedores para los filtros aplicados' : 
            'No hay proveedores registrados'
        }
      />

      {/* Botón para primer proveedor */}
      {filteredProveedores.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Agregar Primer Proveedor
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Proveedor?"
        message={`Esta acción eliminará al proveedor "${modalDelete.razonSocial}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, razonSocial: "" })}
      />
    </CrudLayout>
  );
}