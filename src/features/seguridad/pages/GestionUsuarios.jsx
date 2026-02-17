import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";

// Backend
import {
  getAllUsuarios,
  deleteUsuario,
  updateEstadoUsuario,
} from "../../../lib/data/usuariosData";

export default function GestionUsuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterRol, setFilterRol] = useState("");

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
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const data = getAllUsuarios();

    const normalizados = data.map((u) => ({
      ...u,
      estado: u.estado ? "activo" : "inactivo", // 👈 misma convención que Roles
    }));

    setUsuarios(normalizados);
  };

  // =============================
  // ELIMINAR
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = () => {
    const updated = deleteUsuario(modalDelete.id);
    setUsuarios(
      updated.map((u) => ({
        ...u,
        estado: u.estado ? "activo" : "inactivo",
      }))
    );
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  // CAMBIAR ESTADO
  // =============================
  const handleToggleEstado = (row) => {
    const nuevoEstado =
      row.estado === "activo" ? "inactivo" : "activo";

    setModalEstado({
      open: true,
      id: row.id,
      nombre: row.nombre,
      nuevoEstado,
    });
  };

  const confirmChangeStatus = () => {
    const updated = updateEstadoUsuario(modalEstado.id);

    setUsuarios(
      updated.map((u) => ({
        ...u,
        estado: u.estado ? "activo" : "inactivo",
      }))
    );

    setModalEstado({
      open: false,
      id: null,
      nombre: "",
      nuevoEstado: "",
    });
  };

  // =============================
  // FILTROS
  // =============================
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado || usuario.estado === filterEstado;

    const matchesRol =
      !filterRol || usuario.rol === filterRol;

    return matchesSearch && matchesEstado && matchesRol;
  });

  // =============================
  // COLUMNAS (SIN ESTADO MANUAL)
  // =============================
  const columns = [
    {
      field: "nombre",
      header: "Nombre",
    },
    {
      field: "rol",
      header: "Rol",
      render: (item) => item.rol,
    },
  ];

  // =============================
  // ACCIONES (MISMA ESTRUCTURA QUE ROLES)
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
  // FILTROS
  // =============================
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const rolFilters = [
    { value: "", label: "Todos los roles" },
    { value: "administrador", label: "Administrador" },
    { value: "vendedor", label: "Vendedor" },
    { value: "optometra", label: "Optómetra" },
    { value: "tecnico", label: "Técnico" },
  ];

  return (
    <CrudLayout
      title="Gestión de Usuarios"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, email, rol..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchFiltersRol={rolFilters}
      filterRol={filterRol}
      onFilterChangeRol={setFilterRol}
    >
      <CrudTable
        columns={columns}
        data={filteredUsuarios}
        actions={tableActions}
        emptyMessage={
          search || filterEstado || filterRol
            ? "No se encontraron usuarios para los filtros aplicados"
            : "No hay usuarios registrados"
        }
      />

      {/* MODAL ELIMINAR */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Usuario?"
        message={`Esta acción eliminará al usuario "${modalDelete.nombre}" y no se puede deshacer.`}
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
        message={`El usuario "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
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
