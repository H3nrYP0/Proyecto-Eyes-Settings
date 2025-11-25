import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../../../../lib/data/pedidosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const pedido = getPedidoById(Number(id));
    if (pedido) {
      setFormData(pedido);
    } else {
      navigate('/admin/ventas/pedidos');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updatePedido(Number(id), formData);
    navigate('/admin/ventas/pedidos');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editando Pedido: {formData.cliente}</h1>
        <p>Modifica la información del pedido</p>
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
                  min="0"
                  required
                />
              </div>

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
                value={formData.observaciones || ''}
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
              onClick={() => navigate('/admin/ventas/pedidos')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}