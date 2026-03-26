// src/features/servicios/pages/servicio/hooks/useServicios.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ServicioData } from '../services/serviciosService';
import { formatCOP } from '../../../../shared/utils/formatCOP';

export const useServicios = () => {
  const [servicios, setServicios] = useState([]);
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
    setNotification({
      isVisible: true,
      message,
      type
    });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        handleCloseNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible, handleCloseNotification]);

  const limpiarAriaHidden = useCallback(() => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, []);

  const loadServicios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ServicioData.getAllServicios();
      const serviciosTransformados = data.map(servicio => ({
        id: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        duracion_min: servicio.duracion_min,
        precio: servicio.precio,
        estado: servicio.estado ? 'activo' : 'inactivo'
      }));
      setServicios(serviciosTransformados);
      setError(null);
    } catch (err) {
      setError("No se pudieron cargar los servicios");
      showNotification("Error al cargar los servicios", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      if (modalForm.mode === "create") {
        await ServicioData.createServicio(data);
        showNotification("Servicio creado exitosamente", "success");
      } else if (modalForm.mode === "edit") {
        await ServicioData.updateServicio(modalForm.initialData.id, data);
        showNotification("Servicio actualizado exitosamente", "success");
      }
      handleCloseForm();
      await loadServicios();
    } catch (error) {
      showNotification("Error al guardar el servicio", "error");
    }
  }, [modalForm.mode, modalForm.initialData, showNotification, loadServicios]);

  const handleDelete = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await ServicioData.deleteServicio(modalDelete.id);
      await loadServicios();
      showNotification(`Servicio "${modalDelete.nombre}" eliminado exitosamente`, "success");
      setModalDelete({ open: false, id: null, nombre: "" });
      limpiarAriaHidden();
    } catch (err) {
        let errorMessage = "Error al eliminar el servicio";

        if (err.response && err.response.status === 500) {
      errorMessage = "Este servicio tiene citas registradas y no puede eliminarse. Para eliminarlo, primero debe eliminar o reasignar las citas asociadas.";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    showNotification(errorMessage, "warning");
    setModalDelete({ open: false, id: null, nombre: "" });
    limpiarAriaHidden();
  }
  }, [modalDelete.id, modalDelete.nombre, showNotification, loadServicios, limpiarAriaHidden]);

  const handleStatusChange = useCallback(async (row, newStatus) => {
    try {
      const estadoFinal = newStatus !== undefined 
        ? newStatus 
        : (row.estado === "activo" ? "inactivo" : "activo");

      await ServicioData.toggleServicioEstado(
        row.id,
        estadoFinal === "activo"
      );

      await loadServicios();
      
      const mensaje = estadoFinal === "activo" 
        ? `Servicio "${row.nombre}" activado exitosamente`
        : `Servicio "${row.nombre}" desactivado exitosamente`;
      
      showNotification(mensaje, "success");
    } catch (err) {
      showNotification("Error al cambiar el estado del servicio", "error");
    }
  }, [showNotification, loadServicios]);

  const handleOpenCreate = useCallback(() => {
    setModalForm({ 
      open: true, 
      mode: "create", 
      title: "Crear Nuevo Servicio", 
      initialData: null 
    });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleOpenEdit = useCallback((item) => {
    setModalForm({ 
      open: true, 
      mode: "edit", 
      title: `Editar Servicio: ${item.nombre}`, 
      initialData: item 
    });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleOpenView = useCallback((item) => {
    setModalForm({ 
      open: true, 
      mode: "view", 
      title: `Detalle de Servicio: ${item.nombre}`, 
      initialData: item 
    });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleCloseForm = useCallback(() => {
    setModalForm({ 
      open: false, 
      mode: "create", 
      title: "", 
      initialData: null 
    });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const handleCancelDelete = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
    limpiarAriaHidden();
  }, [limpiarAriaHidden]);

  const filteredServicios = useMemo(() => {
    return servicios.filter((servicio) => {
      const matchesSearch = servicio.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = !filterEstado || servicio.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });
  }, [servicios, search, filterEstado]);

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
  }, [servicios]);

  useEffect(() => {
    loadServicios();
  }, [loadServicios]);

  const searchFilters = [
    { value: '', label: 'Todos' },
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' }
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
    { 
      field: "duracion_min", 
      header: "Duración",
      render: (row) => `${row.duracion_min} min`
    },
    { 
      field: "precio", 
      header: "Precio",
      render: (row) => formatCOP(row.precio)
    }
  ];

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
    servicios: filteredServicios,
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
    handleFormSubmit,
    confirmDelete,
    handleStatusChange,
    handleOpenCreate,
    handleCloseForm,
    handleCancelDelete,
    handleCloseNotification,
    searchFilters,
    columns,
    tableActions,
    handleModalConfirm: () => {
      if (modalForm.mode === "view") {
        handleCloseForm();
      } else {
        const formElement = document.getElementById("servicio-form");
        if (formElement) {
          formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
    }
  };
};