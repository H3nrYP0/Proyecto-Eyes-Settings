import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CrudLayout       from "@shared/components/crud/CrudLayout";
import CrudTable        from "@shared/components/crud/CrudTable";
import Modal            from "@shared/components/ui/Modal";
import Loading          from "@shared/components/ui/Loading";
import CrudNotification from "@shared/styles/components/notifications/CrudNotification";

import {
  getAllUsers,
  deleteUser,
  updateEstadoUser,
  getAllRoles,
  normalizeUsers,
  filtrarUsuarios,
} from "@seguridad";

export default function GestionUsuarios() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deleteModal, setDeleteModal]   = useState({ open: false, id: null, name: "" });

  const [notification, setNotification] = useState({
    isVisible: false, message: "", type: "success",
  });

  const showNotification = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });

  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // React Query (reemplaza loadUsers)
  const { data, isLoading, error } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const [data, rolesData] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);

      return {
        users: normalizeUsers(data),
        roles: rolesData
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const users = data?.users || [];
  const roles = data?.roles || [];

  // Filtrar usuarios para excluir los que tienen rol "Cliente"
  const clienteRoleId = useMemo(() => {
    const clienteRole = roles.find(rol => rol.nombre?.toLowerCase() === "cliente");
    return clienteRole?.id;
  }, [roles]);

  const usuariosSinClientes = useMemo(() => {
    if (!clienteRoleId) return users;
    return users.filter(user => user.rol_id !== clienteRoleId);
  }, [users, clienteRoleId]);

  // Leer notificaciones persistidas
  useEffect(() => {
    const pending = sessionStorage.getItem("crudNotification");
    if (pending) {
      const { message, type } = JSON.parse(pending);
      sessionStorage.removeItem("crudNotification");
      showNotification(message, type);
    }
  }, []);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["usuarios"], (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.filter(u => u.id !== id)
        };
      });
    }
  });

  // cambiar estado
  const estadoMutation = useMutation({
    mutationFn: ({ id, estado }) => updateEstadoUser(id, estado),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["usuarios"], (old) => {
        if (!old) return old;

        return {
          ...old,
          users: old.users.map(u =>
            u.id === variables.id
              ? { ...u, estado: variables.estado === "activo" }
              : u
          )
        };
      });
    }
  });

  const handleDelete = (id, name) =>
    setDeleteModal({ open: true, id, name });

  const confirmDelete = async () => {
    const name = deleteModal.name;
    try {
      await deleteMutation.mutateAsync(deleteModal.id);

      setDeleteModal({ open: false, id: null, name: "" });
      showNotification(`Usuario "${name}" eliminado correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al eliminar usuario";
      setDeleteModal({ open: false, id: null, name: "" });
      showNotification(msg, "error");
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await estadoMutation.mutateAsync({
        id: row.id,
        estado: nuevoEstado
      });

      const label = nuevoEstado === "activo" ? "activado" : "desactivado";

      const nombreCompleto = row.nombres && row.apellidos 
        ? `${row.nombres} ${row.apellidos}`
        : row.nombre || "Usuario";

      showNotification(`Usuario "${nombreCompleto}" ${label} correctamente`);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al cambiar el estado del usuario";
      showNotification(msg, "error");
    }
  };

  const getNombreCompleto = (item) => {
    if (item.nombres && item.apellidos) {
      return `${item.nombres} ${item.apellidos}`;
    }
    return item.nombre || "Sin nombre";
  };

  const filteredUsers = useMemo(
    () => filtrarUsuarios(usuariosSinClientes, search, filterStatus),
    [usuariosSinClientes, search, filterStatus]
  );

  const columns = [
    { 
      field: "nombre", 
      header: "Nombre", 
      render: (item) => getNombreCompleto(item)
    },
    { 
      field: "correo", 
      header: "Correo",  
      render: (item) => item.correo 
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

  const tableActions = [
    { label: "Ver detalles", type: "view",   onClick: (row) => navigate(`detalle/${row.id}`) },
    { label: "Editar",       type: "edit",   onClick: (row) => navigate(`editar/${row.id}`) },
    { label: "Eliminar",     type: "delete", onClick: (row) => handleDelete(row.id, getNombreCompleto(row)) },
  ];

  const statusFilters = [
    { value: "",         label: "Todos los estados" },
    { value: "activo",   label: "Activos"           },
    { value: "inactivo", label: "Inactivos"         },
  ];

  if (isLoading) {
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
            padding: "16px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "16px",
          }}>
            ⚠️ {error?.message || "Error al cargar usuarios"}
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