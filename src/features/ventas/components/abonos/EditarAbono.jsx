import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function EditarAbono() {
  const navigate = useNavigate();
  const location = useLocation();
  const { abono } = location.state || {};
  
  const [formData, setFormData] = useState({
    cliente: abono?.cliente || '',
    fechaAbono: abono?.fechaAbono || '',
    montoAbonado: abono?.montoAbonado || '',
    saldoPendiente: abono?.saldoPendiente || '',
    metodoPago: abono?.metodoPago || ''
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
    
    const abonos = JSON.parse(localStorage.getItem('abonos') || '[]');
    
    const abonosActualizados = abonos.map(a => 
      a.cliente === abono.cliente && 
      a.fechaAbono === abono.fechaAbono && 
      a.montoAbonado === abono.montoAbonado
        ? {
            cliente: formData.cliente,
            fechaAbono: formData.fechaAbono,
            montoAbonado: parseFloat(formData.montoAbonado),
            saldoPendiente: parseFloat(formData.saldoPendiente),
            metodoPago: formData.metodoPago
          }
        : a
    );

    localStorage.setItem('abonos', JSON.stringify(abonosActualizados));
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!abono) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Abono no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Editar Abono</h1>
        <p>Modificar información del abono</p>
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
            <label>Fecha Abono</label>
            <input 
              type="date" 
              name="fechaAbono"
              value={formData.fechaAbono}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Monto Abonado</label>
            <input 
              type="number" 
              name="montoAbonado"
              value={formData.montoAbonado}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Saldo Pendiente</label>
            <input 
              type="number" 
              name="saldoPendiente"
              value={formData.saldoPendiente}
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