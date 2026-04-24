import { useState, useEffect, useCallback } from "react";
import { clientesService } from "../services/clientesService";

export function useClientes({ onSuccess } = {}) {
  const [clientes,     setClientes]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterGenero, setFilterGenero] = useState("");
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [modalDelete,  setModalDelete]  = useState({ open: false, id: null, nombre: "" });
  const [modalEstado,  setModalEstado]  = useState({ open: false, id: null, nombre: "", nuevoEstado: "" });

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAllClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarCliente = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const confirmDelete = useCallback(async () => {
    const nombre = modalDelete.nombre;
    try {
      await clientesService.deleteCliente(modalDelete.id);
      await cargarClientes();
      onSuccess?.(`Cliente "${nombre}" eliminado correctamente`, "success");
    } catch (err) {
      console.error("Error eliminando cliente", err);
      onSuccess?.("No se pudo eliminar el cliente", "error");
    } finally {
      setModalDelete({ open: false, id: null, nombre: "" });
    }
  }, [modalDelete.id, modalDelete.nombre, cargarClientes, onSuccess]);

  const cambiarEstado = useCallback((row) => {
    const nuevoEstado = row.estado === "activo" ? "inactivo" : "activo";
    setModalEstado({ open: true, id: row.id, nombre: `${row.nombre} ${row.apellido}`, nuevoEstado });
  }, []);

  const confirmChangeStatus = useCallback(async () => {
    const { nombre, nuevoEstado } = modalEstado;
    try {
      await clientesService.updateEstadoCliente(modalEstado.id, nuevoEstado === "activo");
      await cargarClientes();
      onSuccess?.(`Estado de "${nombre}" cambiado a ${nuevoEstado}`, "success");
    } catch (err) {
      console.error("Error cambiando estado", err);
      onSuccess?.("No se pudo cambiar el estado", "error");
    } finally {
      setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" });
    }
  }, [modalEstado, cargarClientes, onSuccess]);

  const closeDeleteModal  = useCallback(() => setModalDelete({ open: false, id: null, nombre: "" }), []);
  const closeEstadoModal  = useCallback(() => setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" }), []);

  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      c.apellido?.toLowerCase().includes(search.toLowerCase()) ||
      c.documento?.toLowerCase().includes(search.toLowerCase()) ||
      c.ciudad?.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = !filterEstado || c.estado === filterEstado;
    const matchesGenero = !filterGenero || c.genero === filterGenero;
    return matchesSearch && matchesEstado && matchesGenero;
  });

  const estadoFilters = [
    { value: "",         label: "Todos los estados" },
    { value: "activo",   label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const generoFilters = [
    { value: "",          label: "Todos los géneros" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino",  label: "Femenino" },
    { value: "otro",      label: "Otro" },
  ];

  const columns = [
    { field: "nombre",    header: "Nombre" },
    { field: "apellido",  header: "Apellido" },
    { field: "documento", header: "Documento" },
    { field: "telefono",  header: "Teléfono" },
  ];

  const tableActions = [
    { label: "Cambiar estado", type: "toggle-status", onClick: cambiarEstado },
    { label: "Ver detalles",   type: "view",          onClick: (row) => ({ path: `detalle/${row.id}` }) },
    { label: "Editar",         type: "edit",          onClick: (row) => ({ path: `editar/${row.id}` }) },
    { label: "Eliminar",       type: "delete",        onClick: (row) => eliminarCliente(row.id, `${row.nombre} ${row.apellido}`) },
  ];

  useEffect(() => { cargarClientes(); }, [cargarClientes]);

  return {
    clientes: filteredClientes,
    loading, error,
    search, setSearch,
    filterEstado, setFilterEstado,
    filterGenero, setFilterGenero,
    estadoFilters, generoFilters,
    columns, tableActions,
    modalDelete, modalEstado,
    confirmDelete, closeDeleteModal,
    confirmChangeStatus, closeEstadoModal,
  };
}