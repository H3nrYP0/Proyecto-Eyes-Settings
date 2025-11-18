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
  getAllEmpleados,
  deleteEmpleado,
  updateEstadoEmpleado,
} from "../../../../lib/data/empleadosData";

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const empleadosData = getAllEmpleados();
    setEmpleados(empleadosData);
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
    const updated = deleteEmpleado(modalDelete.id);
    setEmpleados([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoEmpleado(id);
    setEmpleados([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // =============================
  //          COLUMNAS (solo las relevantes)
  // =============================
  const columns = [
    { field: "id", header: "ID" },
    { field: "nombre", header: "Nombre" },
    { field: "numero_documento", header: "Documento" },
    { field: "telefono", header: "Teléfono" },
    { field: "cargo", header: "Cargo" },
    { field: "fecha_ingreso", header: "Fecha Ingreso" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${
            item.estado === "activo" ? "activo" : "inactivo"
          }`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "✅ Activo" : "⛔ Inactivo"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const actions = [
    {
      label: "Ver Detalle",
      type: "view",
      onClick: (item) => navigate(`/admin/servicios/empleados/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/servicios/empleados/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  return (
    <CrudLayout
      title="💼 Empleados"
      description="Administra la información del personal de la óptica."
      onAddClick={() => navigate("/admin/servicios/empleados/crear")}
    >
      {/* BUSCADOR */}
      <div className="search-bar-row">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <CrudTable 
        columns={columns} 
        data={filteredEmpleados} 
        actions={actions} 
      />

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará al empleado "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}