import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllAccesos,
  deleteAcceso,
  updateEstadoAcceso,
} from "../../../lib/data/accesosData";

export default function GestionAcceso() {
  const navigate = useNavigate();

  const [accesos, setAccesos] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterRol, setFilterRol] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    usuario: "",
  });

  // Cargar datos
  useEffect(() => {
    const accesosData = getAllAccesos();
    setAccesos(accesosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, usuario) => {
    setModalDelete({
      open: true,
      id,
      usuario,
    });
  };

  const confirmDelete = () => {
    const updated = deleteAcceso(modalDelete.id);
    setAccesos([...updated]);
    setModalDelete({ open: false, id: null, usuario: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoAcceso(id);
    setAccesos([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredAccesos = accesos.filter((acceso) => {
    const matchesSearch = 
      acceso.usuario.toLowerCase().includes(search.toLowerCase()) ||
      acceso.rol.toLowerCase().includes(search.toLowerCase()) ||
      acceso.modulosAcceso.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilterEstado = !filterEstado || acceso.estado === filterEstado;
    const matchesFilterRol = !filterRol || acceso.rol === filterRol;
    
    return matchesSearch && matchesFilterEstado && matchesFilterRol;
  });

  // FILTROS PARA ACCESOS
  const searchFilters = [
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' },
    { value: 'bloqueado', label: 'Bloqueados' }
  ];

  const rolFilters = [
    { value: '', label: 'Todos los roles' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'optometrista', label: 'Optometrista' },
    { value: 'tecnico', label: 'Técnico' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "usuario", header: "Usuario" },
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
      field: "modulosAcceso", 
      header: "Módulos Acceso",
      render: (item) => (
        <span title={item.modulosAcceso}>
          {item.modulosAcceso.length > 40 
            ? item.modulosAcceso.substring(0, 40) + '...' 
            : item.modulosAcceso
          }
        </span>
      )
    },
    { field: "ultimoAcceso", header: "Último Acceso" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${
            item.estado === "activo" ? "activo" : 
            item.estado === "inactivo" ? "inactivo" : "bloqueado"
          }`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "✅ Activo" : 
           item.estado === "inactivo" ? "⏸️ Inactivo" : "🚫 Bloqueado"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Editar Permisos",
      type: "edit",
      onClick: (item) => alert(`Editar permisos de ${item.usuario}`),
    },
    {
      label: item => item.estado === "activo" ? "Bloquear" : 
                    item.estado === "bloqueado" ? "Desbloquear" : "Activar",
      type: "warning",
      onClick: (item) => toggleEstado(item.id),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.usuario),
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
      title="🔒 Gestión de Acceso"
      description="Administra los permisos y accesos de los usuarios del sistema."
      onAddClick={() => alert("Configurar nuevo acceso")}
      showSearch={true}
      searchPlaceholder="Buscar por usuario, rol, módulos..."
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
        data={filteredAccesos} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado || filterRol ? 
            'No se encontraron accesos para los filtros aplicados' : 
            'No hay accesos configurados'
        }
      />

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Configuración de Acceso?"
        message={`Esta acción eliminará la configuración de acceso de "${modalDelete.usuario}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, usuario: "" })}
      />
    </CrudLayout>
  );
}