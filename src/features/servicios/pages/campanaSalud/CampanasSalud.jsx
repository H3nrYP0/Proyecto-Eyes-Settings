import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import {
  getAllCampanasSalud,
  deleteCampanaSalud,
  updateEstadoCampanaSalud,
} from "../../../../lib/data/campanasSaludData";

export default function CampanasSalud() {
  const navigate = useNavigate();

  const [campanas, setCampanas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    empresa: "",
  });

  useEffect(() => {
    loadCampanas();
  }, []);

  const loadCampanas = async () => {
    try {
      setLoading(true);
      const data = await getAllCampanasSalud();
      
      const campanasTransformadas = data.map(campana => ({
        id: campana.id,
        empleado_id: campana.empleado_id,
        empleado_nombre: campana.empleado_nombre || "No asignado",
        empresa: campana.empresa,
        contacto: campana.contacto || "-",
        fecha: campana.fecha ? new Date(campana.fecha).toLocaleDateString() : "-",
        hora: campana.hora || "-",
        direccion: campana.direccion || "-",
        observaciones: campana.observaciones || "-",
        estado: campana.estado ? "activa" : "inactiva"
      }));
      
      setCampanas(campanasTransformadas);
    } catch (error) {
      console.error("Error cargando campañas:", error);
      setNotification({
        isVisible: true,
        message: 'No se pudieron cargar las campañas',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleDelete = (id, empresa) => {
    setModalDelete({ open: true, id, empresa });
  };

  const confirmDelete = async () => {
    try {
      await deleteCampanaSalud(modalDelete.id);
      await loadCampanas();
      setModalDelete({ open: false, id: null, empresa: "" });
      setNotification({
        isVisible: true,
        message: 'Campaña eliminada correctamente',
        type: 'success'
      });
    } catch (err) {
      console.error("Error al eliminar:", err);
      setNotification({
        isVisible: true,
        message: 'Error al eliminar la campaña',
        type: 'error'
      });
    }
  };

  const filteredCampanas = campanas.filter((campana) => {
    const matchesSearch = 
      campana.empresa.toLowerCase().includes(search.toLowerCase()) ||
      (campana.contacto && campana.contacto.toLowerCase().includes(search.toLowerCase())) ||
      (campana.observaciones && campana.observaciones.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFilter = !filterEstado || campana.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activa", label: "Activas" },
    { value: "inactiva", label: "Inactivas" }
  ];

  const columns = [
    { field: "empresa", header: "Empresa" },
    { field: "empleado_nombre", header: "Responsable" },
    { field: "fecha", header: "Fecha" },
    { field: "hora", header: "Hora" },
  ];

  const tableActions = [
    {
      label: "Ver Detalles",
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
      onClick: (item) => handleDelete(item.id, item.empresa),
    },
  ];

  if (loading) {
    return (
      <CrudLayout
        title="Campañas de Salud"
        showSearch={true}
        searchPlaceholder="Buscar por empresa, contacto..."
        searchPosition="left"
      >
        <div className="loading-container">Cargando campañas...</div>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Campañas de Salud"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por empresa, contacto..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchPosition="left"
    >
      <CrudTable 
        columns={columns} 
        data={filteredCampanas} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron campañas para los filtros aplicados' : 
            'No hay campañas registradas'
        }
      />

      {filteredCampanas.length === 0 && !search && !filterEstado && !loading && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primera Campaña
          </button>
        </div>
      )}

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Campaña?"
        message={`Esta acción eliminará la campaña "${modalDelete.empresa}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, empresa: "" })}
      />

      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </CrudLayout>
  );
}