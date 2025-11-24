import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPedido } from '../../../../lib/data/pedidosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearPedido() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: '',
    productoServicio: '',
    tipo: 'Venta',
    fechaPedido: '',
    fechaEntrega: '',
    total: '',
    abono: '',
    estado: 'En proceso',
    observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevoPedido = createPedido({
      ...formData,
      total: Number(formData.total),
      abono: Number(formData.abono) || 0,
      saldoPendiente: Number(formData.total) - (Number(formData.abono) || 0)
    });
    
    console.log('Pedido creado:', nuevoPedido);
    navigate('/admin/ventas/pedidos');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calcularSaldoPendiente = () => {
    const total = Number(formData.total) || 0;
    const abono = Number(formData.abono) || 0;
    return total - abono;
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nuevo Pedido</h1>
        <p>Registra un nuevo pedido u orden de trabajo</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información del Pedido</h3>
            
            <div className="crud-form-group">
              <label htmlFor="cliente">Cliente <span className="crud-required">*</span></label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre del cliente"
                required
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="productoServicio">Producto/Servicio <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="productoServicio"
                  name="productoServicio"
                  value={formData.productoServicio}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Descripción del producto o servicio"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="tipo">Tipo <span className="crud-required">*</span></label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="Venta">Venta</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="fechaPedido">Fecha Pedido <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fechaPedido"
                  name="fechaPedido"
                  value={formData.fechaPedido}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="fechaEntrega">Fecha Entrega <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fechaEntrega"
                  name="fechaEntrega"
                  value={formData.fechaEntrega}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="total">Total <span className="crud-required">*</span></label>
                <input
                  type="number"
                  id="total"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="abono">Abono Inicial</label>
                <input
                  type="number"
                  id="abono"
                  name="abono"
                  value={formData.abono}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="0"
                  min="0"
                  max={formData.total}
                />
              </div>

              <div className="crud-form-group">
                <label>Saldo Pendiente</label>
                <input
                  type="text"
                  value={`$${calcularSaldoPendiente().toLocaleString()}`}
                  className="crud-input"
                  disabled
                  style={{background: '#f5f5f5'}}
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="estado">Estado <span className="crud-required">*</span></label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="En proceso">En proceso</option>
                  <option value="Pendiente pago">Pendiente pago</option>
                  <option value="Pagado">Pagado</option>
                  <option value="Entregado">Entregado</option>
                </select>
              </div>
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
                placeholder="Observaciones adicionales del pedido..."
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/ventas/pedidos')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}