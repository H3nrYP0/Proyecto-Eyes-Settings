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

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  //    CARGA DE DATOS
  // =============================
  useEffect(() => {
    setRoles(getAllRoles());
  }, []);

  // =============================
  //    ELIMINAR ROL
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = () => {
    const updated = deleteRol(modalDelete.id);
    setRoles([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoRol(id);
    setRoles([...updated]);
  };

  // =============================
  //    FILTROS
  // =============================
  const filteredRoles = roles.filter((rol) => {
    const matchesSearch =
      rol.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (rol.descripcion &&
        rol.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado =
      !filterEstado || rol.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // =============================
  //    COLUMNAS
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
  //    ACCIONES (iconos + tooltips)
  // =============================
  const tableActions = [
  {
    label: "Cambiar estado",
    type: "toggle-status",
    onClick: (row) => toggleEstado(row.id),
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
    onClick: (row) =>
      handleDelete(row.id, row.nombre),
  },
];

  // =============================
  //    FILTROS DE ESTADO
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
      showFilters
      filters={[
        {
          label: "Estado",
          value: filterEstado,
          onChange: setFilterEstado,
          options: estadoFilters,
        },
      ]}
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

      {/* MODAL */}
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
