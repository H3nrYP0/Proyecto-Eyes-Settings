import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllEmpleados,
  deleteEmpleado,
  updateEstadoEmpleado,
} from "../../../../lib/data/empleadosData";

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const empleadosData = getAllEmpleados();
    setEmpleados(empleadosData);
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
    const updated = deleteEmpleado(modalDelete.id);
    setEmpleados([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoEmpleado(id);
    setEmpleados([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredEmpleados = empleados.filter((empleado) => {
    const matchesSearch = 
      empleado.nombre.toLowerCase().includes(search.toLowerCase()) ||
      empleado.numero_documento.toLowerCase().includes(search.toLowerCase()) ||
      empleado.cargo.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || empleado.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA EMPLEADOS
  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "cargo", header: "Cargo" },
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
  //          ACCIONES - CORREGIDAS
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`/admin/servicios/empleados/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/servicios/empleados/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterEstado(value);
  };

  return (
    <CrudLayout
      title="Empleados"
      onAddClick={() => navigate("/admin/servicios/empleados/crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, documento, cargo..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={handleFilterChange}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredEmpleados} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron empleados para los filtros aplicados' : 
            'No hay empleados registrados'
        }
      />

      {/* Botón para primer empleado */}
      {filteredEmpleados.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("/admin/servicios/empleados/crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Registrar Primer Empleado
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará al empleado "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}