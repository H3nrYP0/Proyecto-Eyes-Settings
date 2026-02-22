import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal"; // ✅ IMPORTAMOS EL MODAL REUTILIZABLE
import HorarioForm from "./components/HorarioForm";
import Loading from "../../../../shared/components/ui/Loading";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import {
  getAllHorarios,
  createHorario,
  updateHorario,
  deleteHorario,
  updateEstadoHorario,
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

  // ============================================
  // 1. ESTADOS
  // ============================================
  const [horarios, setHorarios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const submitButtonRef = useRef(null);

  const [modalForm, setModalForm] = useState({
    open: false,
    mode: "create",
    title: "",
    initialData: null,
  });

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: "",
  });

  // ============================================
  // 2. EFECTOS
  // ============================================
  useEffect(() => {
    cargarDatos();
  }, []);

  // ============================================
  // 3. FUNCIONES AUXILIARES
  // ============================================
  const limpiarAriaHidden = () => {
    setTimeout(() => {
      const root = document.getElementById('root');
      if (root && root.hasAttribute('aria-hidden')) {
        root.removeAttribute('aria-hidden');
      }
      document.body.style.pointerEvents = 'auto';
    }, 300);
  };

  // ============================================
  // 4. CARGA DE DATOS
  // ============================================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [horariosData, empleadosData] = await Promise.all([
        getAllHorarios(),
        getAllEmpleados(),
      ]);

      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);

      const horariosNormalizados = (Array.isArray(horariosData) ? horariosData : []).map((h) => {
        const empleado = empleadosData.find(e => e.id === h.empleado_id);
        const empleadoNombre = empleado?.nombre || "Desconocido";
        const diaNombre = diasSemanaMap[h.dia] || "Desconocido";
        
        return {
          id: h.id,
          empleado_id: h.empleado_id,
          empleado_nombre: empleadoNombre,
          dia: diaNombre,
          dia_valor: h.dia,
          hora_inicio: h.hora_inicio?.substring(0,5) || "",
          hora_inicio_completa: h.hora_inicio,
          hora_final: h.hora_final?.substring(0,5) || "",
          hora_final_completa: h.hora_final,
          estado: h.activo ? "activo" : "inactivo",
          estadosDisponibles: ["activo", "inactivo"],
          descripcion: `${empleadoNombre} - ${diaNombre} ${h.hora_inicio?.substring(0,5)}`
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

  // ============================================
  // 5. HANDLERS DE MODALES - IGUAL QUE EN MARCAS
  // ============================================
  const handleOpenCreate = () => {
    setModalForm({ 
      open: true, 
      mode: "create", 
      title: "Crear Nuevo Horario", 
      initialData: null 
    });
    limpiarAriaHidden();
  };

  const handleOpenEdit = (item) => {
    const horarioParaEditar = {
      id: item.id,
      empleado_id: item.empleado_id,
      dia: item.dia_valor,
      hora_inicio: item.hora_inicio,
      hora_final: item.hora_final,
      activo: item.estado === "activo"
    };

    setModalForm({ 
      open: true, 
      mode: "edit", 
      title: `Editar Horario: ${item.empleado_nombre} - ${item.dia} ${item.hora_inicio}`, 
      initialData: horarioParaEditar 
    });
    limpiarAriaHidden();
  };

  const handleOpenView = (item) => {
    const horarioParaVer = {
      id: item.id,
      empleado_id: item.empleado_id,
      empleado_nombre: item.empleado_nombre,
      dia: item.dia_valor,
      dia_nombre: item.dia,
      hora_inicio: item.hora_inicio,
      hora_final: item.hora_final,
      activo: item.estado === "activo"
    };

    setModalForm({ 
      open: true, 
      mode: "view", 
      title: `Detalle de Horario: ${item.empleado_nombre} - ${item.dia} ${item.hora_inicio}`, 
      initialData: horarioParaVer 
    });
    limpiarAriaHidden();
  };

  const handleCloseForm = () => {
    setModalForm({ open: false, mode: "create", title: "", initialData: null });
    limpiarAriaHidden();
  };

  const handleModalConfirm = () => {
    if (modalForm.mode === "view") {
      handleCloseForm();
    } else {
      // Disparamos el submit del formulario
      const formElement = document.getElementById("horario-form");
      if (formElement) {
        formElement.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
    limpiarAriaHidden();
  };

  // ============================================
  // 6. CRUD OPERACIONES
  // ============================================
  const handleFormSubmit = async (data) => {
    try {
      if (modalForm.mode === "create") {
        await createHorario(data);
      } else if (modalForm.mode === "edit") {
        await updateHorario(modalForm.initialData.id, data);
      }
      handleCloseForm();
      await cargarDatos();
    } catch (error) {
      console.error("Error al guardar horario:", error);
      alert("Error al guardar el horario");
    }
  };

  const handleDelete = (id, descripcion) => {
    setModalDelete({ open: true, id, descripcion });
  };

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, descripcion: "" });
    limpiarAriaHidden();
  };

  const confirmDelete = async () => {
    try {
      await deleteHorario(modalDelete.id);
      await cargarDatos();
      setModalDelete({ open: false, id: null, descripcion: "" });
      limpiarAriaHidden();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el horario");
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoHorario(row.id, nuevoEstado === "activo");
      await cargarDatos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del horario");
    }
  };

  // ============================================
  // 7. FILTROS Y CONFIGURACIÓN
  // ============================================
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

  const columns = [
    { field: "empleado_nombre", header: "Empleado" },
    { field: "dia", header: "Día" },
    { field: "hora_inicio", header: "Hora Inicio" },
    { field: "hora_final", header: "Hora Final" },
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => handleChangeStatus(item),
    },
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => handleOpenView(item),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => handleOpenEdit(item),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.descripcion),
    },
  ];

  // ============================================
  // 8. RENDER
  // ============================================
  if (loading && horarios.length === 0) {
    return (
      <CrudLayout title="Horarios" showSearch>
        <Loading message="Cargando horarios..." />
      </CrudLayout>
    );
  }

  return (
    <>
      {/* Botón Volver - igual que antes */}
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
        onAddClick={handleOpenCreate}
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

        {filteredHorarios.length === 0 && !search && !filterEstado && !loading && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={handleOpenCreate}
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              Crear Primer Horario
            </button>
          </div>
        )}

        {/* ✅ MODAL ELIMINAR - usando Modal reutilizable (igual que en marcas) */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Horario?"
          message={`Esta acción eliminará el horario de "${modalDelete.descripcion}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel={true}
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* ✅ MODAL FORMULARIO - usando Modal reutilizable (igual que en marcas) */}
        <Modal
          open={modalForm.open}
          type="info"
          title={modalForm.title}
          confirmText={modalForm.mode === "view" ? "Cerrar" : "Guardar"}
          cancelText="Cancelar"
          showCancel={modalForm.mode !== "view"}
          onConfirm={handleModalConfirm}
          onCancel={handleCloseForm}
        >
          <HorarioForm
            id="horario-form"
            mode={modalForm.mode}
            initialData={modalForm.initialData}
            empleados={empleados}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            embedded={true}
            buttonRef={submitButtonRef}
          />
        </Modal>
      </CrudLayout>
    </>
  );
}