import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import Loading from "../../../shared/components/ui/Loading";

import { UserData } from "../../../lib/data/usuariosData";
import { getAllRoles } from "../../../lib/data/rolesData";

export default function GestionUsuarios() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =============================
  // MODAL ELIMINAR
  // =============================
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  // =============================
  // CARGAR USUARIOS DESDE BACKEND
  // =============================
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const [data, rolesData] = await Promise.all([
        UserData.getAllUsers(),
        getAllRoles(),
      ]);

      // ← Igual que Roles: normaliza estado booleano a string
      const normalizados = data.map((u) => ({
        ...u,
        estado: u.estado ? "activo" : "inactivo",
        estadosDisponibles: ["activo", "inactivo"],
      }));

      setUsers(normalizados);
      setRoles(rolesData);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ELIMINAR USUARIO
  // =============================
  const handleDelete = (id, name) => {
    setDeleteModal({ open: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      await UserData.deleteUser(deleteModal.id);
      await loadUsers();
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (error) {
      console.error(error);
      alert("Error al eliminar usuario");
    }
  };

  // =============================
  // CAMBIAR ESTADO DEL USUARIO
  // ← Igual que Roles: recibe (row, nuevoEstado)
  // =============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await UserData.toggleUserEstado(row, nuevoEstado);
      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Error al cambiar estado del usuario");
    }
  };

  // =============================
  // FILTRAR USUARIOS
  // ← Igual que Roles: compara strings "activo"/"inactivo"
  // =============================
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      user.correo?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !filterStatus || user.estado === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // =============================
  // COLUMNAS DE LA TABLA
  // =============================
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
      render: (item) => item.nombre,
    },
    {
      field: "correo",
      header: "Correo",
      render: (item) => item.correo,
    },
    {
      field: "rol_id",
      header: "Rol",
      render: ({ rol_id }) => {
        const rol = roles.find((r) => r.id === rol_id);
        return rol?.nombre ?? "Sin rol";
      },
    },
  ];

  // =============================
  // ACCIONES DE LA TABLA
  // ← Sin toggle-status, igual que Roles
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
  const statusFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // =============================
  // LOADING INICIAL
  // =============================
  if (loading && users.length === 0) {
    return (
      <CrudLayout title="Gestión de Usuarios" showSearch>
        <Loading message="Cargando usuarios..." />
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Gestión de Usuarios"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre o correo..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={statusFilters}
      filterEstado={filterStatus}
      onFilterChange={setFilterStatus}
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

      <CrudTable
        columns={columns}
        data={filteredUsers}
        actions={tableActions}
        onChangeStatus={handleChangeStatus}
        emptyMessage={
          search || filterStatus
            ? "No se encontraron usuarios para los filtros aplicados"
            : "No hay usuarios registrados"
        }
      />

      {/* MODAL ELIMINAR */}
      <Modal
        open={deleteModal.open}
        type="warning"
        title="¿Eliminar Usuario?"
        message={`Esta acción eliminará al usuario "${deleteModal.name}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModal({ open: false, id: null, name: "" })
        }
      />
    </CrudLayout>
  );
}