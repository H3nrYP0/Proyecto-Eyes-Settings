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
  getAllAgenda,
  deleteAgenda,
  updateEstadoAgenda,
} from "../../../../lib/data/agendaData";

export default function Agenda() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [search, setSearch] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    cliente: "",
  });

  // Cargar datos
  useEffect(() => {
    const agendaData = getAllAgenda();
    setCitas(agendaData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, cliente) => {
    setModalDelete({
      open: true,
      id,
      cliente,
    });
  };

  const confirmDelete = () => {
    const updated = deleteAgenda(modalDelete.id);
    setCitas([...updated]);
    setModalDelete({ open: false, id: null, cliente: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoAgenda(id);
    setCitas([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredCitas = citas.filter((cita) =>
    cita.cliente.toLowerCase().includes(search.toLowerCase())
  );

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "id", header: "ID" },
    { field: "cliente", header: "Cliente" },
    { field: "servicio", header: "Servicio" },
    { field: "fecha", header: "Fecha" },
    { field: "hora", header: "Hora" },
    { field: "duracion", header: "Duración" },
    { field: "metodoPago", header: "Pago" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${
            item.estado === "pendiente"
              ? "pendiente"
              : item.estado === "completada"
              ? "completada"
              : "cancelada"
          }`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "pendiente"
            ? "🟡 Pendiente"
            : item.estado === "completada"
            ? "✅ Completada"
            : "❌ Cancelada"}
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
      onClick: (item) => navigate(`/admin/servicios/agenda/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/servicios/agenda/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.cliente),
    },
  ];

  return (
    <CrudLayout
      title="📅 Agenda"
      description="Gestiona las citas de tus clientes."
      onAddClick={() => navigate("/admin/servicios/agenda/crear")}
    >
      {/* BUSCADOR */}
      <div className="search-bar-row">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <CrudTable 
        columns={columns} 
        data={filteredCitas} 
        actions={actions} 
      />

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cita?"
        message={`Esta acción eliminará la cita de "${modalDelete.cliente}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, cliente: "" })}
      />
    </CrudLayout>
  );
}