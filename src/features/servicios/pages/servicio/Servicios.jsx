// src/features/servicios/pages/Servicios.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout"
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import { getAllServicios, deleteServicio, updateEstadoServicio } from "../../../../lib/data/serviciosData";

// Formateador de moneda
const formatCOP = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  }).format(value);
};

export default function Servicios() {
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      setLoading(true);
      const data = await getAllServicios();
      const serviciosTransformados = data.map(servicio => ({
        id: servicio.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        duracion: servicio.duracion_min,
        precio: servicio.precio,
        estado: servicio.estado 
      }));
      setServicios(serviciosTransformados);
      setError(null);
    } catch (error) {
      console.error("Error cargando servicios:", error);
      setError("No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = async () => {
    try {
      await deleteServicio(modalDelete.id);
      await loadServicios();
      setModalDelete({ open: false, id: null, nombre: "" });
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el servicio");
    }
  };

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  const cambiarEstado = async (row, newStatus) => {
    try {
      const nuevoEstadoUI = newStatus = newStatus ;
      
      setServicios(prev => prev.map(s => 
        s.id === row.id ? { ...s, estado: nuevoEstadoUI } : s
      ));

      await updateEstadoServicio(row.id, nuevoEstadoUI);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      loadServicios();
    }
  };

  const filteredServicios = servicios.filter((s) => {
    const matchesSearch =
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (s.descripcion && s.descripcion.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado = !filterEstado || s.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
    { 
      field: "duracion", 
      header: "Duración",
      render: (item) => `${item.duracion} min`
    },
    { 
      field: "precio", 
      header: "Precio",
      render: (item) => formatCOP(item.precio)
    }
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => cambiarEstado(item),
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
      onClick: (row) => handleDelete(row.id, row.nombre),
    },
  ];

  if (loading) {
    return (
      <CrudLayout
        title="Servicios"
        showSearch={true}
        searchPlaceholder="Buscar por nombre o descripción..."
        searchPosition="left"
      >
        <div className="loading-container">Cargando servicios...</div>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Servicios"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre o descripción..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      {error && (
        <div className="unified-no-data" style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          marginBottom: '16px'
        }}>
          ⚠️ {error}
        </div>
      )}

      <CrudTable
        columns={columns}
        data={filteredServicios}
        actions={tableActions}
        onChangeStatus={cambiarEstado}
        emptyMessage={
          search || filterEstado
            ? "No se encontraron servicios para los filtros aplicados"
            : "No hay servicios registrados"
        }
      />

      {filteredServicios.length === 0 && !search && !filterEstado && !loading && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            Crear Primer Servicio
          </button>
        </div>
      )}

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Servicio?"
        message={`Esta acción eliminará el servicio "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />
    </CrudLayout>
  );
}