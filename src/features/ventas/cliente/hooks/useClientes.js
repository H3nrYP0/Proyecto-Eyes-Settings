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

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAllClientes();
      const ordenados = [...data]
        .sort((a, b) => b.id - a.id)
        .map((c) => ({ ...c, estadosDisponibles: ["activo", "inactivo"] }));
      setClientes(ordenados);
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

  // Actualización optimista: cambia el estado localmente PRIMERO
  // para que se vea inmediato aunque CrudTable no awaitee la función.
  // Luego confirma con el backend; si falla, revierte.
  const cambiarEstado = useCallback((row, nuevoEstado) => {
    const estadoAnterior = row.estado;

    // 1. Actualizar localmente de inmediato
    setClientes((prev) =>
      prev.map((c) =>
        c.id === row.id ? { ...c, estado: nuevoEstado } : c
      )
    );

    // 2. Llamar al backend en segundo plano
    clientesService
      .updateEstadoCliente(row.id, nuevoEstado === "activo")
      .then(() => {
        onSuccess?.(
          `Estado de "${row.nombre} ${row.apellido}" cambiado a ${nuevoEstado}`,
          "success"
        );
      })
      .catch((err) => {
        console.error("Error cambiando estado:", err);
        // 3. Revertir si falló
        setClientes((prev) =>
          prev.map((c) =>
            c.id === row.id ? { ...c, estado: estadoAnterior } : c
          )
        );
        onSuccess?.("No se pudo cambiar el estado", "error");
      });
  }, [onSuccess]);

  const closeDeleteModal = useCallback(() =>
    setModalDelete({ open: false, id: null, nombre: "" }), []);

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
    { label: "Ver detalles", type: "view",   onClick: (row) => ({ path: `detalle/${row.id}` }) },
    { label: "Editar",       type: "edit",   onClick: (row) => ({ path: `editar/${row.id}` }) },
    { label: "Eliminar",     type: "delete", onClick: (row) => eliminarCliente(row.id, `${row.nombre} ${row.apellido}`) },
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
    modalDelete,
    confirmDelete, closeDeleteModal,
    cambiarEstado,
  };
}