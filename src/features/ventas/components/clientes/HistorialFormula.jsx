import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteById } from '../../../../lib/data/clientesData';
import { getFormulasByClienteId, createFormula } from '../../../../lib/data/formulasData';
import "../../../../shared/styles/components/crud-forms.css";

export default function HistorialFormula() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newFormula, setNewFormula] = useState({
    ojoDerechoEsferico: '',
    ojoDerechoCilindrico: '',
    ojoDerechoEje: '',
    ojoIzquierdoEsferico: '',
    ojoIzquierdoCilindrico: '',
    ojoIzquierdoEje: '',
    tipoLente: 'monofocal',
    observaciones: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const clienteData = getClienteById(Number(id));
    if (clienteData) {
      setCliente(clienteData);
      const formulasData = getFormulasByClienteId(Number(id));
      setFormulas(formulasData);
    } else {
      navigate('/admin/ventas/clientes');
    }
  }, [id, navigate]);

  const formatFormula = (formula) => {
    const formatOjo = (esf, cil, eje) => {
      if (!esf) return '-';
      let result = esf;
      if (cil && cil !== '0.00') result += ` ${cil}`;
      if (eje && eje !== '0') result += ` x ${eje}`;
      return result;
    };

    return {
      derecho: formatOjo(formula.ojoDerechoEsferico, formula.ojoDerechoCilindrico, formula.ojoDerechoEje),
      izquierdo: formatOjo(formula.ojoIzquierdoEsferico, formula.ojoIzquierdoCilindrico, formula.ojoIzquierdoEje)
    };
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    const formulaData = {
      ...newFormula,
      clienteId: Number(id),
      fecha: new Date().toISOString()
    };
    
    createFormula(formulaData);
    const updatedFormulas = getFormulasByClienteId(Number(id));
    setFormulas(updatedFormulas);
    setShowForm(false);
    setNewFormula({
      ojoDerechoEsferico: '',
      ojoDerechoCilindrico: '',
      ojoDerechoEje: '',
      ojoIzquierdoEsferico: '',
      ojoIzquierdoCilindrico: '',
      ojoIzquierdoEje: '',
      tipoLente: 'monofocal',
      observaciones: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (e) => {
    setNewFormula({
      ...newFormula,
      [e.target.name]: e.target.value
    });
  };

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

  return (
    <div className="crud-form-container minimal">
      <div className="crud-form-header minimal">
        <h1>Fórmulas: {cliente.nombre} {cliente.apellido}</h1>
      </div>
      
      <div className="crud-form-content compact">
        {/* BOTÓN PARA NUEVA FÓRMULA */}
        <div className="formula-actions-header">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="crud-btn crud-btn-primary"
          >
            {showForm ? 'Cancelar' : '+ Nueva Fórmula'}
          </button>
        </div>

        {/* FORMULARIO PARA CREAR NUEVA FÓRMULA */}
        {showForm && (
          <div className="formula-create-form">
            <h3>Nueva Fórmula</h3>
            <form onSubmit={handleCreateFormula}>
              <div className="formula-inputs-grid">
                {/* Ojo Derecho */}
                <div className="formula-eye-section">
                  <h4>Ojo Derecho</h4>
                  <div className="formula-input-row">
                    <input
                      type="text"
                      name="ojoDerechoEsferico"
                      placeholder="Esférico"
                      value={newFormula.ojoDerechoEsferico}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                    <input
                      type="text"
                      name="ojoDerechoCilindrico"
                      placeholder="Cilíndrico"
                      value={newFormula.ojoDerechoCilindrico}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                    <input
                      type="text"
                      name="ojoDerechoEje"
                      placeholder="Eje"
                      value={newFormula.ojoDerechoEje}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                  </div>
                </div>

                {/* Ojo Izquierdo */}
                <div className="formula-eye-section">
                  <h4>Ojo Izquierdo</h4>
                  <div className="formula-input-row">
                    <input
                      type="text"
                      name="ojoIzquierdoEsferico"
                      placeholder="Esférico"
                      value={newFormula.ojoIzquierdoEsferico}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                    <input
                      type="text"
                      name="ojoIzquierdoCilindrico"
                      placeholder="Cilíndrico"
                      value={newFormula.ojoIzquierdoCilindrico}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                    <input
                      type="text"
                      name="ojoIzquierdoEje"
                      placeholder="Eje"
                      value={newFormula.ojoIzquierdoEje}
                      onChange={handleInputChange}
                      className="formula-input"
                    />
                  </div>
                </div>

                {/* Información adicional */}
                <div className="formula-extra-info">
                  <select
                    name="tipoLente"
                    value={newFormula.tipoLente}
                    onChange={handleInputChange}
                    className="formula-select"
                  >
                    <option value="monofocal">Monofocal</option>
                    <option value="bifocal">Bifocal</option>
                    <option value="progresivo">Progresivo</option>
                    <option value="contacto">Lente de Contacto</option>
                  </select>
                  
                  <textarea
                    name="observaciones"
                    placeholder="Observaciones"
                    value={newFormula.observaciones}
                    onChange={handleInputChange}
                    className="formula-textarea"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="formula-form-actions">
                <button type="submit" className="crud-btn crud-btn-primary">
                  Guardar Fórmula
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA DE FÓRMULAS EXISTENTES */}
        <div className="formulas-list">
          {formulas.length === 0 ? (
            <div className="no-formulas">
              No hay fórmulas registradas
            </div>
          ) : (
            <div className="formulas-grid">
              {formulas.map((formula, index) => {
                const formatted = formatFormula(formula);
                return (
                  <div key={formula.id} className={`formula-card ${index === 0 ? 'current' : ''}`}>
                    <div className="formula-header">
                      <span className="formula-date">
                        {new Date(formula.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="formula-status">
                        {index === 0 ? 'ACTUAL' : 'HISTÓRICO'}
                      </span>
                    </div>
                    
                    <div className="formula-values">
                      <div className="formula-eye">
                        <div className="formula-eye-label">O.D.</div>
                        <div className="formula-eye-value">{formatted.derecho}</div>
                      </div>
                      <div className="formula-eye">
                        <div className="formula-eye-label">O.I.</div>
                        <div className="formula-eye-value">{formatted.izquierdo}</div>
                      </div>
                    </div>
                    
                    <div className="formula-footer">
                      <span className="formula-lente-type">{formula.tipoLente}</span>
                      {formula.observaciones && (
                        <div className="formula-obs">{formula.observaciones}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="crud-form-actions compact">
          <button 
            onClick={() => navigate('/admin/ventas/clientes')}
            className="crud-btn crud-btn-secondary"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}