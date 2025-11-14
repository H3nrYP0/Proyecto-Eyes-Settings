import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import "../../../shared/styles/components/crud-table.css";

export default function Agenda() {
  const navigate = useNavigate();

  // ✅ Datos temporales
  const [citas, setCitas] = useState([
    {
      id: 1,
      cliente: "Laura Martínez",
      servicio: "Examen de la Vista",
      fecha: "2024-01-20",
      hora: "09:00 AM",
      duracion: "30 min",
      metodoPago: "Efectivo",
      estado: "pendiente",
    },
    {
      id: 2,
      cliente: "Roberto Silva",
      servicio: "Adaptación Lentes",
      fecha: "2024-01-19",
      hora: "02:30 PM",
      duracion: "45 min",
      metodoPago: "Tarjeta Crédito",
      estado: "completada",
    },
    {
      id: 3,
      cliente: "María González",
      servicio: "Limpieza y Ajuste",
      fecha: "2024-01-18",
      hora: "11:00 AM",
      duracion: "15 min",
      metodoPago: "Efectivo",
      estado: "cancelada",
    },
  ]);

  // ✅ Toggle de estado
  const toggleEstado = (id) => {
    setCitas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              estado:
                c.estado === "pendiente"
                  ? "completada"
                  : c.estado === "completada"
                  ? "cancelada"
                  : "pendiente",
            }
          : c
      )
    );
  };

  // ✅ Buscador
  const [search, setSearch] = useState("");
  const filtered = citas.filter((c) =>
    c.cliente.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Columnas (idéntico formato a Categorías)
  const columns = [
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

  // ✅ Acciones (idéntico formato a Categorías)
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

  // ✅ Eliminar (simulado)
  const handleDelete = (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    setCitas(citas.filter((c) => c.id !== id));
  };

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
