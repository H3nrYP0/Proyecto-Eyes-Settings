import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import MarcaForm from "./components/MarcasForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import Loading from "../../../../shared/components/ui/Loading";
// Importamos el servicio con axios
import { MarcaData } from "../../../../lib/data/marcasData";

export default function Marcas() {
  const navigate = useNavigate();

  // =============================
  //    1. TODOS LOS HOOKS DEBEN IR AL INICIO
  // =============================
  const [marcas, setMarcas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const submitButtonRef = useRef(null);

  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create",
    title: "",
    initialData: null,
  });

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  //    2. useEffect - Carga inicial
  // =============================
  useEffect(() => {
    loadMarcas();
  }, []);

  // =============================
  //    3. LIMPIADOR GLOBAL DE ARIA-HIDDEN
  // =============================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        const modalExists = document.querySelector('.MuiModal-root');
        if (!modalExists) {
          root.removeAttribute('aria-hidden');
          document.body.style.pointerEvents = 'auto';
        }
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [marcas]);

  // =============================
  //    4. FUNCIONES DE UTILIDAD
  // =============================
  const loadMarcas = async () => {
    try {
      setLoading(true);
      const data = await MarcaData.getAllMarcas();
      const marcasTransformadas = data.map(marca => ({
        id: marca.id,
        nombre: marca.nombre,
        descripcion: marca.descripcion || '',
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

  const limpiarAriaHidden = () => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
      document.body.style.pointerEvents = 'auto';
    }, 300);
  };

  // Handlers de modales
  const handleOpenCreate = () => {
    setModalForm({ open: true, mode: "create", title: "Crear Nueva Marca", initialData: null });
    limpiarAriaHidden();
  };

  const handleOpenEdit = (item) => {
    setModalForm({ open: true, mode: "edit", title: `Editar Marca: ${item.nombre}`, initialData: item });
    limpiarAriaHidden();
  };

  const handleOpenView = (item) => {
    setModalForm({ open: true, mode: "view", title: `Detalle de Marca: ${item.nombre}`, initialData: item });
    limpiarAriaHidden();
  };

  const handleCloseForm = () => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
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

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      const formElement = document.getElementById("marca-form");
      if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
    limpiarAriaHidden();
  };

  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, nombre: "" });
    limpiarAriaHidden();
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

  

  const handleStatusChange = async (row, newStatus) => {
    try {
      const estadoFinal =
        newStatus !== undefined
          ? newStatus
          : (row.estado === "activa" ? "inactiva" : "activa");

      await MarcaData.toggleMarcaEstado(
        row.id,
        estadoFinal === "activa"
      );

      await loadMarcas();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar el estado");
    }
  };

  // =============================
  //    5. FILTROS Y CONFIGURACIÓN
  // =============================
  const filteredMarcas = marcas.filter((marca) => {
    const matchesSearch = 
      marca.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (marca.descripcion && marca.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || marca.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const searchFilters = [
    {value: '', label: 'Todos'},
    { value: 'activa', label: 'Activas' },
    { value: 'inactiva', label: 'Inactivas' }
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
  ];

  const tableActions = [
    {
    label: "Cambiar estado",  type: "toggle-status",   onClick: (item) => handleStatusChange(item),  },
    { label: "Ver Detalles", type: "view", onClick: (item) => handleOpenView(item) },
    { label: "Editar", type: "edit", onClick: (item) => handleOpenEdit(item) },
    { label: "Eliminar", type: "delete", onClick: (item) => handleDelete(item.id, item.nombre) },
  ];

  // =============================
  //    6. RENDERIZADO CONDICIONAL (DESPUÉS DE TODOS LOS HOOKS)
  // =============================
  if (loading && marcas.length === 0) {
    return (
      <CrudLayout
        title="Marcas"
        showSearch={true}
        searchPlaceholder="Buscar por nombre, descripción..."
        searchPosition="left"
      >
        <Loading message="Cargando marcas..." />
      </CrudLayout>
    );
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

        <CrudTable 
          columns={columns} 
          data={filteredMarcas} 
          actions={tableActions}
          onChangeStatus={handleStatusChange}
          emptyMessage={
            search || filterEstado ? 
              'No se encontraron marcas para los filtros aplicados' : 
              'No hay marcas registradas'
          }
        />

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

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Marca?"
          message={`Esta acción eliminará la marca "${modalDelete.nombre}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel={true}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      </CrudLayout>

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