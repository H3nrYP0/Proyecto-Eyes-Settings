import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../shared/components/ui/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Importamos las funciones del backend
import {
  getAllPedidos,
  deletePedido,
  marcarComoEntregado,
} from "../../../lib/data/pedidosData";

export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterTipo, setFilterTipo] = useState("");

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    cliente: "",
  });

  const [modalAbono, setModalAbono] = useState({
    open: false,
    id: null,
    cliente: "",
    saldoPendiente: 0,
  });

  const [montoAbono, setMontoAbono] = useState("");

  // Cargar datos
  useEffect(() => {
    const pedidosData = getAllPedidos();
    setPedidos(pedidosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, cliente) => {
    setModalDelete({
      open: true,
      id,
      cliente,
    });
  };

  const confirmDelete = () => {
    const updated = deletePedido(modalDelete.id);
    setPedidos([...updated]);
    setModalDelete({ open: false, id: null, cliente: "" });
  };

  // =============================
  //    MODAL DE ABONO
  // =============================
  const handleAbonar = (id, cliente, saldoPendiente) => {
    setModalAbono({
      open: true,
      id,
      cliente,
      saldoPendiente,
    });
    setMontoAbono("");
  };

  const confirmAbono = () => {
    const monto = Number(montoAbono);
    if (monto <= 0 || monto > modalAbono.saldoPendiente) {
      alert("El monto del abono debe ser mayor a 0 y no puede exceder el saldo pendiente");
      return;
    }

    alert(`Abono de $${monto.toLocaleString()} registrado para ${modalAbono.cliente}`);
    
    setModalAbono({ open: false, id: null, cliente: "", saldoPendiente: 0 });
    setMontoAbono("");
  };

  // =============================
  //    MARCAR COMO ENTREGADO
  // =============================
  const handleEntregar = (id, cliente) => {
    if (window.confirm(`¿Marcar como entregado el pedido de ${cliente}?`)) {
      const updated = marcarComoEntregado(id);
      setPedidos([...updated]);
    }
  };

  // =============================
  //          FILTRADO
  // =============================
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = 
      pedido.cliente.toLowerCase().includes(search.toLowerCase());
    
    const matchesEstado = filterEstado ? pedido.estado === filterEstado : true;
    
    // Filtro especial para "Ventas" - mostrar solo pedidos entregados
    let matchesTipo = true;
    if (filterTipo === 'Ventas') {
      matchesTipo = pedido.estado === 'Entregado';
    } else if (filterTipo) {
      // Para filtros de tipo específico
      matchesTipo = pedido.tipo?.includes(filterTipo) || false;
    }
    
    return matchesSearch && matchesEstado && matchesTipo;
  });

  // Función para obtener la descripción del tipo de items
  const obtenerDescripcionItems = (pedido) => {
    if (pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0) {
      const tieneProductos = pedido.items.some(item => item.tipo === 'producto');
      const tieneServicios = pedido.items.some(item => item.tipo === 'servicio');
      
      if (tieneProductos && tieneServicios) {
        return 'Productos y Servicios';
      } else if (tieneProductos) {
        return 'Productos';
      } else {
        return 'Servicios';
      }
    }
    return pedido.tipo || 'Productos';
  };

  // Función para obtener la cantidad de items
  const obtenerCantidadItems = (pedido) => {
    if (pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0) {
      return pedido.items.reduce((sum, item) => sum + item.cantidad, 0);
    }
    return 1;
  };

  // FILTROS PARA ESTADO
  const estadoFilters = [
    { value: '', label: 'Todos los estados' },
    { value: 'En proceso', label: 'En proceso' },
    { value: 'Pendiente pago', label: 'Pendiente pago' },
    { value: 'Pagado', label: 'Pagado' },
    { value: 'Entregado', label: 'Entregado' }
  ];

  // FILTROS PARA TIPO/VENTAS
  const tipoFilters = [
    { value: '', label: 'Todos los pedidos' },
    { value: 'Ventas', label: 'Ventas (Entregados)' },
    { value: 'Productos', label: 'Solo Productos' },
    { value: 'Servicios', label: 'Solo Servicios' },
    { value: 'Productos y Servicios', label: 'Productos y Servicios' }
  ];

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { 
      field: "cliente", 
      header: "Cliente"
    },
    {
      field: "productoServicio",
      header: "Producto/Servicio",
      render: (item) => {
        const cantidad = obtenerCantidadItems(item);
        const descripcion = obtenerDescripcionItems(item);
        return (
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>
              {cantidad} {cantidad === 1 ? 'ítem' : 'ítems'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
              {descripcion}
            </div>
          </div>
        );
      },
    },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <span className={`estado-pedido estado-${item.estado.toLowerCase().replace(' ', '-')}`}>
          {item.estado}
        </span>
      ),
    },
    {
      field: "total",
      header: "Total",
      render: (item) => (
        <div style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
          ${item.total.toLocaleString()}
        </div>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`detalle/${item.id}`),
    },
    {
      label: "Abonar",
      type: "primary",
      onClick: (item) => handleAbonar(item.id, item.cliente, item.saldoPendiente),
      disabled: (item) => item.saldoPendiente <= 0
    },
    {
      label: "Entregar",
      type: "success",
      onClick: (item) => handleEntregar(item.id, item.cliente),
      disabled: (item) => item.estado === "Entregado"
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`editar/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.cliente),
    },
  ];

  return (
    <CrudLayout
      title="Pedidos"
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por cliente..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchPosition="left"
      // Añadir filtro de tipo/ventas al layout
      additionalFilters={
        <div className="filter-group" style={{ marginLeft: '1rem' }}>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tipoFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredPedidos} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado || filterTipo ? 
            'No se encontraron pedidos para los filtros aplicados' : 
            'No hay pedidos registrados'
        }
      />

      {/* Botón para primer pedido */}
      {filteredPedidos.length === 0 && !search && !filterEstado && !filterTipo && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Crear Primer Pedido
          </button>
        </div>
      )}

      {/* Modal de Confirmación Eliminación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Pedido?"
        message={`Esta acción eliminará el pedido de "${modalDelete.cliente}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, cliente: "" })}
      />

      {/* Modal de Abono */}
      <Modal
        open={modalAbono.open}
        type="info"
        title="Registrar Abono"
        message={
          <div>
            <p>Cliente: <strong>{modalAbono.cliente}</strong></p>
            <p>Saldo pendiente: <strong>${(modalAbono.saldoPendiente || 0).toLocaleString()}</strong></p>
            <div style={{ marginTop: '1rem' }}>
              <label htmlFor="montoAbono" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Monto del abono:
              </label>
              <input
                id="montoAbono"
                type="number"
                value={montoAbono}
                onChange={(e) => setMontoAbono(e.target.value)}
                placeholder="Ingrese el monto"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                min="0"
                max={modalAbono.saldoPendiente}
              />
            </div>
          </div>
        }
        confirmText="Registrar Abono"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmAbono}
        onCancel={() => setModalAbono({ open: false, id: null, cliente: "", saldoPendiente: 0 })}
      />
    </CrudLayout>
  );
}