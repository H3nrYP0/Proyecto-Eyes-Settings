import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import "../../../../shared/styles/components/crud-table.css";

// 🔗 Importamos las funciones reales del mini backend
import {
  getAllAgenda,
  deleteAgenda,
  updateEstadoAgenda,
} from "../../../../lib/data/agendaData";

export default function Agenda() {
  const navigate = useNavigate();

  // 🔥 Cargar datos reales
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    setCitas(getAllAgenda());
  }, []);

  // 🔥 Toggle de estado usando agendaData.js
  const toggleEstado = (id) => {
    const updated = updateEstadoAgenda(id);
    setCitas([...updated]); // recarga de estado real
  };

  // 🔥 Borrar usando agendaData.js
  const handleDelete = (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;

    const updated = deleteAgenda(id);
    setCitas([...updated]); // recarga de datos
  };

  // 🔥 Buscador
  const [search, setSearch] = useState("");
  const filtered = citas.filter((c) =>
    c.cliente.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Columnas de la tabla
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

  // 🔥 Acciones como Categorías
  const actions = [
    {
      label: "Ver Detalle",
      type: "view",
      onClick: (item) =>
        navigate(`/admin/servicios/agenda/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) =>
        navigate(`/admin/servicios/agenda/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id),
    },
  ];

  return (
    <CrudLayout
      title="📅 Agenda"
      description="Gestiona las citas de tus clientes."
      onAddClick={() => navigate("/admin/servicios/agenda/crear")}
    >
      {/* Buscador */}
      <div className="search-bar-row">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <CrudTable columns={columns} data={filtered} actions={actions} />
    </CrudLayout>
  );
}
