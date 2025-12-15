import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllMarcas,
  deleteMarca,
  updateEstadoMarca,
} from "../../../../lib/data/marcasData";

export default function Marcas() {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const marcasData = getAllMarcas();
    setMarcas(marcasData);
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
    const updated = deleteMarca(modalDelete.id);
    setMarcas([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoMarca(id);
    setMarcas([...updated]);
  };

  // =============================
  //          BUSCADOR Y FILTRO - CORREGIDO
  // =============================
  const filteredMarcas = marcas.filter((marca) => {
    const matchesSearch = 
      marca.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (marca.descripcion && marca.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || marca.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA MARCAS
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

  return (
    <CrudLayout
      title="  Marcas"
      
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, descripción..."
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
        data={filteredMarcas} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron marcas para los filtros aplicados' : 
            'No hay marcas registradas'
        }
      />

      {/* Botón para primera marca */}
      {filteredMarcas.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primera Marca
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Marca?"
        message={`Esta acción eliminará la marca "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}