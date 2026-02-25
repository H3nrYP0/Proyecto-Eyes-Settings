import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import { ProveedoresData } from "../../../lib/data/proveedoresData";

export default function Proveedores() {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    razonSocial: "",
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  async function fetchProveedores() {
    try {
      setLoading(true);
      const data = await ProveedoresData.getAllProveedores();
      setProveedores(data.map((p) => ({
        ...p,
        estadosDisponibles: ["Activo", "Inactivo"],
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (id, razonSocial) => {
    setModalDelete({ open: true, id, razonSocial });
  };

  const confirmDelete = async () => {
    try {
      await ProveedoresData.deleteProveedor(modalDelete.id);
      setProveedores((prev) => prev.filter((p) => p.id !== modalDelete.id));
    } catch (error) {
      console.error(error);
    } finally {
      setModalDelete({ open: false, id: null, razonSocial: "" });
    }
  };

  const handleChangeStatus = async (row, nuevoEstado) => {
    try {
      const nuevoEstadoBool = nuevoEstado === "Activo";
      const response = await ProveedoresData.toggleEstadoProveedor(row.id, !nuevoEstadoBool);
      setProveedores((prev) =>
        prev.map((p) =>
          p.id === response.id
            ? { ...response, estadosDisponibles: ["Activo", "Inactivo"] }
            : p
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProveedores = proveedores.filter((p) => {
    const matchesSearch =
      (p.razonSocial || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.documento   || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.correo      || "").toLowerCase().includes(search.toLowerCase());

    const matchesEstado = !filterEstado || p.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "",         label: "Todos"     },
    { value: "Activo",   label: "Activos"   },
    { value: "Inactivo", label: "Inactivos" },
  ];

  const columns = [
    {
      field: "tipoProveedor",
      header: "Tipo",
      // Solo visible en md en adelante
      headerSx: { display: { xs: "none", md: "table-cell" } },
      cellSx:   { display: { xs: "none", md: "table-cell" } },
      render: (item) => (
        <span className={item.tipoProveedor === "Persona Jurídica" ? "juridica" : "natural"}>
          {item.tipoProveedor}
        </span>
      ),
    },
    {
      field: "razonSocial",
      header: "Razón Social",
      // Siempre visible
      headerSx: {},
      cellSx:   {},
    },
    {
      field: "documento",
      header: "Documento",
      // Solo visible en sm en adelante
      headerSx: { display: { xs: "none", sm: "table-cell" } },
      cellSx:   { display: { xs: "none", sm: "table-cell" } },
    },
    {
      field: "telefono",
      header: "Teléfono",
      // Solo visible en md en adelante
      headerSx: { display: { xs: "none", md: "table-cell" } },
      cellSx:   { display: { xs: "none", md: "table-cell" } },
    },
  ];

  const tableActions = [
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

  if (loading) return <div>Cargando proveedores...</div>;

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
        onChangeStatus={handleChangeStatus}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron proveedores"
            : "No hay proveedores registrados"
        }
      />

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