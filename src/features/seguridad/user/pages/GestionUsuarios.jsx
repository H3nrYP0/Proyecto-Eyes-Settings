import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import CrudLayout       from "@shared/components/crud/CrudLayout";
import CrudTable        from "@shared/components/crud/CrudTable";
import Modal            from "@shared/components/ui/Modal";
import Loading          from "@shared/components/ui/Loading";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import {
  getAllUsers, deleteUser, updateEstadoUser,
  getAllRoles, normalizeUsers, filtrarUsuarios,
} from "@seguridad";

export default function GestionUsuarios() {
  const navigate = useNavigate();

  const [users, setUsers]               = useState([]);
  const [roles, setRoles]               = useState([]);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [deleteModal, setDeleteModal]   = useState({ open: false, id: null, name: "" });

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });

  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });

  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // Lee notificaciones pendientes dejadas por Crear / Editar
  useEffect(() => {
    const pending = sessionStorage.getItem("crudNotification");
    if (pending) {
      const { message, type } = JSON.parse(pending);
      sessionStorage.removeItem("crudNotification");
      showNotification(message, type);
    }
  }, []);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, rolesData] = await Promise.all([getAllUsers(), getAllRoles()]);
      setUsers(normalizeUsers(data));
      setRoles(rolesData);
    } catch (err) {
      const msg = err?.response?.data?.error || "No se pudieron cargar los usuarios";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) =>
    setDeleteModal({ open: true, id, name });

  const confirmDelete = async () => {
    const name = deleteModal.name;
    try {
      await deleteUser(deleteModal.id);
      setDeleteModal({ open: false, id: null, name: "" });
      await loadUsers();
      showNotification(`Usuario "${name}" eliminado correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al eliminar usuario";
      setDeleteModal({ open: false, id: null, name: "" });
      showNotification(msg, "error");
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoUser(row.id, nuevoEstado);
      await loadUsers();
      const label = nuevoEstado === "activo" ? "activado" : "desactivado";
      showNotification(`Usuario "${row.nombre}" ${label} correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al cambiar el estado del usuario";
      showNotification(msg, "error");
    }
  };

  const filteredUsers = useMemo(
    () => filtrarUsuarios(users, search, filterStatus),
    [users, search, filterStatus]
  );

  const columns = [
    { field: "nombre", header: "Nombre", render: (item) => item.nombre },
    { field: "correo", header: "Correo",  render: (item) => item.correo },
    {
      field: "rol_id",
      header: "Rol",
      render: ({ rol_id }) => {
        const rol = roles.find((r) => r.id === rol_id);
        return rol?.nombre ?? "Sin rol";
      },
    },
  ];

  const tableActions = [
    { label: "Ver detalles", type: "view",   onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: "Editar",       type: "edit",   onClick: (row) => navigate(`editar/${row.id}`) },
    { label: "Eliminar",     type: "delete", onClick: (row) => handleDelete(row.id, row.nombre) },
  ];

  const statusFilters = [
    { value: "",         label: "Todos los estados" },
    { value: "activo",   label: "Activos"           },
    { value: "inactivo", label: "Inactivos"         },
  ];

  if (loading && users.length === 0) {
    return (
      <CrudLayout title="Gestión de Usuarios" showSearch>
        <Loading message="Cargando usuarios..." />
      </CrudLayout>
    );
  }

  return (
    <>
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
          <div style={{
            padding: "16px", backgroundColor: "#ffebee",
            color: "#c62828", borderRadius: "4px", marginBottom: "16px",
          }}>
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

        <Modal
          open={deleteModal.open}
          type="warning"
          title="¿Eliminar Usuario?"
          message={`Esta acción eliminará al usuario "${deleteModal.name}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ open: false, id: null, name: "" })}
        />
      </CrudLayout>

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}