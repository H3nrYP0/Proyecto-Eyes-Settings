import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";

import {
  getAllClientes,
  deleteCliente,
  updateEstadoCliente,
} from "../../../lib/data/clientesData";

export default function Clientes() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterGenero, setFilterGenero] = useState("");

  // =============================
  // MODAL ELIMINAR
  // =============================
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // =============================
  // MODAL CAMBIAR ESTADO
  // =============================
  const [modalEstado, setModalEstado] = useState({
    open: false,
    id: null,
    nombre: "",
    nuevoEstado: "",
  });

  // =============================
  // CARGA DE DATOS
  // =============================
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const res = await getAllClientes();
      const clientesArray = Array.isArray(res) ? res : res?.data || [];

      const normalizados = clientesArray.map((c) => ({
        ...c,
        estado: c.estado ? "activo" : "inactivo",
      }));

      setClientes(normalizados);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setClientes([]);
    }
  };

  // =============================
  // ELIMINAR
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = async () => {
    try {
      await deleteCliente(modalDelete.id);
      await cargarClientes();
    } catch (err) {
      console.error("Error eliminando cliente", err);
    }

    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  // CAMBIAR ESTADO
  // =============================
  const handleToggleEstado = (row) => {
    const nuevoEstado = row.estado === "activo" ? "inactivo" : "activo";

    setModalEstado({
      open: true,
      id: row.id,
      nombre: `${row.nombre} ${row.apellido}`,
      nuevoEstado,
    });
  };

  const confirmChangeStatus = async () => {
    try {
      await updateEstadoCliente(
        modalEstado.id,
        modalEstado.nuevoEstado === "activo"
      );

      await cargarClientes();
    } catch (err) {
      console.error("Error cambiando estado", err);
    }

    setModalEstado({
      open: false,
      id: null,
      nombre: "",
      nuevoEstado: "",
    });
  };

  // =============================
  // FILTROS
  // =============================
  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      c.apellido?.toLowerCase().includes(search.toLowerCase()) ||
      c.documento?.toLowerCase().includes(search.toLowerCase()) ||
      c.ciudad?.toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || c.estado === filterEstado;
    const matchesGenero = !filterGenero || c.genero === filterGenero;

    return matchesSearch && matchesEstado && matchesGenero;
  });

  // =============================
  // COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "apellido", header: "Apellido" },
    { field: "documento", header: "Documento" },
    { field: "telefono", header: "Teléfono" },
  ];

  // =============================
  // ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (row) => handleToggleEstado(row),
    },
    {
      label: "Ver detalles",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) =>
        handleDelete(row.id, `${row.nombre} ${row.apellido}`),
    },
  ];

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const generoFilters = [
    { value: "", label: "Todos los géneros" },
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
  ];

  return (
    <CrudLayout
      title="Clientes"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre, documento, ciudad..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchFiltersRol={generoFilters}
      filterRol={filterGenero}
      onFilterChangeRol={setFilterGenero}
    >
      <CrudTable
        columns={columns}
        data={filteredClientes}
        actions={tableActions}
        emptyMessage={
          search || filterEstado || filterGenero
            ? "No se encontraron clientes para los filtros aplicados"
            : "No hay clientes registrados"
        }
      />

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Cliente?"
        message={`Esta acción eliminará al cliente "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, nombre: "" })
        }
      />

      <Modal
        open={modalEstado.open}
        type="info"
        title="¿Cambiar estado?"
        message={`El cliente "${modalEstado.nombre}" cambiará a estado "${modalEstado.nuevoEstado}".`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmChangeStatus}
        onCancel={() =>
          setModalEstado({
            open: false,
            id: null,
            nombre: "",
            nuevoEstado: "",
          })
        }
      />
    </CrudLayout>
  );
}
