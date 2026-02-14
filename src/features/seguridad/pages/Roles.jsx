import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";

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

  // =============================
  // MODAL ELIMINAR
  // =============================
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  // MODAL CAMBIAR ESTADO
  // =============================
  const [modalEstado, setModalEstado] = useState({
    open: false,
    id: null,
    nombre: "",
    nuevoEstado: "",
  });

  // =============================
  // CARGA DE DATOS
  // =============================
  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const data = await getAllRoles();

      const normalizados = (Array.isArray(data) ? data : []).map((r) => ({
        ...r,
        estado: r.estado === true ? "activo" : "inactivo",
      }));

      setRoles(normalizados);
    } catch (error) {
      console.error("Error cargando roles:", error);
      setRoles([]);
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
    await deleteRol(modalDelete.id);
    await cargarRoles();
    setModalDelete({ open: false, id: null, nombre: "" });
  };


  // =============================
  // CAMBIAR ESTADO
  // =============================
  const handleToggleEstado = (row) => {
    const nuevoEstado = row.estado === "activo" ? "inactivo" : "activo";

    setModalEstado({
      open: true,
      id: row.id,
      nombre: row.nombre,
      nuevoEstado,
    });
  };

  const confirmChangeStatus = async () => {
    try {
      const updated = await updateEstadoRol(
        modalEstado.id,
        modalEstado.nuevoEstado
      );

      setRoles(updated);

      setModalEstado({
        open: false,
        id: null,
        nombre: "",
        nuevoEstado: "",
      });
    } catch (error) {
      console.error("Error al cambiar estado:", error);
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
  // ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (row) => handleToggleEstado(row),
    },
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

  return (
    <CrudLayout
      title="Roles"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}       // <- aquí pasamos los filtros
      filterEstado={filterEstado}         // <- valor actual del filtro
      onFilterChange={setFilterEstado}    // <- función para actualizar filtro
    >
      {/* TABLA */}
      <CrudTable
        columns={columns}
        data={filteredRoles}
        actions={tableActions}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron roles para los filtros aplicados"
            : "No hay roles configurados"
        }
      />

      {/* MODAL ELIMINAR */}
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

      {/* MODAL CAMBIAR ESTADO */}
      <Modal
        open={modalEstado.open}
        type="info"
        title="¿Cambiar estado?"
        message={`El rol "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmChangeStatus}
        onCancel={() =>
          setModalEstado({
            open: false,
            id: null,
            nombre: "",
            nuevoEstado: "",
          })
        }
      />
    </CrudLayout>
  );
}
