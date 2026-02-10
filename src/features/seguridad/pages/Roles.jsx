import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones CORRECTAS para roles
import {
  getAllRoles,
  deleteRol,
  updateEstadoRol
} from "../../../lib/data/rolesData";

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const rolesData = getAllRoles();
    setRoles(rolesData);
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
    const updated = deleteRol(modalDelete.id);
    setRoles([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //       CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoRol(id);
    setRoles(updated); 
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredRoles = roles.filter((rol) => {
    const matchesSearch = 
      rol.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (rol.descripcion && rol.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilterEstado = !filterEstado || rol.estado === filterEstado;
    
    return matchesSearch && matchesFilterEstado;
  });

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { 
      field: "nombre", 
      header: "Nombre",
      render: (item) => (
        <div className="rol-info-cell">
          <span className="rol-nombre">{item.nombre}</span>
        </div>
      )
    },
    { 
      field: "permisos", 
      header: "Permisos",
      render: (item) => {
        const totalPermisos = item.permisosCount || item.permisos?.length || 0;
        return <span>{totalPermisos} permisos</span>;
      }
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
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`editar/${item.id}`),
    },
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  // Filtros para roles
  const estadoFilters = [
    { value: '', label: 'Todos los estados' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  return (
    <CrudLayout
      title="Roles"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchPosition="left"
      showFilters={true}
      filters={[
        {
          label: "Estado",
          value: filterEstado,
          onChange: setFilterEstado,
          options: estadoFilters
        }
      ]}
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredRoles} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron roles para los filtros aplicados' : 
            'No hay roles configurados'
        }
      />

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Rol?"
        message={`Esta acción eliminará el rol "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}