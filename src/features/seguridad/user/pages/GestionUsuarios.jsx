import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CrudLayout       from "@shared/components/crud/CrudLayout";
import CrudTable        from "@shared/components/crud/CrudTable";
import Modal            from "@shared/components/ui/Modal";
import Loading          from "@shared/components/ui/Loading";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import {
  getAllUsers, deleteUser, updateEstadoUser,
  getAllRoles, normalizeUsers, filtrarUsuarios,
} from "@seguridad";

const STATUS_FILTERS = [
  { value: "", label: "Todos los estados" },
  { value: "activo", label: "Activos" },
  { value: "inactivo", label: "Inactivos" },
];

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const pending = sessionStorage.getItem("crudNotification");
    if (pending) {
      const { message, type } = JSON.parse(pending);
      sessionStorage.removeItem("crudNotification");
      showNotification(message, type);
    }
  }, []);

  // Query de usuarios con staleTime 0 para que refetch funcione siempre
  const {
    data: rawUsers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: getAllUsers,
    staleTime: 0, // importante para que el refetch manual funcione
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  });

  // Normalizar y filtrar clientes
  const users = useMemo(() => {
    if (!rawUsers.length) return [];
    const normalized = normalizeUsers(rawUsers);
    return normalized.filter((u) => u.rol_nombre?.toLowerCase() !== "cliente");
  }, [rawUsers]);

  // Eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      refetch(); // 🔁 forzar recarga
      setDeleteModal({ open: false, id: null, name: "" });
      showNotification(`Usuario "${deleteModal.name}" eliminado correctamente`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || "Error al eliminar usuario";
      setDeleteModal({ open: false, id: null, name: "" });
      showNotification(msg, "error");
    },
  });

  // Cambiar estado
  const estadoMutation = useMutation({
    mutationFn: ({ id, estado }) => updateEstadoUser(id, estado),
    onSuccess: (_, { estado }) => {
      refetch(); // 🔁 forzar recarga
      const label = estado === "activo" ? "activado" : "desactivado";
      showNotification(`Usuario ${label} correctamente`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || err?.message || "Error al cambiar el estado";
      showNotification(msg, "error");
    },
  });

  const handleDelete = (id, name) => setDeleteModal({ open: true, id, name });
  const confirmDelete = () => deleteMutation.mutate(deleteModal.id);
  const handleChangeStatus = async (row, nuevoEstado) => {
    await estadoMutation.mutateAsync({ id: row.id, estado: nuevoEstado });
  };

  const filteredUsers = useMemo(
    () => filtrarUsuarios(users, search, filterStatus),
    [users, search, filterStatus]
  );

  const columns = [
    { field: "nombre", header: "Nombre", render: (item) => item.nombre },
    { field: "correo", header: "Correo", render: (item) => item.correo },
    {
      field: "rol_id",
      header: "Rol",
      render: ({ rol_id }) => roles.find((r) => r.id === rol_id)?.nombre ?? "Sin rol",
    },
  ];

  const tableActions = [
    { label: "Ver detalles", type: "view", onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: "Editar", type: "edit", onClick: (row) => navigate(`editar/${row.id}`) },
    { label: "Eliminar", type: "delete", onClick: (row) => handleDelete(row.id, row.nombre) },
  ];

  if (isLoading && users.length === 0) return <Loading message="Cargando usuarios..." />;

  return (
    <>
      <CrudLayout
        title="Gestión de Usuarios"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por nombre o correo..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={STATUS_FILTERS}
        filterEstado={filterStatus}
        onFilterChange={setFilterStatus}
      >
        {error && (
          <div style={{ padding: 16, backgroundColor: "#ffebee", color: "#c62828", borderRadius: 4, marginBottom: 16 }}>
            ⚠️ {error?.message || "No se pudieron cargar los usuarios"}
          </div>
        )}
        <CrudTable
          columns={columns}
          data={filteredUsers}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage="No hay usuarios registrados"
        />
      </CrudLayout>

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

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}