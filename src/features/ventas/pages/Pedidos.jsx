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
  registrarAbono,
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
    total: 0,
    abonoActual: 0,
    saldoPendiente: 0,
  });

  const [montoAbono, setMontoAbono] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = () => {
    setPedidos(getAllPedidos());
  };

  const handleDelete = (id, cliente) => {
    setModalDelete({ open: true, id, cliente });
  };

  const confirmDelete = () => {
    const updated = deletePedido(modalDelete.id);
    setPedidos([...updated]);
    setModalDelete({ open: false, id: null, cliente: "" });
  };

  const handleAbonar = (id, cliente, total, abono, saldoPendiente) => {
    setModalAbono({ 
      open: true, 
      id, 
      cliente, 
      total,
      abonoActual: abono || 0,
      saldoPendiente: saldoPendiente || total 
    });
    setMontoAbono("");
  };

  const confirmAbono = () => {
    const monto = Number(montoAbono);
    if (monto <= 0) {
      alert("El monto del abono debe ser mayor a 0");
      return;
    }
    if (monto > modalAbono.saldoPendiente) {
      alert(`El abono no puede exceder el saldo pendiente de $${modalAbono.saldoPendiente.toLocaleString()}`);
      return;
    }

    const pedidoActualizado = registrarAbono(modalAbono.id, monto);
    if (pedidoActualizado) {
      cargarPedidos(); // Recargar la lista
      alert(`✅ Abono de $${monto.toLocaleString()} registrado correctamente para ${modalAbono.cliente}`);
    }
    
    setModalAbono({ open: false, id: null, cliente: "", total: 0, abonoActual: 0, saldoPendiente: 0 });
    setMontoAbono("");
  };

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

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "En proceso", label: "En proceso" },
    { value: "Pendiente", label: "Pendiente" },
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

  const formatCurrency = (amount) => `$${(amount || 0).toLocaleString()}`;

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

  // ✅ COLUMNAS - SIN SALDO PENDIENTE
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
      field: "total",
      header: "Total",
      render: (row) => formatCurrency(row.total),
    },
    {
      field: "abono",
      header: "Abonar",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className="crud-btn crud-btn-primary"
            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
            onClick={(e) => {
              e.stopPropagation();
              handleAbonar(row.id, row.cliente, row.total, row.abono, row.saldoPendiente);
            }}
            disabled={row.saldoPendiente <= 0}
          >
            Abonar
          </button>
        </div>
      ),
    },
  ];

  const tableActions = [
    {
      label: "Ver Detalles",
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
      onClick: (row) => handleDelete(row.id, row.cliente),
    },
  ];

  return (
    <>
      <style>
        {`
          tr.row-entregado td {
            background-color: #e5e5e5 !important;
            color: #888 !important;
            opacity: 0.7;
          }
          .crud-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
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

        <Modal
          open={modalAbono.open}
          type="info"
          title="Registrar Abono"
          message={
            <div>
              <p><strong>Cliente:</strong> {modalAbono.cliente}</p>
              <p><strong>Total del pedido:</strong> {formatCurrency(modalAbono.total)}</p>
              <p><strong>Abonado hasta ahora:</strong> {formatCurrency(modalAbono.abonoActual)}</p>
              <p><strong>Saldo pendiente:</strong> {formatCurrency(modalAbono.saldoPendiente)}</p>
              <div style={{ marginTop: "15px" }}>
                <label htmlFor="montoAbono">Monto a abonar:</label>
                <input
                  id="montoAbono"
                  type="number"
                  min="1"
                  max={modalAbono.saldoPendiente}
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                  }}
                  placeholder="Ingrese el monto"
                  autoFocus
                />
              </div>
            </div>
          }
          confirmText="Registrar Abono"
          cancelText="Cancelar"
          showCancel
          onConfirm={confirmAbono}
          onCancel={() =>
            setModalAbono({ open: false, id: null, cliente: "", total: 0, abonoActual: 0, saldoPendiente: 0 })
          }
        />
      </CrudLayout>
    </>
  );
}