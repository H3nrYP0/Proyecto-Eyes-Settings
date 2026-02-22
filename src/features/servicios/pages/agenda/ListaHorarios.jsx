import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import {
  getAllHorarios,
  deleteHorario,
} from "../../../../lib/data/horariosData";

import { getAllEmpleados } from "../../../../lib/data/empleadosData";

// Mapeo de días (0 = lunes, 1 = martes, ... 6 = domingo)
const diasSemanaMap = {
  0: "Lunes",
  1: "Martes",
  2: "Miércoles",
  3: "Jueves",
  4: "Viernes",
  5: "Sábado",
  6: "Domingo"
};

export default function ListaHorarios() {
  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
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
  // CARGA DE DATOS
  // ============================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [horariosData, empleadosData] = await Promise.all([
        getAllHorarios(),
        getAllEmpleados(),
      ]);

      // Normalizar horarios para la tabla
      const horariosNormalizados = (Array.isArray(horariosData) ? horariosData : []).map((h) => {
        const empleado = empleadosData.find(e => e.id === h.empleado_id);
        const empleadoNombre = empleado?.nombre || "Desconocido";
        const diaNombre = diasSemanaMap[h.dia] || "Desconocido";
        
        return {
          id: h.id,
          empleado_id: h.empleado_id,
          empleado_nombre: empleadoNombre,
          dia: diaNombre,
          hora_inicio: h.hora_inicio?.substring(0,5) || "",
          hora_final: h.hora_final?.substring(0,5) || "",
          estado: h.activo ? "activo" : "inactivo",
          estadosDisponibles: ["activo", "inactivo"],
        };
      });

      setHorarios(horariosNormalizados);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los horarios");
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================
  // ELIMINAR
  // ============================
  const handleDelete = (id, descripcion) =>
    setModalDelete({ open: true, id, descripcion });

  const confirmDelete = async () => {
    try {
      await deleteHorario(modalDelete.id);
      await cargarDatos();
      setModalDelete({ open: false, id: null, descripcion: "" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el horario");
    }
  };

  // ============================
  // CAMBIAR ESTADO (pendiente de implementar en API)
  // ============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      // TODO: Implementar cuando la API tenga endpoint para cambiar estado
      console.log("Cambiar estado de:", row.id, "a:", nuevoEstado);
      alert("Función de cambio de estado en desarrollo");
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del horario");
    }
  };

  // ============================
  // FILTROS
  // ============================
  const filteredHorarios = horarios.filter((horario) => {
    const matchesSearch =
      horario.empleado_nombre?.toLowerCase().includes(search.toLowerCase()) ||
      horario.dia?.toLowerCase().includes(search.toLowerCase()) ||
      horario.hora_inicio?.includes(search) ||
      horario.hora_final?.includes(search);

    const matchesEstado =
      !filterEstado || horario.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  // ============================
  // COLUMNAS
  // ============================
  const columns = [
    { field: "empleado_nombre", header: "Empleado" },
    { field: "dia", header: "Día" },
    { field: "hora_inicio", header: "Hora Inicio" },
    { field: "hora_final", header: "Hora Final" },
  ];

  // ============================
  // ACCIONES
  // ============================
  const tableActions = [
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/servicios/agenda/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, `${item.empleado_nombre} - ${item.dia} ${item.hora_inicio}`),
    },
  ];

  // ============================
  // LOADING INICIAL
  // ============================
  if (loading && horarios.length === 0) {
    return (
      <CrudLayout title="Horarios" showSearch>
        <Loading message="Cargando horarios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      {/* BOTÓN DE REGRESAR FUERA DEL CrudLayout */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/servicios/agenda")}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        >
          Volver a Agenda
        </Button>
      </Box>

      <CrudLayout
        title="Horarios"
        onAddClick={() => navigate("/admin/servicios/agenda/crear")}
        showSearch
        searchPlaceholder="Buscar por empleado, día, hora..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      >
        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <CrudTable
          columns={columns}
          data={filteredHorarios}
          actions={tableActions}
          onChangeStatus={handleChangeStatus}
          emptyMessage={
            search || filterEstado
              ? "No se encontraron horarios para los filtros aplicados"
              : "No hay horarios registrados"
          }
        />

        {/* MODAL ELIMINAR */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Horario?"
          message={`Esta acción eliminará el horario de "${modalDelete.descripcion}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() =>
            setModalDelete({ open: false, id: null, descripcion: "" })
          }
        />
      </CrudLayout>
    </>
  );
}