import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Backend (API real)
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

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  const [modalEstado, setModalEstado] = useState({
    open: false,
    id: null,
    nombre: "",
    nuevoEstado: "",
  });

  // ============================
  // CARGA DE DATOS (API)
  // ============================
  const cargarCategorias = async () => {
    try {
      const data = await getAllCategorias();

      // Normalizar estado: true/false -> "activa"/"inactiva"
      const normalizadas = (Array.isArray(data) ? data : []).map((c) => ({
        ...c,
        estado: c.estado === true ? "activa" : "inactiva",
      }));

      setCategorias(normalizadas);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // ============================
  // ELIMINAR
  // ============================
  const handleDelete = (id, nombre) =>
    setModalDelete({ open: true, id, nombre });

  const confirmDelete = async () => {
    await deleteCategoria(modalDelete.id);
    await cargarCategorias();
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // ============================
  // CAMBIAR ESTADO
  // ============================
  const handleToggleEstado = (row) => {
    const nuevoEstado = row.estado === "activa" ? "inactiva" : "activa";
    setModalEstado({
      open: true,
      id: row.id,
      nombre: row.nombre,
      nuevoEstado,
    });
  };

  const confirmChangeStatus = async () => {
    await updateEstadoCategoria(modalEstado.id, modalEstado.nuevoEstado);
    await cargarCategorias();
    setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" });
  };

  // ============================
  // FILTROS
  // ============================
  const filteredCategorias = categorias.filter((categoria) => {
    const matchesSearch =
      categoria.nombre.toLowerCase().includes(search.toLowerCase()) ||
      categoria.descripcion.toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || categoria.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activa", label: "Activas" },
    { value: "inactiva", label: "Inactivas" },
  ];

  // ============================
  // COLUMNAS
  // ============================
  const columns = [{ field: "nombre", header: "Nombre" }];

  // ============================
  // ACCIONES
  // ============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: handleToggleEstado,
    },
    {
      label: "Ver detalles",
      type: "view",
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
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

      {filteredCategorias.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)" }}>
          <button
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
          >
            Crear Primera Categoría
          </button>
        </div>
      )}

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Categoría?"
        message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
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
          setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" })
        }
      />
    </CrudLayout>
  );
}
