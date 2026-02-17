import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";

// Backend
import {
  getAllCategorias,
  deleteCategoria,
  updateEstadoCategoria,
} from "../../../../lib/data/categoriasData";

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
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
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await getAllCategorias();

      const normalizadas = data.map((c) => ({
        ...c,
        estado: c.estado ? "activo" : "inactivo", // 👈 igual que Roles
      }));

      setCategorias(normalizadas);
    } catch (error) {
      console.error("Error cargando categorías:", error);
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
    await deleteCategoria(modalDelete.id);
    await cargarCategorias();
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

  const confirmChangeStatus = async () => {
    await updateEstadoCategoria(
      modalEstado.id,
      modalEstado.nuevoEstado
    );

    await cargarCategorias();

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
  const filteredCategorias = categorias.filter((categoria) => {
    const matchesSearch =
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (categoria.descripcion &&
        categoria.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado =
      !filterEstado || categoria.estado === filterEstado;

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
      title="Categorías de Productos"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      <CrudTable
        columns={columns}
        data={filteredCategorias}
        actions={tableActions}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron categorías para los filtros aplicados"
            : "No hay categorías registradas"
        }
      />

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Categoría?"
        message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, nombre: "" })
        }
      />

      <Modal
        open={modalEstado.open}
        type="info"
        title="¿Cambiar estado?"
        message={`La categoría "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
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
