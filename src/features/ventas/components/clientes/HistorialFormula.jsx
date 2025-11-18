import { useNavigate, useLocation } from "react-router-dom";

export default function HistorialFormula() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cliente } = location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  const handleNuevaFormula = () => {
    alert("Funcionalidad para agregar nueva fórmula - Pendiente de implementar");
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

  // Datos de ejemplo para el historial de fórmulas
  const historialFormulas = [
    {
      fecha: "2024-01-15",
      ojoDerecho: "-2.50 -0.75 x 180",
      ojoIzquierdo: "-2.25 -0.50 x 175", 
      tipoLente: "Progresivo",
      observaciones: "Primera fórmula - Adaptación completa"
    },
    {
      fecha: "2023-06-10", 
      ojoDerecho: "-2.25 -0.50 x 180",
      ojoIzquierdo: "-2.00 -0.25 x 175",
      tipoLente: "Monofocal",
      observaciones: "Control rutinario - Estable"
    },
    {
      fecha: "2022-12-05",
      ojoDerecho: "-2.00 -0.25 x 180", 
      ojoIzquierdo: "-1.75 -0.25 x 175",
      tipoLente: "Monofocal",
      observaciones: "Primera consulta - Inicio de corrección"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Historial de Fórmulas</h1>
        <p>Fórmulas oftalmológicas de {cliente.nombre} {cliente.apellido}</p>
      </div>
      
      <div className="form-container">
        {/* Información del cliente */}
        <div className="summary-info">
          <div className="summary-item">
            <label>Cliente</label>
            <p>{cliente.nombre} {cliente.apellido}</p>
          </div>
          <div className="summary-item">
            <label>Documento</label>
            <p>{cliente.documento}</p>
          </div>
          <div className="summary-item">
            <label>Fecha Nacimiento</label>
            <p>{cliente.fechaNacimiento}</p>
          </div>
        </div>

        {/* Lista de fórmulas */}
        <div className="historial-list">
          <h3>Fórmulas Registradas</h3>
          
          {historialFormulas.map((formula, index) => (
            <div key={index} className="historial-item">
              <div className="historial-header">
                <span>Fecha: {formula.fecha}</span>
                <span className={`status status-${index === 0 ? 'completada' : 'completada'}`}>
                  {index === 0 ? 'Actual' : 'Histórico'}
                </span>
              </div>
              
              <div className="historial-details">
                <div>
                  <label>Ojo Derecho (OD)</label>
                  <p>{formula.ojoDerecho}</p>
                </div>
                <div>
                  <label>Ojo Izquierdo (OI)</label>
                  <p>{formula.ojoIzquierdo}</p>
                </div>
                <div>
                  <label>Tipo de Lente</label>
                  <p>{formula.tipoLente}</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Observaciones</label>
                <p>{formula.observaciones}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button type="button" onClick={handleBack} className="btn-secondary">
            Volver
          </button>
          <button type="button" onClick={handleNuevaFormula} className="btn-primary">
            Agregar Nueva Fórmula
          </button>
        </div>
      </div>
    </div>
  );
}