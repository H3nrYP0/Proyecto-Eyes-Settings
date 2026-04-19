import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { marcasService } from '../services/marcasService';
import { normalizeMarcaForList, searchFilters, columns } from '../utils/marcasUtils';

export function useMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [notification, setNotification] = useState({
    isVisible: false,
    message: "",
    type: "success"
  });
  
  const submitButtonRef = useRef(null);
  const isDeletingRef = useRef(false);

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

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ isVisible: true, message, type });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const limpiarAriaHidden = useCallback(() => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, []);

  const loadMarcas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await marcasService.getAllMarcas();
      const marcasTransformadas = data.map(marca => normalizeMarcaForList(marca));
      setMarcas(marcasTransformadas);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar las marcas");
      showNotification("Error al cargar las marcas", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const handleFormSubmit = useCallback(async (data) => {
    if (submitButtonRef.current?.disabled) {
      return;
    }
    
    try {
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = true;
      }
      
      if (modalForm.mode === "create") {
        await marcasService.createMarca(data);
        showNotification("Marca creada exitosamente", "success");
      } else if (modalForm.mode === "edit") {
        await marcasService.updateMarca(modalForm.initialData.id, data);
        showNotification("Marca actualizada exitosamente", "success");
      }
      
      handleCloseForm();
      await loadMarcas();
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
      showNotification(error.response?.data?.message || "Error al guardar la marca", "error");
    } finally {
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
    }
  }, [modalForm.mode, modalForm.initialData, showNotification, loadMarcas]);

  const handleDelete = useCallback((id, nombre) => {
    if (!id) {
      showNotification("Error: No se puede eliminar la marca", "error");
      return;
    }
    setModalDelete({ open: true, id, nombre });
  }, [showNotification]);

  const confirmDelete = useCallback(async () => {
    if (isDeletingRef.current) {
      return;
    }
    
    if (!modalDelete.id) {
      showNotification("Error: No se pudo identificar la marca a eliminar", "error");
      setModalDelete({ open: false, id: null, nombre: "" });
      limpiarAriaHidden();
      return;
    }

    isDeletingRef.current = true;

    try {
      const tieneProductos = await marcasService.hasMarcaProductosAsociados(modalDelete.id);
      
      if (tieneProductos) {
        showNotification(
          `No se puede eliminar la marca "${modalDelete.nombre}" porque tiene productos asociados`, 
          "warning"
        );
        setModalDelete({ open: false, id: null, nombre: "" });
        limpiarAriaHidden();
        isDeletingRef.current = false;
        return;
      }
      
      await marcasService.deleteMarca(modalDelete.id);
      
      setModalDelete({ open: false, id: null, nombre: "" });
      limpiarAriaHidden();
      
      await loadMarcas();
      
      showNotification(`Marca "${modalDelete.nombre}" eliminada exitosamente`, "success");
    } catch (err) {
      if (err.response?.status === 404) {
        setModalDelete({ open: false, id: null, nombre: "" });
        limpiarAriaHidden();
        await loadMarcas();
        showNotification(`La marca "${modalDelete.nombre}" ya no existe en el sistema`, "info");
      } else {
        showNotification("Error al eliminar la marca", "error");
      }
    } finally {
      isDeletingRef.current = false;
    }
  }, [modalDelete.id, modalDelete.nombre, showNotification, loadMarcas, limpiarAriaHidden]);

  const handleStatusChange = useCallback(async (row, newStatus) => {
    try {
      const estadoFinal = newStatus !== undefined 
        ? newStatus 
        : (row.estado === "activa" ? "inactiva" : "activa");

      await marcasService.toggleMarcaEstado(row.id, estadoFinal === "activa" );
      await loadMarcas();
      
      const mensaje = estadoFinal === "activa" 
        ? `Marca "${row.nombre}" activada exitosamente`
        : `Marca "${row.nombre}" desactivada exitosamente`;
      
      showNotification(mensaje, "success");
    } catch (err) {
      showNotification("Error al cambiar el estado de la marca", "error");
    }
  }, [showNotification, loadMarcas]);

  const handleOpenCreate = useCallback(() => {
    setModalForm({ open: true, mode: "create", title: "Crear Nueva Marca", initialData: null });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleOpenEdit = useCallback((item) => {
    if (!item?.id) {
      showNotification("Error: No se puede editar la marca", "error");
      return;
    }
    setModalForm({ open: true, mode: "edit", title: `Editar Marca: ${item.nombre}`, initialData: item });
    limpiarAriaHidden();
  }, [limpiarAriaHidden, showNotification]);

  const handleOpenView = useCallback((item) => {
    if (!item?.id) {
      showNotification("Error: No se puede ver la marca", "error");
      return;
    }
    setModalForm({ open: true, mode: "view", title: `Detalle de Marca: ${item.nombre}`, initialData: item });
    limpiarAriaHidden();
  }, [limpiarAriaHidden, showNotification]);

  const handleCloseForm = useCallback(() => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleCancelDelete = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleModalConfirm = useCallback(() => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      const formElement = document.getElementById("marca-form");
      if (formElement) {
        if (typeof formElement.requestSubmit === 'function') {
          formElement.requestSubmit();
        } else {
          formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
    }
  }, [modalForm.mode, handleCloseForm]);

  const filteredMarcas = useMemo(() => {
    return marcas.filter((marca) => {
      const matchesSearch = marca.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = !filterEstado || marca.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });
  }, [marcas, search, filterEstado]);

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

  useEffect(() => {
    loadMarcas();
  }, [loadMarcas]);

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleStatusChange(item, undefined),
    },
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => handleOpenView(item)
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => handleOpenEdit(item)
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre)
    },
  ];

  return {
    marcas: filteredMarcas,
    allMarcas: marcas,
    loading,
    error,
    search,
    filterEstado,
    notification,
    modalForm,
    modalDelete,
    submitButtonRef,
    setSearch,
    setFilterEstado,
    loadMarcas,
    handleFormSubmit,
    handleDelete,
    confirmDelete,
    handleStatusChange,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenView,
    handleCloseForm,
    handleCancelDelete,
    handleCloseNotification,
    handleModalConfirm,
    searchFilters,
    columns,
    tableActions,
  };
}