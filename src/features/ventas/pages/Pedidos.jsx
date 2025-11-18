import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const pedidosGuardados = localStorage.getItem('pedidos');
    if (pedidosGuardados) {
      setPedidos(JSON.parse(pedidosGuardados));
    }
  }, []);

  const handleAddPedido = () => {
    navigate("nuevo");
  };

  const handleViewDetail = (pedido) => {
    navigate("detalle", { state: { pedido } });
  };

  const handleEdit = (pedido) => {
    navigate("editar", { state: { pedido } });
  };

  const handleDelete = (pedido) => {
    if (window.confirm(`¿Estás seguro de eliminar el pedido de ${pedido.cliente}?`)) {
      const nuevosPedidos = pedidos.filter(p => 
        p.cliente !== pedido.cliente ||
        p.productoServicio !== pedido.productoServicio ||
        p.fechaPedido !== pedido.fechaPedido
      );
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidos', JSON.stringify(nuevosPedidos));
    }
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.productoServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CrudLayout
      title="Pedidos"
      description="Gestiona los pedidos especiales y órdenes de trabajo."
      onAddClick={handleAddPedido}
    >
      <div className="crud-controls">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Producto/Servicio</th>
              <th>Fecha Pedido</th>
              <th>Fecha Entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.map((pedido, index) => (
              <tr key={index}>
                <td>{pedido.cliente}</td>
                <td>{pedido.productoServicio}</td>
                <td>{pedido.fechaPedido}</td>
                <td>{pedido.fechaEntrega}</td>
                <td>${pedido.total.toLocaleString()}</td>
                <td>
                  <span className={`status status-${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetail(pedido)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(pedido)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(pedido)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredPedidos.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  {pedidos.length === 0 ? 'No hay pedidos registrados' : 'No se encontraron pedidos'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}