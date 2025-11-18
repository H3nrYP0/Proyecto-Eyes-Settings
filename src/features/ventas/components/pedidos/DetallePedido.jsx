import { useNavigate, useLocation } from "react-router-dom";

export default function DetallePedido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pedido } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  if (!pedido) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Pedido no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Detalle del Pedido</h1>
        <p>Información detallada del pedido</p>
      </div>
      
      <div className="form-container">
        <div className="form-group">
          <label>Cliente</label>
          <p>{pedido.cliente}</p>
        </div>
        
        <div className="form-group">
          <label>Producto/Servicio</label>
          <p>{pedido.productoServicio}</p>
        </div>
        
        <div className="form-group">
          <label>Fecha Pedido</label>
          <p>{pedido.fechaPedido}</p>
        </div>
        
        <div className="form-group">
          <label>Fecha Entrega</label>
          <p>{pedido.fechaEntrega}</p>
        </div>

        <div className="form-group">
          <label>Total</label>
          <p>${pedido.total.toLocaleString()}</p>
        </div>

        <div className="form-group">
          <label>Estado</label>
          <p>
            <span className={`status status-${pedido.estado.toLowerCase().replace(' ', '-')}`}>
              {pedido.estado}
            </span>
          </p>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleBack} className="btn-secondary">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}