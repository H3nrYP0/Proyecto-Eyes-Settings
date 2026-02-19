import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import MarcaForm from "./components/MarcasForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Importamos el servicio con axios
import { MarcaData } from "../../../../lib/data/marcasData";

export default function Marcas() {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referencia para el botón de submit
  const submitButtonRef = useRef(null);

  // Estados para modales
  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create", // "create", "edit", "view"
    title: "",
    initialData: null,
  });

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos desde la API
  useEffect(() => {
    loadMarcas();
  }, []);

  const loadMarcas = async () => {
    try {
      setLoading(true);
      const data = await MarcaData.getAllMarcas();
      // Transformar datos: el backend envía booleanos, necesitamos strings para CrudTable
      const marcasTransformadas = data.map(marca => ({
        id: marca.id,
        nombre: marca.nombre,
        descripcion: marca.descripcion || '',
        // Convertir booleano a string para que CrudTable funcione
        estado: marca.estado ? 'activa' : 'inactiva'
      }));
      setMarcas(marcasTransformadas);
      setError(null);
    } catch (err) {
      console.error("Error al cargar marcas:", err);
      setError("No se pudieron cargar las marcas");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  //    FUNCIONES PARA LIMPIAR ARIA-HIDDEN
  // =============================
  const limpiarAriaHidden = () => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
    }, 200);
  };

  // =============================
  //    MODAL DE FORMULARIO
  // =============================
  const handleOpenCreate = () => {
    setModalForm({
      open: true,
      mode: "create",
      title: "Crear Nueva Marca",
      initialData: null,
    });
    limpiarAriaHidden();
  };

  const handleOpenEdit = (item) => {
    setModalForm({
      open: true,
      mode: "edit",
      title: `Editar Marca: ${item.nombre}`,
      initialData: item,
    });
    limpiarAriaHidden();
  };

  const handleOpenView = (item) => {
    setModalForm({
      open: true,
      mode: "view",
      title: `Detalle de Marca: ${item.nombre}`,
      initialData: item,
    });
    limpiarAriaHidden();
  };

  const handleCloseForm = () => {
    setModalForm({
      open: false,
      mode: "create",
      title: "",
      initialData: null,
    });
    limpiarAriaHidden();
  };

  const handleFormSubmit = async (data) => {
    try {
      if (modalForm.mode === "create") {
        await MarcaData.createMarca(data);
      } else if (modalForm.mode === "edit") {
        await MarcaData.updateMarca(modalForm.initialData.id, data);
      }
      handleCloseForm();
      await loadMarcas();
    } catch (error) {
      console.error("Error al guardar marca:", error);
      alert("Error al guardar la marca");
    }
  };

  // =============================
  //    MANEJADOR PARA EL MODAL (CORREGIDO)
  // =============================
  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      // Disparar el submit del formulario
      const formElement = document.getElementById("marca-form");
      if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
    limpiarAriaHidden();
  };

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

  const confirmDelete = async () => {
    try {
      await MarcaData.deleteMarca(modalDelete.id);
      await loadMarcas();
      setModalDelete({ open: false, id: null, nombre: "" });
      limpiarAriaHidden();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar la marca");
    }
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = async (id, estadoActual) => {
    try {
      const estadoBooleano = estadoActual === 'activa';
      await MarcaData.toggleMarcaEstado(id, estadoBooleano);
      await loadMarcas();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar el estado");
    }
  };

  // =============================
  //          BUSCADOR Y FILTRO
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
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activa" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id, item.estado)}
        >
          {item.estado === "activa" ? "Activa" : "Inactiva"}
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
      onClick: (item) => handleOpenView(item),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => handleOpenEdit(item),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  if (loading && marcas.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <CrudLayout
        title="Marcas"
        onAddClick={handleOpenCreate}
        showSearch={true}
        searchPlaceholder="Buscar por nombre, descripción..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={searchFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
      >
        {/* Mensaje de error */}
        {error && (
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            ⚠️ {error}
          </div>
        )}

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
        {filteredMarcas.length === 0 && !search && !filterEstado && !loading && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <button 
              onClick={handleOpenCreate}
              className="btn-primary"
              style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
            >
              Crear Primera Marca
            </button>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
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

      {/* Modal para Crear/Editar/Ver Marca */}
      <Modal
        open={modalForm.open}
        type="info"
        title={modalForm.title}
        confirmText={modalForm.mode === "view" ? "Cerrar" : "Guardar"}
        cancelText="Cancelar"
        showCancel={modalForm.mode !== "view"}
        onConfirm={handleModalConfirm}  
        onCancel={handleCloseForm}
      >
        <MarcaForm
          id="marca-form"
          mode={modalForm.mode}
          initialData={modalForm.initialData}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          embedded={true}
          buttonRef={submitButtonRef}
        />
      </Modal>
    </>
  );
}