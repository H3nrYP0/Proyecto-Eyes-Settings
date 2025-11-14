// Página principal del listado de Categorías
// Usa CrudLayout + CrudTable con datos quemados temporalmente
// Autor: (Tu nombre) - Proyecto Eyes Settings

import { useState } from "react";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import "../../../shared/styles/components/crud-table.css";
import { useNavigate } from "react-router-dom";

// Modal reutilizable
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/modal.css";

export default function Categorias() {
  const navigate = useNavigate();

  // ✅ Datos quemados temporales
  const [categorias, setCategorias] = useState([
    {
      id: 1,
      nombre: "Monturas",
      descripcion: "Armazones y monturas para lentes oftálmicos",
      estado: "activa",
    },
    {
      id: 2,
      nombre: "Lentes de Sol",
      descripcion: "Gafas de sol con protección UV",
      estado: "activa",
    },
    {
      id: 3,
      nombre: "Lentes de Contacto",
      descripcion: "Lentes blandos y rígidos",
      estado: "activa",
    },
    {
      id: 4,
      nombre: "Accesorios",
      descripcion: "Estuches, paños y productos de limpieza",
      estado: "activa",
    },
  ]);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
  });

  // Abrir modal
  const handleDelete = (id) => {
    setModalDelete({
      open: true,
      id,
    });
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    setCategorias((prev) => prev.filter((c) => c.id !== modalDelete.id));
    setModalDelete({ open: false, id: null });
  };

  // =============================
  //    ACTIVAR / DESACTIVAR
  // =============================
  const toggleEstado = (id) => {
    setCategorias((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, estado: c.estado === "activa" ? "inactiva" : "activa" }
          : c
      )
    );
  };

  // =============================
  //          BUSCADOR
  // =============================
  const [search, setSearch] = useState("");

  const filtered = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
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
      onClick: (item) =>
        navigate(`/admin/compras/categorias/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) =>
        navigate(`/admin/compras/categorias/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id),
    },
  ];

  // =============================
  //          RENDER
  // =============================
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
      <CrudTable columns={columns} data={filtered} actions={actions} />

      {/* =============================
           MODAL DE CONFIRMACIÓN
         ============================= */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Categoría?"
        message="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null })}
      />
    </CrudLayout>
  );
}
