import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function EditarPedido() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pedido } = location.state || {};
  
  const [formData, setFormData] = useState({
    cliente: pedido?.cliente || '',
    productoServicio: pedido?.productoServicio || '',
    fechaPedido: pedido?.fechaPedido || '',
    fechaEntrega: pedido?.fechaEntrega || '',
    total: pedido?.total || '',
    estado: pedido?.estado || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    
    const pedidosActualizados = pedidos.map(p => 
      p.cliente === pedido.cliente && 
      p.productoServicio === pedido.productoServicio && 
      p.fechaPedido === pedido.fechaPedido
        ? {
            cliente: formData.cliente,
            productoServicio: formData.productoServicio,
            fechaPedido: formData.fechaPedido,
            fechaEntrega: formData.fechaEntrega,
            total: parseFloat(formData.total),
            estado: formData.estado
          }
        : p
    );

    localStorage.setItem('pedidos', JSON.stringify(pedidosActualizados));
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!pedido) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Pedido no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Editar Pedido</h1>
        <p>Modificar información del pedido</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSave}>
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
            <label>Producto/Servicio</label>
            <input 
              type="text" 
              name="productoServicio"
              value={formData.productoServicio}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Fecha Pedido</label>
            <input 
              type="date" 
              name="fechaPedido"
              value={formData.fechaPedido}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Fecha Entrega</label>
            <input 
              type="date" 
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleChange}
              required 
            />
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
            <label>Estado</label>
            <select 
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}