import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import CategoriaForm from "../categoria/components/categoriasForm";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import Loading from "../../../../shared/components/ui/Loading";
// Importamos el servicio
import { CategoriaData } from "../../../../lib/data/categoriasData";

export default function Categorias() {
  const navigate = useNavigate();

  // =============================
  //    1. TODOS LOS HOOKS DEBEN IR AL INICIO
  // =============================
  const [categorias, setCategorias] = useState([]);
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
    loadCategorias();
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
  }, [categorias]);

  // =============================
  //    4. FUNCIONES DE UTILIDAD
  // =============================
  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await CategoriaData.getAllCategorias();
      const categoriasTransformadas = data.map(categoria => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        estado: categoria.estado ? 'activa' : 'inactiva'
      }));
      setCategorias(categoriasTransformadas);
      setError(null);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError("No se pudieron cargar las categorías");
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
    setModalForm({ open: true, mode: "create", title: "Crear Nueva Categoría", initialData: null });
    limpiarAriaHidden();
  };

  // 👇 SOLO CAMBIAMOS ESTA FUNCIÓN - Convertir estado a boolean para edición
  const handleOpenEdit = (item) => {
    const itemForEdit = {
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      estado: item.estado === 'activa' // Convertir string a boolean
    };
    
    setModalForm({ 
      open: true, 
      mode: "edit", 
      title: `Editar Categoría: ${item.nombre}`, 
      initialData: itemForEdit
    });
    limpiarAriaHidden();
  };

  // 👇 TAMBIÉN CAMBIAMOS ESTA PARA CONSISTENCIA - Convertir estado a boolean para vista
  const handleOpenView = (item) => {
    const itemForView = {
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      estado: item.estado === 'activa' // Convertir string a boolean
    };
    
    setModalForm({ 
      open: true, 
      mode: "view", 
      title: `Detalle de Categoría: ${item.nombre}`, 
      initialData: itemForView
    });
    limpiarAriaHidden();
  };

  const handleCloseForm = () => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
    limpiarAriaHidden();
  };

  const handleFormSubmit = async (data) => {
    try {

      // ✅ FORZAR BOOLEAN REAL
      const payload = {
        ...data,
        estado:
          data.estado === true ||
          data.estado === "true"
      };

      if (modalForm.mode === "create") {
        await CategoriaData.createCategoria(payload);

      } else if (modalForm.mode === "edit") {
        await CategoriaData.updateCategoria(
          modalForm.initialData.id,
          payload
        );
      }

      handleCloseForm();
      await loadCategorias();

    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert("Error al guardar la categoría");
    }
  };

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      const formElement = document.getElementById("categoria-form");
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
      await CategoriaData.deleteCategoria(modalDelete.id);
      await loadCategorias();
      setModalDelete({ open: false, id: null, nombre: "" });
      limpiarAriaHidden();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar la categoría");
    }
  };

  const handleStatusChange = async (row) => {
    try {
      await CategoriaData.toggleCategoriaEstado(row.id, row.estado === "activa");
      await loadCategorias();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("Error al cambiar el estado");
    }
  };

  // =============================
  //    5. FILTROS Y CONFIGURACIÓN
  // =============================
  const filteredCategorias = categorias.filter((categoria) => {
    const matchesSearch = 
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || categoria.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'activa', label: 'Activas' },
    { value: 'inactiva', label: 'Inactivas' }
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleStatusChange(item),
    },
    { label: "Ver Detalles", type: "view", onClick: (item) => handleOpenView(item) },
    { label: "Editar", type: "edit", onClick: (item) => handleOpenEdit(item) },
    { label: "Eliminar", type: "delete", onClick: (item) => handleDelete(item.id, item.nombre) },
  ];

  // =============================
  //    6. RENDERIZADO CONDICIONAL
  // =============================
  if (loading && categorias.length === 0) {
    return (
      <CrudLayout
        title="Categorías de Productos"
        showSearch={true}
        searchPlaceholder="Buscar por nombre, descripción..."
        searchPosition="left"
      >
        <Loading message="Cargando categorías..." />
      </CrudLayout>
    );
  }

  return (
    <>
      <CrudLayout
        title="Categorías de Productos"
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
          data={filteredCategorias} 
          actions={tableActions}
          onChangeStatus={handleStatusChange}
          emptyMessage={
            search || filterEstado ? 
              'No se encontraron categorías para los filtros aplicados' : 
              'No hay categorías registradas'
          }
        />

        {filteredCategorias.length === 0 && !search && !filterEstado && !loading && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <button 
              onClick={handleOpenCreate}
              className="btn-primary"
              style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
            >
              Crear Primera Categoría
            </button>
          </div>
        )}

        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Categoría?"
          message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
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
        <CategoriaForm
          id="categoria-form"
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