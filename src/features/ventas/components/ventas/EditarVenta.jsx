import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function EditarVenta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    cliente: '',
    productos: '',
    metodoPago: '',
    total: '',
    empleado: '',
    estado: ''
  });

  // Cargar datos de la venta al iniciar
  useEffect(() => {
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    const venta = ventas.find(v => v.id === id);
    if (venta) {
      setFormData({
        cliente: venta.cliente,
        productos: venta.productos,
        metodoPago: venta.metodoPago,
        total: venta.total,
        empleado: venta.empleado,
        estado: venta.estado
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Obtener ventas existentes
    const ventas = JSON.parse(localStorage.getItem('ventas') || '[]');
    
    // Actualizar venta
    const ventasActualizadas = ventas.map(venta => 
      venta.id === id 
        ? { 
            ...venta, 
            cliente: formData.cliente,
            productos: formData.productos,
            metodoPago: formData.metodoPago,
            total: parseFloat(formData.total),
            empleado: formData.empleado,
            estado: formData.estado
          }
        : venta
    );

    // Guardar en localStorage
    localStorage.setItem('ventas', JSON.stringify(ventasActualizadas));
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Editar Venta {id}</h1>
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
            <label>Productos</label>
            <textarea 
              name="productos"
              value={formData.productos}
              onChange={handleChange}
              required 
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}