import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllServicios,
  deleteServicio,
  updateEstadoServicio,
} from "../../../../lib/data/serviciosData";

export default function Servicios() {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const serviciosData = getAllServicios();
    setServicios(serviciosData);
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
    const updated = deleteServicio(modalDelete.id);
    setServicios([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoServicio(id);
    setServicios([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredServicios = servicios.filter((servicio) => {
    const matchesSearch = 
      servicio.nombre.toLowerCase().includes(search.toLowerCase()) ||
      servicio.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      servicio.empleado.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || servicio.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA SERVICIOS
  const searchFilters = [
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { 
      field: "descripcion", 
      header: "Descripción",
      render: (item) => (
        item.descripcion ? (
          <span title={item.descripcion}>
            {item.descripcion.length > 50 
              ? item.descripcion.substring(0, 50) + '...' 
              : item.descripcion
            }
          </span>
        ) : '-'
      )
    },
    { field: "duracion", header: "Duración (min)" },
    { 
      field: "precio", 
      header: "Precio",
      render: (item) => `$${item.precio.toLocaleString()}`
    },
    { field: "empleado", header: "Empleado" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activo" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "✅ Activo" : "⛔ Inactivo"}
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

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterEstado(value);
  };

  return (
    <CrudLayout
      title="Servicios"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, descripción, empleado..."
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
        data={filteredServicios} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron servicios para los filtros aplicados' : 
            'No hay servicios registrados'
        }
      />

      {/* Botón para primer servicio */}
      {filteredServicios.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primer Servicio
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Servicio?"
        message={`Esta acción eliminará el servicio "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}