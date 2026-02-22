import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import Loading from "../../../../shared/components/ui/Loading";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import {
  getAllEmpleados,
  deleteEmpleado,
  updateEstadoEmpleado,
} from "../../../../lib/data/empleadosData";

export default function Empleados() {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // ============================
  // CARGA DE DATOS
  // ============================
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllEmpleados();

      const normalizados = (Array.isArray(data) ? data : []).map((e) => ({
        ...e,
        estado: e.estado === true ? "activo" : "inactivo",
        estadosDisponibles: ["activo", "inactivo"], // ⭐ CLAVE
      }));

      setEmpleados(normalizados);
    } catch (error) {
      console.error("Error cargando empleados:", error);
      setError("No se pudieron cargar los empleados");
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ============================
  // ELIMINAR
  // ============================
  const handleDelete = (id, nombre) =>
    setModalDelete({ open: true, id, nombre });

  const confirmDelete = async () => {
    try {
      await deleteEmpleado(modalDelete.id);
      await cargarEmpleados();
      setModalDelete({ open: false, id: null, nombre: "" });
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el empleado");
    }
  };

  // ============================
  // CAMBIAR ESTADO (LO USA CrudTable)
  // ============================
  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      await updateEstadoEmpleado(row.id, nuevoEstado);
      await cargarEmpleados();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del empleado");
    }
  };

  // ============================
  // FILTROS
  // ============================
  const filteredEmpleados = empleados.filter((empleado) => {
    const matchesSearch =
      empleado.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (empleado.numero_documento?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (empleado.cargo?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (empleado.correo?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesEstado =
      !filterEstado || empleado.estado === filterEstado;

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
    { field: "nombre", header: "Nombre" },
    { field: "cargo", header: "Cargo" },
    { field: "correo", header: "Correo Electrónico" },
  ];

  // ============================
  // ACCIONES (SIN CAMBIAR ESTADO)
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
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  // ============================
  // LOADING INICIAL
  // ============================
  if (loading && empleados.length === 0) {
    return (
      <CrudLayout title="Empleados" showSearch>
        <Loading message="Cargando empleados..." />
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Empleados"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, documento, cargo, email..."
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
        data={filteredEmpleados}
        actions={tableActions}
        onChangeStatus={handleChangeStatus}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron empleados para los filtros aplicados"
            : "No hay empleados registrados"
        }
      />

      {/* MODAL ELIMINAR */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará al empleado "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, nombre: "" })
        }
      />
    </CrudLayout>
  );
}