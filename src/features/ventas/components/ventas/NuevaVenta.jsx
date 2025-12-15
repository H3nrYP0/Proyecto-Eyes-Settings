import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NuevaVenta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: '',
    productos: '',
    metodoPago: '',
    total: '',
    empleado: '',
    estado: 'pendiente'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Obtener ventas existentes
    const ventasExistentes = JSON.parse(localStorage.getItem('ventas') || '[]');
    
    // Crear nueva venta
    const nuevaVenta = {
      id: 'V' + String(ventasExistentes.length + 1).padStart(3, '0'),
      cliente: formData.cliente,
      productos: formData.productos,
      metodoPago: formData.metodoPago,
      total: parseFloat(formData.total),
      empleado: formData.empleado,
      estado: formData.estado,
      fecha: new Date().toISOString().split('T')[0]
    };

    // Guardar en localStorage
    ventasExistentes.push(nuevaVenta);
    localStorage.setItem('ventas', JSON.stringify(ventasExistentes));

    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Nueva Venta</h1>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente</label>
            <input 
              type="text" 
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Productos</label>
            <textarea 
              name="productos"
              value={formData.productos}
              onChange={handleChange}
              required 
              placeholder="Describa los productos..."
            />
          </div>
          
          <div className="form-group">
            <label>Método de Pago</label>
            <select 
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar...</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Total</label>
            <input 
              type="number" 
              name="total"
              value={formData.total}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Empleado</label>
            <input 
              type="text" 
              name="empleado"
              value={formData.empleado}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}