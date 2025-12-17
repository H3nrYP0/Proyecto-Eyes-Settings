import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById } from '../../../../lib/data/clientesData';
import { getFormulasByClienteId } from '../../../../lib/data/formulasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [latestFormula, setLatestFormula] = useState(null);

  useEffect(() => {
    const clienteData = getClienteById(Number(id));
    setCliente(clienteData);
    
    if (clienteData) {
      const formulas = getFormulasByClienteId(Number(id));
      if (formulas.length > 0) {
        setLatestFormula(formulas[0]);
      }
    }
  }, [id]);

  if (!cliente) {
    return (
      <div className="crud-form-container minimal">
        <div className="crud-form-content">
          <div className="loading-minimal">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  const formatFormula = (formula) => {
    if (!formula) return 'No hay fórmulas registradas';
    const formatOjo = (esf, cil, eje) => {
      if (!esf) return '-';
      let result = esf;
      if (cil && cil !== '0.00') result += ` ${cil}`;
      if (eje && eje !== '0') result += ` x ${eje}`;
      return result;
    };
    
    return `OD: ${formatOjo(formula.ojoDerechoEsferico, formula.ojoDerechoCilindrico, formula.ojoDerechoEje)} / OI: ${formatOjo(formula.ojoIzquierdoEsferico, formula.ojoIzquierdoCilindrico, formula.ojoIzquierdoEje)}`;
  };

  return (
    <div className="crud-form-container minimal">
      <div className="crud-form-header minimal">
        <h1>{cliente.nombre} {cliente.apellido}</h1>
      </div>
      
      <div className="crud-form-content compact">
        <div className="crud-form-section compact">
          {/* Información básica */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {cliente.tipoDocumento}: {cliente.documento}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cliente.telefono}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cliente.correo || 'No registrado'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cliente.ciudad}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {cliente.direccion || 'No registrada'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge gender ${cliente.genero.toLowerCase()}`}>
                {cliente.genero}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {new Date(cliente.fechaNacimiento).toLocaleDateString('es-ES')}
            </div>
          </div>

          {/* Última fórmula - full width */}
          <div className="crud-form-group full-width">
            <div className="crud-input-view formula-display">
              <div className="formula-text">
                {formatFormula(latestFormula)}
              </div>
              {latestFormula && (
                <div className="formula-type">
                  <span className="lente-badge">{latestFormula.tipoLente}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="crud-form-actions compact">
          <button 
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/ventas/clientes/${id}/editar`)}
            className="crud-btn crud-btn-primary"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}