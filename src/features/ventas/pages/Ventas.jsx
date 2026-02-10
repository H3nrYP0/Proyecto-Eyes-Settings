import CrudLayout from "../../../shared/components/crud/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Ventas() {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
      setVentas(JSON.parse(ventasGuardadas));
    }
  }, []);

  const handleAddVenta = () => {
    navigate("nueva");
  };

  const handleViewDetail = (id) => {
    navigate(`detalle/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`editar/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta venta?")) {
      const nuevasVentas = ventas.filter(venta => venta.id !== id);
      setVentas(nuevasVentas);
      localStorage.setItem('ventas', JSON.stringify(nuevasVentas));
    }
  };

  const filteredVentas = ventas.filter(venta =>
    venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.metodoPago.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CrudLayout
      title="Ventas"
      description="Gestiona las ventas de productos y servicios de la óptica."
      onAddClick={handleAddVenta}
    >
      {/* BARRA DE BÚSQUEDA */}
      <div className="crud-controls">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar ventas..."
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
              <th>Fecha</th>
              <th>Método Pago</th>
              <th>Total</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVentas.map(venta => (
              <tr key={venta.id}>
                <td>{venta.cliente}</td>
                <td>{venta.fecha}</td>
                <td>
                  <span className={`badge badge-${venta.metodoPago}`}>
                    {venta.metodoPago}
                  </span>
                </td>
                <td className="total-cell">${venta.total.toLocaleString()}</td>
                <td>{venta.empleado}</td>
                <td>
                  <span className={`status status-${venta.estado}`}>
                    {venta.estado === 'completada' ? 'Completada' : 
                     venta.estado === 'pendiente' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => handleViewDetail(venta.id)}
                  >
                    Ver Detalles
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(venta.id)}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(venta.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredVentas.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  {ventas.length === 0 ? 'No hay ventas registradas' : 'No se encontraron ventas'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}