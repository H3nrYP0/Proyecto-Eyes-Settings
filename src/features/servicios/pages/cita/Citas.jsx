import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

// Backend (API real)
import {
  getAllCitas,
  deleteCita,
} from "../../../../lib/data/citasData";
import { getAllEstadosCita } from "../../../../lib/data/estadosCitaData";

export default function Citas() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    descripcion: "",
  });

  // ============================
  // CARGA DE DATOS (API)
  // ============================
  const cargarCitas = async () => {
    try {
      const data = await getAllCitas();
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando citas:", error);
      setCitas([]);
    }
  };

  const cargarEstadosCita = async () => {
    try {
      const data = await getAllEstadosCita();
      setEstadosCita(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando estados de cita:", error);
      setEstadosCita([]);
    }
  };

  useEffect(() => {
    cargarCitas();
    cargarEstadosCita();
  }, []);

  // ============================
  // ELIMINAR
  // ============================
  const handleDelete = (id, descripcion) => {
    const cita = citas.find(c => c.id === id);
    const desc = cita ? 
      `${cita.cliente_nombre || 'Cliente'} - ${cita.servicio_nombre || 'Servicio'}` : 
      'cita';
    setModalDelete({ open: true, id, descripcion: desc });
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
      (cita.cliente_nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (cita.servicio_nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (cita.empleado_nombre?.toLowerCase() || "").includes(search.toLowerCase());

    const matchesEstado = !filterEstado || cita.estado_cita_id === parseInt(filterEstado);

    return matchesSearch && matchesEstado;
  });

  // Filtros desde la API
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    ...estadosCita.map(estado => ({ 
      value: estado.id.toString(), 
      label: estado.nombre 
    }))
  ];

  // ============================
  // COLUMNAS
  // ============================
  const columns = [
    { 
      field: "cliente_nombre", 
      header: "Cliente",
      render: (row) => row.cliente_nombre || 'N/A'
    },
    { 
      field: "servicio_nombre", 
      header: "Servicio",
      render: (row) => row.servicio_nombre || 'N/A'
    },
    { 
      field: "fecha", 
      header: "Fecha",
      render: (row) => {
        if (!row.fecha) return 'N/A';
        const fecha = new Date(row.fecha);
        return fecha.toLocaleDateString('es-ES');
      }
    },
    { 
      field: "hora", 
      header: "Hora",
      render: (row) => row.hora ? row.hora.substring(0, 5) : 'N/A'
    },
    { 
      field: "estado_nombre", 
      header: "Estado",
      render: (row) => {
        // Determinar clase CSS basada en el estado
        let badgeClass = "badge";
        const estadoNombre = (row.estado_nombre || '').toLowerCase();
        
        if (estadoNombre.includes('pendiente')) {
          badgeClass += " badge-warning";
        } else if (estadoNombre.includes('confirmada') || estadoNombre.includes('activa')) {
          badgeClass += " badge-success";
        } else if (estadoNombre.includes('cancelada')) {
          badgeClass += " badge-danger";
        } else if (estadoNombre.includes('completada')) {
          badgeClass += " badge-info";
        } else {
          badgeClass += " badge-secondary";
        }
        
        return (
          <span className={badgeClass}>
            {row.estado_nombre || 'Pendiente'}
          </span>
        );
      }
    },
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
      onClick: (item) => handleDelete(item.id, item.cliente_nombre),
    },
  ];

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
      <CrudTable
        columns={columns}
        data={filteredCitas}
        actions={tableActions}
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
        onCancel={() => setModalDelete({ open: false, id: null, descripcion: "" })}
      />
    </CrudLayout>
  );
}