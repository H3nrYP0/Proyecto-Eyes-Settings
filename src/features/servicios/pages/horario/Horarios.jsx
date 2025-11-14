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
  getAllHorarios,
  deleteHorario,
  updateEstadoHorario,
} from "../../../../lib/data/horariosData";

export default function Horarios() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [search, setSearch] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    empleado: "",
  });

  // Cargar datos
  useEffect(() => {
    const horariosData = getAllHorarios();
    setHorarios(horariosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, empleado) => {
    setModalDelete({
      open: true,
      id,
      empleado,
    });
  };

  const confirmDelete = () => {
    const updated = deleteHorario(modalDelete.id);
    setHorarios([...updated]);
    setModalDelete({ open: false, id: null, empleado: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoHorario(id);
    setHorarios([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredHorarios = horarios.filter((horario) =>
    horario.empleado.toLowerCase().includes(search.toLowerCase())
  );

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "id", header: "ID" },
    { field: "empleado", header: "Empleado" },
    { field: "dia", header: "Día" },
    { field: "horaInicio", header: "Hora Inicio" },
    { field: "horaFinal", header: "Hora Final" },

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
      onClick: (item) => navigate(`/admin/servicios/horarios/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/servicios/horarios/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.empleado),
    },
  ];

  return (
    <CrudLayout
      title="⏰ Horarios"
      description="Gestiona los horarios de trabajo del personal de la óptica."
      onAddClick={() => navigate("/admin/servicios/horarios/crear")}
    >
      {/* BUSCADOR */}
      <div className="search-bar-row">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por empleado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <CrudTable 
        columns={columns} 
        data={filteredHorarios} 
        actions={actions} 
      />

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Horario?"
        message={`Esta acción eliminará el horario de "${modalDelete.empleado}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, empleado: "" })}
      />
    </CrudLayout>
  );
}