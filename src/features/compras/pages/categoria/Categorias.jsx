import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import "../../../../shared/styles/components/crud-table.css";

// Modal reutilizable
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllCategorias,
  deleteCategoria,
  updateEstadoCategoria,
} from "../../../../lib/data/categoriasData";

export default function Categorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const categoriasData = getAllCategorias();
    setCategorias(categoriasData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = () => {
    const updated = deleteCategoria(modalDelete.id);
    setCategorias([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoCategoria(id);
    setCategorias([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "id", header: "ID" },
    { field: "nombre", header: "Nombre" },
    { field: "descripcion", header: "Descripción" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${item.estado === "activa" ? "activo" : "inactivo"}`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activa" ? "✅ Activa" : "⛔ Inactiva"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const actions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`/admin/compras/categorias/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/compras/categorias/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  return (
    <CrudLayout
      title="📁 Categorías de Productos"
      description="Administra las categorías de productos para organizar tu inventario."
      onAddClick={() => navigate("/admin/compras/categorias/crear")}
    >
      {/* Buscador */}
      <div className="search-bar-row">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar categorías..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <CrudTable columns={columns} data={filteredCategorias} actions={actions} />

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Categoría?"
        message={`Esta acción eliminará la categoría "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}