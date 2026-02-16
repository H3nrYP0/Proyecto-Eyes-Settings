import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Backend (API real)
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

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  const [modalEstado, setModalEstado] = useState({
    open: false,
    id: null,
    nombre: "",
    nuevoEstado: "",
  });

  // ============================
  // CARGA DE DATOS (API)
  // ============================
  const cargarEmpleados = async () => {
    try {
      const data = await getAllEmpleados();

      // Normalizar estado: true/false -> "activo"/"inactivo"
      const normalizados = (Array.isArray(data) ? data : []).map((e) => ({
        ...e,
        estado: e.estado === true ? "activo" : "inactivo",
      }));

      setEmpleados(normalizados);
    } catch (error) {
      console.error("Error cargando empleados:", error);
      setEmpleados([]);
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
    await deleteEmpleado(modalDelete.id);
    await cargarEmpleados();
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // ============================
  // CAMBIAR ESTADO
  // ============================
  const handleToggleEstado = (row) => {
    const nuevoEstado = row.estado === "activo" ? "inactivo" : "activo";
    setModalEstado({
      open: true,
      id: row.id,
      nombre: row.nombre,
      nuevoEstado,
    });
  };

  const confirmChangeStatus = async () => {
    await updateEstadoEmpleado(modalEstado.id, modalEstado.nuevoEstado);
    await cargarEmpleados();
    setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" });
  };

  // ============================
  // FILTROS
  // ============================
  const filteredEmpleados = empleados.filter((empleado) => {
    const matchesSearch =
      empleado.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (empleado.numero_documento?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (empleado.cargo?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesEstado = !filterEstado || empleado.estado === filterEstado;

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
  ];

  // ============================
  // ACCIONES
  // ============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: handleToggleEstado,
    },
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

  return (
    <CrudLayout
      title="Empleados"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, documento, cargo..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      <CrudTable
        columns={columns}
        data={filteredEmpleados}
        actions={tableActions}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron empleados para los filtros aplicados"
            : "No hay empleados registrados"
        }
      />

      {filteredEmpleados.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)" }}>
          <button
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{ padding: "var(--spacing-md) var(--spacing-lg)" }}
          >
            Registrar Primer Empleado
          </button>
        </div>
      )}

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Empleado?"
        message={`Esta acción eliminará al empleado "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />

      <Modal
        open={modalEstado.open}
        type="info"
        title="¿Cambiar estado?"
        message={`El empleado "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmChangeStatus}
        onCancel={() =>
          setModalEstado({ open: false, id: null, nombre: "", nuevoEstado: "" })
        }
      />
    </CrudLayout>
  );
}