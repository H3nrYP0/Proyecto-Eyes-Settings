import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";

import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import {
  getAllCitas,
  deleteCita,
  updateCitaStatus,
} from "../../../../lib/data/citasData";

import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";

export default function Citas() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);

  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: "",
  });

  // ============================
  // NORMALIZAR DATA
  // ============================
  const normalizarCitas = (data = []) =>
    data.map((c) => ({
      ...c,
      fecha_formateada: c.fecha
        ? new Date(c.fecha).toLocaleDateString("es-ES")
        : "N/A",
      hora_formateada: c.hora?.substring(0, 5) || "N/A",
      estado: c.estado_nombre || "N/A",
      estadosDisponibles: estadosCita.map(e => e.nombre),
    }));

  // ============================
  // CARGAR DATOS
  // ============================
  const cargarCitas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [citasData, estadosData] = await Promise.all([
        getAllCitas(),
        getAllEstadosCita(),
      ]);

      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      
      const citasNormalizadas = normalizarCitas(citasData);
      setCitas(citasNormalizadas);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las citas");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (citas.length > 0 && estadosCita.length > 0) {
      setCitas(prev => normalizarCitas(prev));
    }
  }, [estadosCita]);

  useEffect(() => {
    cargarCitas();
  }, []);

  // ============================
  // ELIMINAR
  // ============================
  const handleDelete = (id) => {
    const cita = citas.find((c) => c.id === id);

    setModalDelete({
      open: true,
      id,
      descripcion:
        `${cita?.cliente_nombre || "Cliente"} - ${cita?.servicio_nombre || "Servicio"}`,
    });
  };

  const confirmDelete = async () => {
    await deleteCita(modalDelete.id);
    await cargarCitas();
    setModalDelete({ open: false, id: null, descripcion: "" });
  };

  // ============================
  // FILTROS
  // ============================
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.cliente_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      cita.servicio_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      cita.empleado_nombre?.toLowerCase().includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado ||
      cita.estado_cita_id === parseInt(filterEstado);

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    ...estadosCita.map((e) => ({
      value: e.id.toString(),
      label: e.nombre,
    })),
  ];

  // ============================
  // MANEJAR CAMBIO DE ESTADO
  // ============================
  const handleChangeStatus = async (row, newStatus) => {
    try {
      console.log("Cambiando estado de:", row.cliente_nombre, "a:", newStatus);
      
      const estadoSeleccionado = estadosCita.find(e => e.nombre === newStatus);
      
      if (!estadoSeleccionado) {
        console.error("No se encontró el estado:", newStatus);
        return;
      }

      await updateCitaStatus(row.id, estadoSeleccionado.id);
      await cargarCitas();
      
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setError("No se pudo cambiar el estado de la cita");
    }
  };

  // ============================
  // COLUMNAS
  // ============================
  const columns = [
    { field: "cliente_nombre", header: "Cliente" },
    { field: "servicio_nombre", header: "Servicio" },
    { field: "fecha_formateada", header: "Fecha" },
    { field: "hora_formateada", header: "Hora" },
  ];

  // ============================
  // ACCIONES
  // ============================
  const tableActions = [
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
      onClick: (item) => handleDelete(item.id),
    },
  ];

  // ============================
  // LOADING INICIAL
  // ============================
  if (loading && citas.length === 0) {
    return (
      <CrudLayout title="Citas" showSearch>
        <Loading message="Cargando citas..." />
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Citas"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por cliente, servicio, empleado..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      {error && (
        <div className="crud-error">
          ⚠️ {error}
        </div>
      )}

      <CrudTable
        columns={columns}
        data={filteredCitas}
        actions={tableActions}
        onChangeStatus={handleChangeStatus}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron citas para los filtros aplicados"
            : "No hay citas registradas"
        }
      />

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cita?"
        message={`Esta acción eliminará la cita "${modalDelete.descripcion}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, descripcion: "" })
        }
      />
    </CrudLayout>
  );
}