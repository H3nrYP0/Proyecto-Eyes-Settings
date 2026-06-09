import { useState, useEffect, useMemo, useCallback } from "react";
import { clientesService } from "../services/clientesService";

export function useClientes({ onSuccess } = {}) {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterGenero, setFilterGenero] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({ open: false, id: null, nombre: "" });

  // PAGINACIÓN LOCAL
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  // Aplicar filtros localmente
  const filteredClientes = useMemo(() => {
    let result = [...clientes];

    // Filtro por búsqueda (nombre, apellido, documento, ciudad)
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(term) ||
          c.apellido?.toLowerCase().includes(term) ||
          c.documento?.toLowerCase().includes(term) ||
          c.ciudad?.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (filterEstado) {
      result = result.filter((c) => c.estado === filterEstado);
    }

    // Filtro por género
    if (filterGenero) {
      result = result.filter((c) => c.genero === filterGenero);
    }

    return result;
  }, [clientes, search, filterEstado, filterGenero]);

  // Paginación local
  const totalPages = Math.max(1, Math.ceil(filteredClientes.length / perPage));
  const paginatedClientes = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filteredClientes.slice(start, end);
  }, [filteredClientes, page, perPage]);

  // Reiniciar página cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [search, filterEstado, filterGenero]);

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

  const cambiarEstado = useCallback(
    (row, nuevoEstado) => {
      const estadoAnterior = row.estado;

      // Optimistic update local
      setClientes((prev) =>
        prev.map((c) => (c.id === row.id ? { ...c, estado: nuevoEstado } : c))
      );

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
          // Revertir
          setClientes((prev) =>
            prev.map((c) => (c.id === row.id ? { ...c, estado: estadoAnterior } : c))
          );
          onSuccess?.("No se pudo cambiar el estado", "error");
        });
    },
    [onSuccess]
  );

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
  }, []);

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const generoFilters = [
    { value: "", label: "Todos los géneros" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "apellido", header: "Apellido" },
    { field: "documento", header: "Documento" },
    { field: "telefono", header: "Teléfono" },
  ];

  const tableActions = [
    {
      label: "Ver detalles",
      type: "view",
      onClick: (row) => ({ path: `detalle/${row.id}` }),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => ({ path: `editar/${row.id}` }),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => eliminarCliente(row.id, `${row.nombre} ${row.apellido}`),
    },
  ];

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  return {
    clientes: paginatedClientes,      // ← ahora con paginación
    allFilteredCount: filteredClientes.length, // opcional: total de resultados filtrados
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    filterGenero,
    setFilterGenero,
    estadoFilters,
    generoFilters,
    columns,
    tableActions,
    modalDelete,
    confirmDelete,
    closeDeleteModal,
    cambiarEstado,
    // Paginación
    page,
    setPage,
    totalPages,
  };
}