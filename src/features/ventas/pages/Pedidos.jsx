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
  const [filterTipo, setFilterTipo] = useState(""); // Nuevo filtro por tipo

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

    // Aquí iría la lógica para registrar el abono
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
      pedido.cliente.toLowerCase().includes(search.toLowerCase()) ||
      pedido.productoServicio.toLowerCase().includes(search.toLowerCase());
    
    const matchesEstado = filterEstado ? pedido.estado === filterEstado : true;
    const matchesTipo = filterTipo ? pedido.tipo === filterTipo : true;
    
    return matchesSearch && matchesEstado && matchesTipo;
  });

  // FILTROS PARA PEDIDOS
  const searchFilters = [
    { value: '', label: 'Todos los estados' },
    { value: 'En proceso', label: 'En proceso' },
    { value: 'Pendiente pago', label: 'Pendiente pago' },
    { value: 'Pagado', label: 'Pagado' },
    { value: 'Entregado', label: 'Entregado' }
  ];

  // FILTROS PARA TIPO
  const tipoFilters = [
    { value: '', label: 'Todos los tipos' },
    { value: 'Venta', label: 'Ventas' },
    { value: 'Servicio', label: 'Servicios' }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // =============================
  //          COLUMNAS SIMPLIFICADAS
  // =============================
  const columns = [
    { field: "cliente", header: "Cliente" },
    { field: "productoServicio", header: "Producto/Servicio" },
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
      field: "tipo",
      header: "Tipo",
      render: (item) => (
        <span className={`badge-${item.tipo === "Venta" ? 'venta' : 'servicio'}`}>
          {item.tipo}
        </span>
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
      title="📦 Pedidos"
      description="Gestiona los pedidos especiales y órdenes de trabajo."
      onAddClick={() => navigate("crear")}
      showSearch={true}
      searchPlaceholder="Buscar por cliente, producto, estado..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchPosition="left"
      // Añadir filtro de tipo al layout
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
            onClick={() => navigate("nuevo")}
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
            <p>Saldo pendiente: <strong>{formatCurrency(modalAbono.saldoPendiente)}</strong></p>
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