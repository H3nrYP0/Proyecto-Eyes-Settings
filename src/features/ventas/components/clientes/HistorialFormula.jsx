import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { getClienteById } from '../../../../lib/data/clientesData';
import { getFormulasByClienteId, createFormula } from '../../../../lib/data/formulasData';
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-forms.css";
import "../../../../shared/styles/components/modal.css";

export default function HistorialFormula() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [modalNuevaFormula, setModalNuevaFormula] = useState({
    open: false,
  });
  const [nuevaFormula, setNuevaFormula] = useState({
    ojoDerechoEsferico: '',
    ojoDerechoCilindrico: '',
    ojoDerechoEje: '',
    ojoIzquierdoEsferico: '',
    ojoIzquierdoCilindrico: '',
    ojoIzquierdoEje: '',
    tipoLente: 'monofocal',
    observaciones: ''
  });

  // Cargar datos del cliente y fórmulas
  useEffect(() => {
    const clienteData = getClienteById(Number(id));
    if (clienteData) {
      setCliente(clienteData);
      const formulasData = getFormulasByClienteId(Number(id));
      setFormulas(formulasData);
    } else {
      navigate('/admin/clientes');
    }
  }, [id, navigate]);

  // Abrir modal para nueva fórmula
  const handleNuevaFormula = () => {
    setModalNuevaFormula({ open: true });
  };

  // Guardar nueva fórmula
  const handleGuardarFormula = () => {
    const formulaCompleta = {
      ...nuevaFormula,
      fecha: new Date().toISOString().split('T')[0],
      clienteId: Number(id)
    };
    
    createFormula(formulaCompleta);
    setFormulas(getFormulasByClienteId(Number(id)));
    setModalNuevaFormula({ open: false });
    setNuevaFormula({
      ojoDerechoEsferico: '',
      ojoDerechoCilindrico: '',
      ojoDerechoEje: '',
      ojoIzquierdoEsferico: '',
      ojoIzquierdoCilindrico: '',
      ojoIzquierdoEje: '',
      tipoLente: 'monofocal',
      observaciones: ''
    });
  };

  // Formatear fórmula para mostrar
  const formatearFormula = (formula) => {
    const formatOjo = (esf, cil, eje) => {
      if (!esf) return '-';
      let resultado = esf;
      if (cil && cil !== '0.00') resultado += ` ${cil}`;
      if (eje && eje !== '0') resultado += ` x ${eje}`;
      return resultado;
    };

    return {
      ojoDerecho: formatOjo(formula.ojoDerechoEsferico, formula.ojoDerechoCilindrico, formula.ojoDerechoEje),
      ojoIzquierdo: formatOjo(formula.ojoIzquierdoEsferico, formula.ojoIzquierdoCilindrico, formula.ojoIzquierdoEje)
    };
  };

  if (!cliente) {
    return <div>Cargando...</div>;
  }

  return (
    <CrudLayout
      title="📋 Historial de Fórmulas"
      description={`Fórmulas oftalmológicas de ${cliente.nombre} ${cliente.apellido}`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Historial de Fórmulas</h1>
          <p>Fórmulas oftalmológicas de {cliente.nombre} {cliente.apellido}</p>
        </div>
        
        <div className="crud-form-content">
          {/* Información del cliente */}
          <div className="crud-form-section">
            <h3>Información del Cliente</h3>
            
            <div className="crud-detail-grid">
              <div className="crud-detail-item">
                <strong>Nombre:</strong> 
                <span>{cliente.nombre} {cliente.apellido}</span>
              </div>
              
              <div className="crud-detail-item">
                <strong>Documento:</strong> 
                <span>{cliente.documento}</span>
              </div>

              <div className="crud-detail-item">
                <strong>Fecha Nacimiento:</strong> 
                <span>{new Date(cliente.fechaNacimiento).toLocaleDateString('es-ES')}</span>
              </div>

              <div className="crud-detail-item">
                <strong>Teléfono:</strong> 
                <span>{cliente.telefono}</span>
              </div>
            </div>
          </div>

          {/* Lista de fórmulas */}
          <div className="crud-form-section">
            <div className="section-header">
              <h3>Fórmulas Registradas</h3>
              <button 
                onClick={handleNuevaFormula}
                className="crud-btn crud-btn-primary"
              >
                + Agregar Nueva Fórmula
              </button>
            </div>
            
            {formulas.length === 0 ? (
              <div className="no-data-message">
                <p>No hay fórmulas registradas para este cliente</p>
              </div>
            ) : (
              <div className="formulas-list">
                {formulas.map((formula, index) => {
                  const formulasFormat = formatearFormula(formula);
                  return (
                    <div key={formula.id} className="formula-card">
                      <div className="formula-header">
                        <div className="formula-fecha">
                          <strong>Fecha:</strong> {new Date(formula.fecha).toLocaleDateString('es-ES')}
                        </div>
                        <span className={`formula-status ${index === 0 ? 'actual' : 'historico'}`}>
                          {index === 0 ? '🟢 Actual' : '🔵 Histórico'}
                        </span>
                      </div>
                      
                      <div className="formula-details">
                        <div className="formula-ojos">
                          <div className="ojo-info">
                            <label>Ojo Derecho (OD)</label>
                            <span className="formula-valor">{formulasFormat.ojoDerecho}</span>
                          </div>
                          <div className="ojo-info">
                            <label>Ojo Izquierdo (OI)</label>
                            <span className="formula-valor">{formulasFormat.ojoIzquierdo}</span>
                          </div>
                        </div>
                        
                        <div className="formula-meta">
                          <div className="meta-item">
                            <label>Tipo de Lente:</label>
                            <span className="lente-tipo">{formula.tipoLente}</span>
                          </div>
                        </div>
                        
                        {formula.observaciones && (
                          <div className="formula-observaciones">
                            <label>Observaciones:</label>
                            <p>{formula.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="crud-form-actions">
            <button 
              onClick={() => navigate('/admin/ventas/clientes')}
              className="crud-btn crud-btn-secondary"
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {/* Modal para nueva fórmula */}
      <Modal
        open={modalNuevaFormula.open}
        type="info"
        title="Agregar Nueva Fórmula"
        showCancel={true}
        confirmText="Guardar Fórmula"
        cancelText="Cancelar"
        onConfirm={handleGuardarFormula}
        onCancel={() => setModalNuevaFormula({ open: false })}
      >
        <div className="formula-form">
          <div className="crud-form-row">
            <div className="crud-form-group">
              <label>Ojo Derecho - Esférico</label>
              <input
                type="text"
                value={nuevaFormula.ojoDerechoEsferico}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoDerechoEsferico: e.target.value})}
                className="crud-input"
                placeholder="Ej: -2.50"
              />
            </div>
            <div className="crud-form-group">
              <label>Ojo Derecho - Cilíndrico</label>
              <input
                type="text"
                value={nuevaFormula.ojoDerechoCilindrico}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoDerechoCilindrico: e.target.value})}
                className="crud-input"
                placeholder="Ej: -0.75"
              />
            </div>
            <div className="crud-form-group">
              <label>Ojo Derecho - Eje</label>
              <input
                type="text"
                value={nuevaFormula.ojoDerechoEje}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoDerechoEje: e.target.value})}
                className="crud-input"
                placeholder="Ej: 180"
              />
            </div>
          </div>

          <div className="crud-form-row">
            <div className="crud-form-group">
              <label>Ojo Izquierdo - Esférico</label>
              <input
                type="text"
                value={nuevaFormula.ojoIzquierdoEsferico}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoIzquierdoEsferico: e.target.value})}
                className="crud-input"
                placeholder="Ej: -2.25"
              />
            </div>
            <div className="crud-form-group">
              <label>Ojo Izquierdo - Cilíndrico</label>
              <input
                type="text"
                value={nuevaFormula.ojoIzquierdoCilindrico}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoIzquierdoCilindrico: e.target.value})}
                className="crud-input"
                placeholder="Ej: -0.50"
              />
            </div>
            <div className="crud-form-group">
              <label>Ojo Izquierdo - Eje</label>
              <input
                type="text"
                value={nuevaFormula.ojoIzquierdoEje}
                onChange={(e) => setNuevaFormula({...nuevaFormula, ojoIzquierdoEje: e.target.value})}
                className="crud-input"
                placeholder="Ej: 175"
              />
            </div>
          </div>

          <div className="crud-form-row">
            <div className="crud-form-group">
              <label>Tipo de Lente</label>
              <select
                value={nuevaFormula.tipoLente}
                onChange={(e) => setNuevaFormula({...nuevaFormula, tipoLente: e.target.value})}
                className="crud-input"
              >
                <option value="monofocal">Monofocal</option>
                <option value="bifocal">Bifocal</option>
                <option value="progresivo">Progresivo</option>
                <option value="contacto">Lentes de Contacto</option>
              </select>
            </div>
          </div>

          <div className="crud-form-group">
            <label>Observaciones</label>
            <textarea
              value={nuevaFormula.observaciones}
              onChange={(e) => setNuevaFormula({...nuevaFormula, observaciones: e.target.value})}
              rows="3"
              className="crud-input crud-textarea"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>
      </Modal>
    </CrudLayout>
  );
}