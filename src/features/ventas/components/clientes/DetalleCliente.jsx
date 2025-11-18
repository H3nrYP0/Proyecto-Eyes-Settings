import { useNavigate, useLocation } from "react-router-dom";

export default function DetalleCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cliente } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  if (!cliente) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Cliente no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Detalle del Cliente</h1>
        <p>Información detallada del cliente</p>
      </div>
      
      <div className="form-container">
        <div className="form-group">
          <label>Nombre</label>
          <p>{cliente.nombre}</p>
        </div>
        
        <div className="form-group">
          <label>Apellido</label>
          <p>{cliente.apellido}</p>
        </div>
        
        <div className="form-group">
          <label>Documento</label>
          <p>{cliente.documento}</p>
        </div>
        
        <div className="form-group">
          <label>Teléfono</label>
          <p>{cliente.telefono}</p>
        </div>
        
        <div className="form-group">
          <label>Correo</label>
          <p>{cliente.correo}</p>
        </div>

        <div className="form-group">
          <label>Ciudad</label>
          <p>{cliente.ciudad}</p>
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <p>{cliente.fechaNacimiento}</p>
        </div>

        <div className="form-group">
          <label>Género</label>
          <p>{cliente.genero}</p>
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