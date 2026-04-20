// src/features/servicios/pages/servicio/hooks/useServicios.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ServicioData } from '../services/serviciosService';
import { formatCOP } from '../../../../shared/utils/formatCOP';
import axios from '../../../../lib/axios';

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

  const submitButtonRef = useRef(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ isVisible: true, message, type });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const cleanupModalState = useCallback(() => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root?.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
      document.body.style.pointerEvents = 'auto';
    }, 300);
  }, []);

  const sortServicios = (serviciosArray) => {
    return [...serviciosArray].sort((a, b) => 
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );
  };

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
      setServicios(sortServicios(serviciosTransformados));
      setError(null);
    } catch {
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
      showNotification(error.response?.data?.error || "Error al guardar el servicio", "error");
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
      cleanupModalState();
    } catch (err) {
      let errorMessage = "Error al eliminar el servicio";
      if (err.response?.status === 500) {
        errorMessage = "Este servicio tiene citas registradas y no puede eliminarse. Desactívelo en su lugar.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      showNotification(errorMessage, "warning");
      setModalDelete({ open: false, id: null, nombre: "" });
      cleanupModalState();
    }
  }, [modalDelete.id, modalDelete.nombre, showNotification, loadServicios, cleanupModalState]);

  const handleStatusChange = useCallback(async (row) => {
  try {
    const shouldActivate = row.estado !== "activo";
    
    if (!shouldActivate) {
      const estadosQueBloquean = await ServicioData.getEstadosQueBloquean();
      const citasResponse = await axios.get('/citas');
      
      // CORRECCIÓN: acceder a citasResponse.data.data (porque viene paginado)
      const citasList = citasResponse.data.data || citasResponse.data || [];
      
      const citasQueBloquean = citasList.filter(cita => 
        cita.servicio_id === row.id && estadosQueBloquean.includes(cita.estado_cita_id)
      );
      
      if (citasQueBloquean.length > 0) {
        const estadosUnicos = [...new Set(citasQueBloquean.map(c => c.estado_nombre))];
        showNotification(
          `No se puede desactivar "${row.nombre}" porque tiene ${citasQueBloquean.length} cita(s) en estado: ${estadosUnicos.join(' y ')}.`,
          "error"
        );
        return;
      }
    }
    
    // Asegurar que los números no sean null o undefined
    const payload = {
      nombre: row.nombre,
      duracion_min: Number(row.duracion_min) || 0,
      precio: Number(row.precio) || 0,
      descripcion: row.descripcion || '',
      estado: shouldActivate === true
    };
    
    await ServicioData.updateServicio(row.id, payload);
    await loadServicios();
    showNotification(
      `Servicio "${row.nombre}" ${shouldActivate ? 'activado' : 'desactivado'} exitosamente`,
      "success"
    );
  } catch (err) {
    console.error("Error en handleStatusChange:", err);
    const errorMsg = err.response?.data?.error || err.message || "Error al cambiar el estado";
    showNotification(errorMsg, "error");
  }
}, [showNotification, loadServicios]);

  const handleOpenCreate = useCallback(() => {
    setModalForm({ open: true, mode: "create", title: "Crear Nuevo Servicio", initialData: null });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleOpenEdit = useCallback((item) => {
    setModalForm({ open: true, mode: "edit", title: `Editar Servicio: ${item.nombre}`, initialData: item });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleOpenView = useCallback((item) => {
    setModalForm({ open: true, mode: "view", title: `Detalle de Servicio: ${item.nombre}`, initialData: item });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleCloseForm = useCallback(() => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
    cleanupModalState();
  }, [cleanupModalState]);

  const handleCancelDelete = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
    cleanupModalState();
  }, [cleanupModalState]);

  const filteredServicios = useMemo(() => {
    return servicios.filter((servicio) => {
      const matchesSearch = servicio.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = !filterEstado || servicio.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });
  }, [servicios, search, filterEstado]);

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
    { field: "duracion_min", header: "Duración", render: (row) => `${row.duracion_min} min` },
    { field: "precio", header: "Precio", render: (row) => formatCOP(row.precio) }
  ];

  const tableActions = [
    { label: "Cambiar estado", type: "toggle-status", onClick: (item) => handleStatusChange(item) },
    { label: "Ver Detalles", type: "view", onClick: (item) => handleOpenView(item) },
    { label: "Editar", type: "edit", onClick: (item) => handleOpenEdit(item) },
    { label: "Eliminar", type: "delete", onClick: (item) => handleDelete(item.id, item.nombre) },
  ];

  const handleModalConfirm = useCallback(() => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      const formElement = document.getElementById("servicio-form");
      formElement?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  }, [modalForm.mode, handleCloseForm]);

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
    handleModalConfirm
  };
};