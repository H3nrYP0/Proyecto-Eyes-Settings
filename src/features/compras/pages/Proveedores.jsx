import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";

// Backend
import {
  getAllProveedores,
  deleteProveedor,
  updateEstadoProveedor,
} from "../../../lib/data/proveedoresData";

export default function Proveedores() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    razonSocial: "",
  });

  // CARGA DE DATOS
  useEffect(() => {
    setProveedores(getAllProveedores());
  }, []);

  // ELIMINAR
  const handleDelete = (id, razonSocial) => {
    setModalDelete({ open: true, id, razonSocial });
  };

  const confirmDelete = () => {
    const updated = deleteProveedor(modalDelete.id);
    setProveedores([...updated]);
    setModalDelete({ open: false, id: null, razonSocial: "" });
  };

  // CAMBIAR ESTADO (lo usa CrudTable)
  const toggleEstado = (row) => {
    const updated = updateEstadoProveedor(row.id);
    setProveedores([...updated]);
  };

  // FILTROS
  const filteredProveedores = proveedores.filter((p) => {
    const matchesSearch =
      p.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      p.nit.toLowerCase().includes(search.toLowerCase()) ||
      p.ciudad.toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || p.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos" },
    { value: "Activo", label: "Activos" },
    { value: "Inactivo", label: "Inactivos" },
  ];

  // COLUMNAS (🚨 SIN ESTADO)
  const columns = [
    {
      field: "tipo",
      header: "Tipo",
      render: (item) => (
        <span className={item.tipo === "Persona Jurídica" ? "juridica" : "natural"}>
          {item.tipo}
        </span>
      ),
    },
    { field: "razonSocial", header: "Razón Social" },
    { field: "ciudad", header: "Ciudad" },
  ];

  // ACCIONES (CrudTable pinta el estado aquí)
  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: toggleEstado,
    },
    {
      label: "Ver",
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
      onClick: (row) => handleDelete(row.id, row.razonSocial),
    },
  ];

  return (
    <CrudLayout
      title="Proveedores"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar proveedor..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      <CrudTable
        columns={columns}
        data={filteredProveedores}
        actions={tableActions}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron proveedores"
            : "No hay proveedores registrados"
        }
      />

      {/* MODAL ELIMINAR */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Proveedor?"
        message={`Esta acción eliminará al proveedor "${modalDelete.razonSocial}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={() =>
          setModalDelete({ open: false, id: null, razonSocial: "" })
        }
      />
    </CrudLayout>
  );
}