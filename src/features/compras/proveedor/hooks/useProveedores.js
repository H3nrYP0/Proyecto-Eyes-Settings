import { useState, useEffect, useCallback, useRef } from "react";
import { getAllProveedores, deleteProveedor, toggleEstadoProveedor } from "../services/proveedoresService";
import { normalizeProveedorForForm } from "../utils/proveedoresUtils";

export function useProveedores({ onSuccess, onError } = {}) {
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

  // Usar refs para los callbacks (evita que cambien en cada render)
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

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
      // ✅ Se eliminó el mensaje de éxito innecesario
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setError("No se pudieron cargar los proveedores");
      setProveedores([]);
      onErrorRef.current?.("No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias externas

  const eliminarProveedor = useCallback(async (id) => {
    try {
      await deleteProveedor(id);
      await cargarProveedores();
      onSuccessRef.current?.("Proveedor eliminado correctamente", "success");
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar:", error);
      const msg = "Error al eliminar el proveedor";
      onErrorRef.current?.(msg);
      return { success: false, error: msg };
    }
  }, [cargarProveedores]);

  const cambiarEstado = useCallback(async (id, nuevoEstadoNombre) => {
    try {
      const nuevoEstadoBool = nuevoEstadoNombre === "activo";
      await toggleEstadoProveedor(id, nuevoEstadoBool);
      await cargarProveedores();
      onSuccessRef.current?.(`Estado cambiado a ${nuevoEstadoNombre}`, "success");
      return { success: true };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      const msg = "Error al cambiar el estado";
      onErrorRef.current?.(msg);
      return { success: false, error: msg };
    }
  }, [cargarProveedores]);

  const proveedoresFiltrados = proveedores.filter((proveedor) => {
    const matchesSearch =
      (proveedor.razonSocial || "").toLowerCase().includes(search.toLowerCase()) ||
      (proveedor.documento || "").toLowerCase().includes(search.toLowerCase()) ||
      (proveedor.correo || "").toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || proveedor.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const openDeleteModal = useCallback((id, razonSocial) => {
    setModalDelete({ open: true, id, razonSocial });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setModalDelete({ open: false, id: null, razonSocial: "" });
  }, []);

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