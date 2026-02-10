import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllUsuarios,
  deleteUsuario,
  updateEstadoUsuario,
} from "../../../lib/data/usuariosData";

export default function GestionUsuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterRol, setFilterRol] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const usuariosData = getAllUsuarios();
    setUsuarios(usuariosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = () => {
    const updated = deleteUsuario(modalDelete.id);
    setUsuarios([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //       CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoUsuario(id);
    setUsuarios([...updated]);
  };

  // =============================
  //      BUSCADOR Y FILTRO
  // =============================
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilterEstado = !filterEstado || usuario.estado === filterEstado;
    const matchesFilterRol = !filterRol || usuario.rol === filterRol;
    
    return matchesSearch && matchesFilterEstado && matchesFilterRol;
  });

  // FILTROS PARA USUARIOS
  const searchFilters = [
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  const rolFilters = [
    { value: '', label: 'Todos los roles' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'optometra', label: 'Optómetra' },
    { value: 'tecnico', label: 'Técnico' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { 
      field: "rol", 
      header: "Rol",
      render: (item) => (
        <span className={`rol-badge ${item.rol.toLowerCase()}`}>
          {item.rol}
        </span>
      )
    },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activo" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "Activo" : "Inactivo"}
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
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  // Función para manejar cambio de filtro de estado
  const handleFilterEstadoChange = (value) => {
    setFilterEstado(value);
  };

  // Función para manejar cambio de filtro de rol
  const handleFilterRolChange = (value) => {
    setFilterRol(value);
  };

  return (
    <CrudLayout
      title="Gestión de Usuarios"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, email, rol..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={handleFilterEstadoChange}
      searchPosition="left"
      additionalFilters={[
        {
          label: "Filtrar por rol",
          value: filterRol,
          onChange: handleFilterRolChange,
          options: rolFilters
        }
      ]}
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredUsuarios} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado || filterRol ? 
            'No se encontraron usuarios para los filtros aplicados' : 
            'No hay usuarios registrados'
        }
      />

      {/* Botón para primer usuario */}
      {filteredUsuarios.length === 0 && !search && !filterEstado && !filterRol && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Registrar Primer Usuario
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Usuario?"
        message={`Esta acción eliminará al usuario "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}