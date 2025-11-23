import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompra } from '../../../lib/data/comprasData';

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
    
    // Crear la compra
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
    <div className="categoria-form">
      <h1>Crear Nueva Compra</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="proveedorNombre">Proveedor <span className="required">*</span></label>
          <input
            type="text"
            id="proveedorNombre"
            name="proveedorNombre"
            value={formData.proveedorNombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha <span className="required">*</span></label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/compras')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Crear Compra
          </button>
        </div>
      </form>
    </div>
  );
}