import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function EditarCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cliente } = location.state || {};
  
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    apellido: cliente?.apellido || '',
    documento: cliente?.documento || '',
    telefono: cliente?.telefono || '',
    correo: cliente?.correo || '',
    ciudad: cliente?.ciudad || '',
    fechaNacimiento: cliente?.fechaNacimiento || '',
    genero: cliente?.genero || ''
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
    
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    
    const clientesActualizados = clientes.map(c => 
      c.documento === cliente.documento && 
      c.nombre === cliente.nombre && 
      c.apellido === cliente.apellido
        ? {
            nombre: formData.nombre,
            apellido: formData.apellido,
            documento: formData.documento,
            telefono: formData.telefono,
            correo: formData.correo,
            ciudad: formData.ciudad,
            fechaNacimiento: formData.fechaNacimiento,
            genero: formData.genero
          }
        : c
    );

    localStorage.setItem('clientes', JSON.stringify(clientesActualizados));
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!cliente) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Cliente no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Editar Cliente</h1>
        <p>Modificar información del cliente</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Apellido</label>
            <input 
              type="text" 
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Documento</label>
            <input 
              type="text" 
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input 
              type="email" 
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input 
              type="text" 
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Género</label>
            <select 
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
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