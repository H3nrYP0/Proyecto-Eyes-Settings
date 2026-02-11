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

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  //    CARGA DE DATOS
  // =============================
  useEffect(() => {
    setUsuarios(getAllUsuarios());
  }, []);

  // =============================
  //    ELIMINAR USUARIO
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = () => {
    const updated = deleteUsuario(modalDelete.id);
    setUsuarios([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoUsuario(id);
    setUsuarios([...updated]);
  };

  // =============================
  //    FILTROS
  // =============================
  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado || usuario.estado === filterEstado;

    const matchesRol = !filterRol || usuario.rol === filterRol;

    return matchesSearch && matchesEstado && matchesRol;
  });

  const searchFilters = [
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

  // =============================
  //    COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    {
      field: "rol",
      header: "Rol",
      render: (item) => item.rol,
    },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "Activo" : "Inactivo"}
        </button>
      ),
    },
  ];

  return (
    <CrudLayout
      title="Gestión de Usuarios"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, email, rol..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      additionalFilters={[
        {
          label: "Filtrar por rol",
          value: filterRol,
          onChange: setFilterRol,
          options: rolFilters,
        },
      ]}
    >
      {/* TABLA */}
      <CrudTable
        columns={columns}
        data={filteredUsuarios}
        onView={(row) => navigate(`detalle/${row.id}`)}
        onEdit={(row) => navigate(`editar/${row.id}`)}
        onDelete={(row) => handleDelete(row.id, row.nombre)}
        emptyMessage={
          search || filterEstado || filterRol
            ? "No se encontraron usuarios para los filtros aplicados"
            : "No hay usuarios registrados"
        }
      />

      {/* MODAL */}
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
    </CrudLayout>
  );
}
