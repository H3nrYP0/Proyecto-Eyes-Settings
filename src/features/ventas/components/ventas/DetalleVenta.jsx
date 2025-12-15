import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DetalleVenta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venta, setVenta] = useState(null);

  // Cargar datos de la venta al iniciar
  useEffect(() => {
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    const ventaEncontrada = ventas.find(v => v.id === id);
    setVenta(ventaEncontrada);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!venta) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Venta no encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Detalle de Venta {id}</h1>
      </div>
      
      <div className="form-container">
        <div className="form-group">
          <label>Cliente</label>
          <p>{venta.cliente}</p>
        </div>
        
        <div className="form-group">
          <label>Productos</label>
          <p>{venta.productos}</p>
        </div>
        
        <div className="form-group">
          <label>Fecha</label>
          <p>{venta.fecha}</p>
        </div>
        
        <div className="form-group">
          <label>Método de Pago</label>
          <p>{venta.metodoPago}</p>
        </div>
        
        <div className="form-group">
          <label>Total</label>
          <p>${venta.total.toLocaleString()}</p>
        </div>
        
        <div className="form-group">
          <label>Estado</label>
          <p>{venta.estado}</p>
        </div>
        
        <div className="form-group">
          <label>Empleado</label>
          <p>{venta.empleado}</p>
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