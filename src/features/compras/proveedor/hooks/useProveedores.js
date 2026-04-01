import { useState, useEffect, useCallback } from "react";
import { getAllProveedores, deleteProveedor, toggleEstadoProveedor } from "../services/proveedoresService";
import { normalizeProveedorForForm } from "../utils/proveedoresUtils";

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    razonSocial: "",
  });

  // ============================
  // Cargar proveedores
  // ============================
  const cargarProveedores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProveedores();

      const proveedoresNormalizados = (Array.isArray(data) ? data : []).map((p) => ({
        ...p,
        ...normalizeProveedorForForm(p),
        estadosDisponibles: ["activo", "inactivo"],
      }));

      setProveedores(proveedoresNormalizados);
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setError("No se pudieron cargar los proveedores");
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================
  // Eliminar proveedor
  // ============================
  const eliminarProveedor = useCallback(async (id) => {
    try {
      await deleteProveedor(id);
      await cargarProveedores();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      return { success: false, error: "Error al eliminar el proveedor" };
    }
  }, [cargarProveedores]);

  // ============================
  // Cambiar estado
  // ============================
  const cambiarEstado = useCallback(async (id, nuevoEstadoNombre) => {
    try {
      const nuevoEstadoBool = nuevoEstadoNombre === "activo";
      await toggleEstadoProveedor(id, nuevoEstadoBool);
      await cargarProveedores();
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return { success: false, error: "Error al cambiar el estado" };
    }
  }, [cargarProveedores]);

  // ============================
  // Filtrar proveedores
  // ============================
  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const matchesSearch =
      (proveedor.razonSocial || "").toLowerCase().includes(search.toLowerCase()) ||
      (proveedor.documento || "").toLowerCase().includes(search.toLowerCase()) ||
      (proveedor.correo || "").toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || proveedor.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // ============================
  // Opciones de filtros
  // ============================
  const estadoFilters = [
    { value: "", label: "Todos" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // ============================
  // Handlers de modales
  // ============================
  const openDeleteModal = useCallback((id, razonSocial) => {
    setModalDelete({ open: true, id, razonSocial });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, razonSocial: "" });
  }, []);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  return {
    proveedores: proveedoresFiltrados,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    estadoFilters,
    eliminarProveedor,
    cambiarEstado,
    recargar: cargarProveedores,
    modalDelete,
    openDeleteModal,
    closeDeleteModal,
  };
}