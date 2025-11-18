                                                                                                                                                        import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NuevoCliente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    correo: '',
    ciudad: '',
    fechaNacimiento: '',
    genero: ''
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
    
    const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
    
    const documentoExistente = clientesExistentes.find(c => c.documento === formData.documento);
    if (documentoExistente) {
      alert("Ya existe un cliente con este documento");
      return;
    }

    const nuevoCliente = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      documento: formData.documento,
      telefono: formData.telefono,
      correo: formData.correo,
      ciudad: formData.ciudad,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero
    };

    clientesExistentes.push(nuevoCliente);
    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Nuevo Cliente</h1>
        <p>Registrar un nuevo cliente en el sistema</p>
      </div>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
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
              <option value="">Seleccionar...</option>
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
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}