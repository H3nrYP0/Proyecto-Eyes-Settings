import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllCategorias,
  deleteCategoria,
  updateEstadoCategoria,
} from "../../../../lib/data/categoriasData";

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const categoriasData = getAllCategorias();
    setCategorias(categoriasData);
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
    const updated = deleteCategoria(modalDelete.id);
    setCategorias([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoCategoria(id);
    setCategorias([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO - CORREGIDO
  // =============================
  const filteredCategorias = categorias.filter((categoria) => {
    const matchesSearch = 
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterEstado || categoria.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA CATEGORÍAS
  const searchFilters = [
    { value: 'activa', label: 'Activas' },
    { value: 'inactiva', label: 'Inactivas' }
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
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activa" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activa" ? "✅ Activa" : "⛔ Inactiva"}
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
      title="📁 Categorías de Productos"
      description="Administra las categorías de productos para organizar tu inventario."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={handleFilterChange} // ✅ Usar función manejadora
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredCategorias} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron categorías para los filtros aplicados' : 
            'No hay categorías registradas'
        }
      />

      {/* Botón para primera categoría */}
      {filteredCategorias.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primera Categoría
          </button>
        </div>
      )}
      

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Categoría?"
        message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}