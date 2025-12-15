import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompra } from '../../../lib/data/comprasData';
import "../../../shared/styles/components/crud-forms.css";

export default function CrearCompra() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    proveedorId: '',
    proveedorNombre: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [],
    observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevaCompra = createCompra({
      ...formData,
      subtotal: 0,
      iva: 0,
      total: 0,
      estado: "Completada"
    });

    console.log('Compra creada:', nuevaCompra);
    navigate('/admin/compras');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nueva Compra</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <label htmlFor="proveedorNombre">Proveedor <span className="crud-required">*</span></label>
              <input
                type="text"
                id="proveedorNombre"
                name="proveedorNombre"
                value={formData.proveedorNombre}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="fecha">Fecha <span className="crud-required">*</span></label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                className="crud-input crud-textarea"
                placeholder="Observaciones adicionales..."
              />
            </div>

            <div className="crud-form-group">
              {/* Columna vacía para mantener 2 columnas */}
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}