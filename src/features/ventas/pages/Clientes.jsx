import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";
import "../../../shared/styles/components/formulasCliente.css";

// Importamos las funciones del backend
import {
  getAllClientes,
  deleteCliente,
} from "../../../lib/data/clientesData";

export default function Clientes() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterGenero, setFilterGenero] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const clientesData = getAllClientes();
    setClientes(clientesData);
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
    const updated = deleteCliente(modalDelete.id);
    setClientes([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //          BUSCADOR Y FILTRO
  // =============================
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch = 
      cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(search.toLowerCase()) ||
      cliente.documento.toLowerCase().includes(search.toLowerCase()) ||
      cliente.ciudad.toLowerCase().includes(search.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = !filterGenero || cliente.genero === filterGenero;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA CLIENTES
  const searchFilters = [
    { value: '', label: 'Todos los géneros' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "apellido", header: "Apellido" },
    { field: "documento", header: "Documento" },
    { field: "telefono", header: "Teléfono" },
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
      label: "Historial Fórmula",
      type: "info",
      onClick: (item) => navigate(`historial-formula/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, `${item.nombre} ${item.apellido}`),
    },
  ];

  // Función para manejar cambio de filtro
  const handleFilterChange = (value) => {
    setFilterGenero(value);
  };

  return (
    <CrudLayout
      title="👥 Clientes"
      description="Administra la información de los clientes de la óptica."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, apellido, documento, ciudad..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterGenero}
      onFilterChange={handleFilterChange}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredClientes} 
        actions={tableActions}
        emptyMessage={
          search || filterGenero ? 
            'No se encontraron clientes para los filtros aplicados' : 
            'No hay clientes registrados'
        }
      />

      {/* Botón para primer cliente */}
      {filteredClientes.length === 0 && !search && !filterGenero && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Registrar Primer Cliente
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cliente?"
        message={`Esta acción eliminará al cliente "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}