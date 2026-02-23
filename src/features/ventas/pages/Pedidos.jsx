import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../shared/components/crud/CrudTable";
import Modal from "../../../shared/components/ui/Modal";
import "../../../shared/styles/components/crud-table.css";
import "../../../shared/styles/components/modal.css";

// Backend
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

  // =============================
  //        CARGA DE DATOS
  // =============================
  useEffect(() => {
    setPedidos(getAllPedidos());
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, cliente) => {
    setModalDelete({ open: true, id, cliente });
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
    setModalAbono({ open: true, id, cliente, saldoPendiente });
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
  //          BUSCADOR
  // =============================
  const filteredPedidos = pedidos.filter((pedido) => {
    const cliente = (pedido.cliente || "").toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch = cliente.includes(searchTerm);

    const matchesEstado = !filterEstado || pedido.estado === filterEstado;

    let matchesTipo = true;
    if (filterTipo === "Ventas") {
      matchesTipo = pedido.estado === "Entregado";
    } else if (filterTipo) {
      matchesTipo = pedido.tipo?.includes(filterTipo) || false;
    }

    return matchesSearch && matchesEstado && matchesTipo;
  });

  // =============================
  //          FILTROS
  // =============================
  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "En proceso", label: "En proceso" },
    { value: "Pendiente pago", label: "Pendiente pago" },
    { value: "Pagado", label: "Pagado" },
    { value: "Entregado", label: "Entregado" },
  ];

  const tipoFilters = [
    { value: "", label: "Todos los pedidos" },
    { value: "Ventas", label: "Ventas (Entregados)" },
    { value: "Productos", label: "Solo Productos" },
    { value: "Servicios", label: "Solo Servicios" },
    { value: "Productos y Servicios", label: "Productos y Servicios" },
  ];

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  const obtenerDescripcionItems = (pedido) => {
    if (pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0) {
      const tieneProductos = pedido.items.some((item) => item.tipo === "producto");
      const tieneServicios = pedido.items.some((item) => item.tipo === "servicio");
      if (tieneProductos && tieneServicios) return "Productos y Servicios";
      else if (tieneProductos) return "Productos";
      else return "Servicios";
    }
    return pedido.tipo || "Productos";
  };

  const obtenerCantidadItems = (pedido) => {
    if (pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0) {
      return pedido.items.reduce((sum, item) => sum + item.cantidad, 0);
    }
    return 1;
  };

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    {
      field: "cliente",
      header: "Cliente",
      render: (row) => row.cliente,
    },
    {
      field: "productoServicio",
      header: "Producto/Servicio",
      render: (row) => {
        const cantidad = obtenerCantidadItems(row);
        const descripcion = obtenerDescripcionItems(row);
        return `${cantidad} ${cantidad === 1 ? "ítem" : "ítems"} — ${descripcion}`;
      },
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => row.estado,
    },
    {
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
      disabled: (row) => row.estado === "Entregado",
    },
    {
      label: "Abonar",
      type: "primary",
      onClick: (row) => handleAbonar(row.id, row.cliente, row.saldoPendiente),
      disabled: (row) => row.saldoPendiente <= 0,
    },
    {
      label: "Entregar",
      type: "success",
      onClick: (row) => handleEntregar(row.id, row.cliente),
      disabled: (row) => row.estado === "Entregado",
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => handleDelete(row.id, row.cliente),
    },
  ];

  return (
    <>
      {/* ✅ ESTILO QUE SÍ SE APLICA EN CRUDTABLE */}
      <style>
        {`
          tr.row-entregado td {
            background-color: #e5e5e5 !important;
            color: #888 !important;
            opacity: 0.7;
          }
        `}
      </style>

      <CrudLayout
        title="Pedidos"
        onAddClick={() => navigate("crear")}
        showSearch
        searchPlaceholder="Buscar por cliente..."
        searchValue={search}
        onSearchChange={setSearch}
        searchFilters={estadoFilters}
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
        searchPosition="left"
        additionalFilters={
          <div className="filter-group" style={{ marginLeft: "1rem" }}>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--border-radius-md)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              {tipoFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <CrudTable
          columns={columns}
          data={filteredPedidos}
          actions={tableActions}
          rowClassName={(row) =>
            row.estado === "Entregado" ? "row-entregado" : ""
          }
          emptyMessage={
            search || filterEstado || filterTipo
              ? "No se encontraron pedidos para los filtros aplicados"
              : "No hay pedidos registrados"
          }
        />

        {/* BOTÓN PRIMER PEDIDO */}
        {filteredPedidos.length === 0 && !search && !filterEstado && !filterTipo && (
          <div style={{ textAlign: "center", marginTop: "var(--spacing-lg)" }}>
            <button
              onClick={() => navigate("crear")}
              className="btn-primary"
            >
              Crear Primer Pedido
            </button>
          </div>
        )}

        {/* MODAL ELIMINAR */}
        <Modal
          open={modalDelete.open}
          type="warning"
          title="¿Eliminar Pedido?"
          message={`Esta acción eliminará el pedido de "${modalDelete.cliente}" y no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmDelete}
          onCancel={() =>
            setModalDelete({ open: false, id: null, cliente: "" })
          }
        />

        {/* MODAL ABONO */}
        <Modal
          open={modalAbono.open}
          type="info"
          title="Registrar Abono"
          message={
            <div>
              <p>Cliente: <strong>{modalAbono.cliente}</strong></p>
              <p>Saldo pendiente: <strong>${(modalAbono.saldoPendiente || 0).toLocaleString()}</strong></p>
              <div style={{ marginTop: "1rem" }}>
                <label htmlFor="montoAbono" style={{ display: "block", marginBottom: "0.5rem" }}>
                  Monto del abono:
                </label>
                <input
                  id="montoAbono"
                  type="number"
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  placeholder="Ingrese el monto"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                  min="0"
                  max={modalAbono.saldoPendiente}
                />
              </div>
            </div>
          }
          confirmText="Registrar Abono"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmAbono}
          onCancel={() =>
            setModalAbono({ open: false, id: null, cliente: "", saldoPendiente: 0 })
          }
        />
      </CrudLayout>
    </>
  );
}