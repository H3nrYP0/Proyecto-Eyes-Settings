import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NuevoPedido() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cliente: '',
    productoServicio: '',
    fechaPedido: '',
    fechaEntrega: '',
    total: '',
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
    
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos') || '[]');

    // Verificar si ya existe un pedido igual
    const pedidoExistente = pedidosExistentes.find(p => 
      p.cliente === formData.cliente && 
      p.productoServicio === formData.productoServicio && 
      p.fechaPedido === formData.fechaPedido
    );

    if (pedidoExistente) {
      alert("Ya existe un pedido idéntico para este cliente");
      return;
    }

    const nuevoPedido = {
      cliente: formData.cliente,
      productoServicio: formData.productoServicio,
      fechaPedido: formData.fechaPedido,
      fechaEntrega: formData.fechaEntrega,
      total: parseFloat(formData.total),
      estado: formData.estado
    };

    pedidosExistentes.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));

    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Nuevo Pedido</h1>
        <p>Registrar un nuevo pedido en el sistema</p>
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
            <label>Producto/Servicio</label>
            <input 
              type="text" 
              name="productoServicio"
              value={formData.productoServicio}
              onChange={handleChange}
              required 
              placeholder="Ej: Lentes Progresivos"
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
              Guardar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}