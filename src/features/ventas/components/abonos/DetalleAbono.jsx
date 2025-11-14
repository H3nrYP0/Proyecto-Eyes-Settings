import { useNavigate, useLocation } from "react-router-dom";

export default function DetalleAbono() {
  const navigate = useNavigate();
  const location = useLocation();
  const { abono } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  if (!abono) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Abono no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Detalle del Abono</h1>
        <p>Información detallada del abono</p>
      </div>
      
      <div className="form-container">
        <div className="form-group">
          <label>Cliente</label>
          <p>{abono.cliente}</p>
        </div>
        
        <div className="form-group">
          <label>Fecha Abono</label>
          <p>{abono.fechaAbono}</p>
        </div>
        
        <div className="form-group">
          <label>Monto Abonado</label>
          <p>${abono.montoAbonado.toLocaleString()}</p>
        </div>
        
        <div className="form-group">
          <label>Saldo Pendiente</label>
          <p>${abono.saldoPendiente.toLocaleString()}</p>
        </div>

        <div className="form-group">
          <label>Método de Pago</label>
          <p>
            <span className={`badge badge-${abono.metodoPago}`}>
              {abono.metodoPago}
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