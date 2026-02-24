import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import Loading from "../../../shared/components/ui/Loading";

// Backend
import {
  getAllRoles,
  deleteRol,
  updateEstadoRol,
} from "../../../lib/data/rolesData";

export default function Roles() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =============================
  // MODAL ELIMINAR (SOLO ESTE)
  // =============================
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  // CARGA DE DATOS
  // =============================
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllRoles();

      const normalizados = data.map((r) => ({
        ...r,
        estado: r.estado ? "activo" : "inactivo",
        permisosCount: r.permisos?.length || 0,
        estadosDisponibles: ["activo", "inactivo"],
      }));

      setRoles(normalizados);
    } catch (error) {
      console.error("Error cargando roles:", error);
      setError("No se pudieron cargar los roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ELIMINAR
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteRol(modalDelete.id);
      await cargarRoles();
      setModalDelete({ open: false, id: null, nombre: "" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el rol");
    }
  };

  // =============================
  // CAMBIAR ESTADO (AHORA SOLO ESTA FUNCIÓN)
  // =============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoRol(row.id, nuevoEstado);
      await cargarRoles();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del rol");
    }
  };

  // =============================
  // FILTROS
  // =============================
  const filteredRoles = roles.filter((rol) => {
    const matchesSearch =
      rol.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (rol.descripcion &&
        rol.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado = !filterEstado || rol.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // =============================
  // COLUMNAS
  // =============================
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      render: (item) => item.nombre,
    },
    {
      field: "permisos",
      header: "Permisos",
      render: (item) => {
        const totalPermisos =
          item.permisosCount || item.permisos?.length || 0;
        return `${totalPermisos} permisos`;
      },
    },
  ];

  // =============================
  // ACCIONES (SIN CAMBIAR ESTADO)
  // =============================
  const tableActions = [
    {
      label: "Ver detalles",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => handleDelete(row.id, row.nombre),
    },
  ];

  // =============================
  // FILTROS DE ESTADO
  // =============================
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // =============================
  // LOADING INICIAL
  // =============================
  if (loading && roles.length === 0) {
    return (
      <CrudLayout title="Roles" showSearch>
        <Loading message="Cargando roles..." />
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Roles"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* TABLA */}
      <CrudTable
        columns={columns}
        data={filteredRoles}
        actions={tableActions}
        onChangeStatus={handleChangeStatus} // 👈 ESTO MANEJA EL CAMBIO DE ESTADO
        emptyMessage={
          search || filterEstado
            ? "No se encontraron roles para los filtros aplicados"
            : "No hay roles configurados"
        }
      />

      {/* MODAL ELIMINAR (SOLO ESTE MODAL) */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Rol?"
        message={`Esta acción eliminará el rol "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, nombre: "" })
        }
      />
    </CrudLayout>
  );
}