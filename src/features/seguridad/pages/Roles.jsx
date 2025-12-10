import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllRoles,
  deleteRol,
} from "../../../lib/data/rolesData";

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");

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
  //          BUSCADOR
  // =============================
  const filteredRoles = roles.filter((rol) => {
    const matchesSearch = 
      rol.nombre.toLowerCase().includes(search.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { 
      field: "nombre", 
      header: "Nombre",
      render: (item) => (
        <span className={`rol-badge ${item.nombre.toLowerCase()}`}>
          {item.nombre}
        </span>
      )
    },
    { 
      field: "descripcion", 
      header: "Descripción",
      render: (item) => (
        <span title={item.descripcion}>
          {item.descripcion.length > 80 
            ? item.descripcion.substring(0, 80) + '...' 
            : item.descripcion
          }
        </span>
      )
    },
    { 
      field: "permisos", 
      header: "Permisos",
      render: (item) => (
        <span className="permisos-count">
          {item.permisos} permisos
        </span>
      )
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Editar Permisos",
      type: "edit",
      onClick: (item) => alert(`Editar permisos del rol ${item.nombre}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  return (
    <CrudLayout
      title="👥 Roles"
      description="Administra los roles del sistema y sus permisos asociados."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredRoles} 
        actions={tableActions}
        emptyMessage={
          search ? 
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